import { NextResponse } from "next/server";
import { loadQuizData } from "../../../lib/google-sheets";
import { getTodayTopic } from "../../../lib/topic-scheduler";
import type { QuizData } from "../../../lib/gemini";

/**
 * GET /api/today
 * 
 * Returns today's quiz data for the frontend.
 * Fetches from Google Sheets "Quiz Data" tab.
 */
export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const todayTopic = getTodayTopic();

    // Try to load from Google Sheets
    let quizData: QuizData | null = null;

    try {
      const quizJson = await loadQuizData(today);
      if (quizJson) {
        quizData = JSON.parse(quizJson);
      }
    } catch (error) {
      console.error("Failed to load quiz from Google Sheets:", error);
    }

    if (!quizData) {
      // Auto-generate on the fly if not in sheets yet!
      try {
        const { generateQuiz } = await import("../../../lib/gemini");
        const { getPastPaperSamples } = await import("../../../lib/past-paper-bank");
        const { saveQuizData, logDailyQuiz } = await import("../../../lib/google-sheets");

        const samples = getPastPaperSamples(todayTopic.subject, todayTopic.topic);
        quizData = await generateQuiz(todayTopic.subject, todayTopic.topic, samples);

        // Try to cache in sheets in background
        if (quizData) {
          const quizJson = JSON.stringify(quizData);
          saveQuizData(today, quizJson).catch(console.error);
          logDailyQuiz(today, todayTopic.subject, todayTopic.topic, today, "").catch(console.error);
        }
      } catch (genError) {
        console.error("Auto-generate failed, using default quiz bank:", genError);
        const { getDefaultQuiz } = await import("../../../lib/default-quizzes");
        quizData = getDefaultQuiz(todayTopic.subject);
      }
    }

    // Return quiz data WITHOUT correct answers (for security)
    const safeQuestions = quizData.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      available: true,
      date: quizData.date,
      subject: quizData.subject,
      topic: quizData.topic,
      subjectEmoji: todayTopic.subjectEmoji,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Failed to fetch today's quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz data" },
      { status: 500 }
    );
  }
}
