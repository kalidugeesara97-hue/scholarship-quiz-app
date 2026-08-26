import { NextResponse } from "next/server";
import { loadQuizData } from "../../../lib/google-sheets";
import { recordStudentScore, incrementParticipantCount } from "../../../lib/google-sheets";
import type { QuizData } from "../../../lib/gemini";

interface SubmitRequest {
  studentName: string;
  answers: number[]; // array of selected option indices
  date?: string;
}

/**
 * POST /api/submit
 * 
 * Auto-grades a student's quiz submission:
 * 1. Loads quiz data with correct answers
 * 2. Compares student answers
 * 3. Records score to Google Sheet
 * 4. Returns score + explanations
 */
export async function POST(request: Request) {
  try {
    const body: SubmitRequest = await request.json();
    const { studentName, answers, date: dateOverride } = body;

    if (!studentName || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "studentName and answers[] are required" },
        { status: 400 }
      );
    }

    const today = dateOverride || new Date().toISOString().split("T")[0];

    // Load quiz data with correct answers
    let quizData: QuizData | null = null;
    try {
      const quizJson = await loadQuizData(today);
      if (quizJson) {
        quizData = JSON.parse(quizJson);
      }
    } catch (e) {
      console.error("Failed to load quiz from sheets for grading:", e);
    }

    if (!quizData) {
      const { getDefaultQuiz } = await import("../../../lib/default-quizzes");
      quizData = getDefaultQuiz();
    }

    // Grade the answers
    let score = 0;
    const results = quizData.questions.map((q, i) => {
      const studentAnswer = answers[i];
      const isCorrect = studentAnswer === q.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const questionResults = results.map((r) => r.isCorrect);
    const submitTime = new Date().toLocaleTimeString("si-LK", {
      timeZone: "Asia/Colombo",
    });

    // Record to Google Sheet
    try {
      await recordStudentScore(
        today,
        studentName,
        quizData.subject,
        quizData.topic,
        score,
        quizData.questions.length,
        questionResults,
        submitTime
      );
      await incrementParticipantCount(today);
    } catch (sheetError) {
      console.error("Failed to record score to Google Sheets:", sheetError);
      // Continue — still return results to student
    }

    return NextResponse.json({
      success: true,
      studentName,
      date: today,
      subject: quizData.subject,
      topic: quizData.topic,
      score,
      totalQuestions: quizData.questions.length,
      percentage: Math.round((score / quizData.questions.length) * 100),
      results,
    });
  } catch (error) {
    console.error("Submit failed:", error);
    return NextResponse.json(
      { error: "Submission failed", details: String(error) },
      { status: 500 }
    );
  }
}
