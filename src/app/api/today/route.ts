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
      return NextResponse.json(
        {
          available: false,
          date: today,
          subject: todayTopic.subject,
          topic: todayTopic.topic,
          subjectEmoji: todayTopic.subjectEmoji,
          message: "අද දවසේ ප්‍රශ්නාවලිය තවම සකස් කර නැත. ටික වේලාවකින් නැවත උත්සාහ කරන්න.",
        },
        { status: 404 }
      );
    }

    // Return quiz data WITHOUT correct answers (for security)
    const safeQuestions = quizData.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      // Do NOT include correctAnswer or explanation here
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
