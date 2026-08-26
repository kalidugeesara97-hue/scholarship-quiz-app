import { NextResponse } from "next/server";
import { generateQuiz } from "../../../lib/gemini";
import { getTodayTopic } from "../../../lib/topic-scheduler";
import { getPastPaperSamples } from "../../../lib/past-paper-bank";
import { logDailyQuiz, saveQuizData } from "../../../lib/google-sheets";
import { sendDailyQuizNotification } from "../../../lib/telegram";
import { sendDailyWhatsAppNotification } from "../../../lib/whatsapp";

/**
 * POST /api/generate-quiz
 * 
 * Triggered by Vercel Cron (daily at 6:00 AM SL time) or manually.
 * 1. Selects today's topic from the rotation schedule
 * 2. Gets past paper patterns for the topic
 * 3. Calls Gemini API to generate 5 MCQ questions
 * 4. Saves quiz data to Google Sheets
 * 5. Sends Telegram & WhatsApp notifications with quiz link
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get today's topic
    const todayTopic = getTodayTopic();
    console.log(`[Quiz Gen] Today's topic: ${todayTopic.subject} - ${todayTopic.topic}`);

    // 2. Get past paper samples
    const samples = getPastPaperSamples(todayTopic.subject, todayTopic.topic);

    // 3. Generate quiz via Gemini
    console.log("[Quiz Gen] Calling Gemini API...");
    const quizData = await generateQuiz(todayTopic.subject, todayTopic.topic, samples);
    console.log("[Quiz Gen] Quiz generated successfully");

    // 4. Save to Google Sheets
    const today = new Date().toISOString().split("T")[0];
    const quizJson = JSON.stringify(quizData);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://scholarship-quiz.vercel.app";
    const quizLink = `${baseUrl}/quiz`;

    try {
      await saveQuizData(today, quizJson);
      await logDailyQuiz(today, todayTopic.subject, todayTopic.topic, today, quizLink);
      console.log("[Quiz Gen] Saved to Google Sheets");
    } catch (sheetError) {
      console.error("[Quiz Gen] Google Sheets save failed:", sheetError);
      // Continue even if Sheets fails — quiz is still available via local fallback
    }

    // 5. Send Telegram notification
    try {
      await sendDailyQuizNotification(
        todayTopic.subject,
        todayTopic.topic,
        todayTopic.subjectEmoji,
        quizLink
      );
      console.log("[Quiz Gen] Telegram notification sent");
    } catch (telegramError) {
      console.error("[Quiz Gen] Telegram notification failed:", telegramError);
    }

    // 6. Send WhatsApp notification (if API configured)
    try {
      await sendDailyWhatsAppNotification(
        todayTopic.subject,
        todayTopic.topic,
        todayTopic.subjectEmoji,
        quizLink
      );
      console.log("[Quiz Gen] WhatsApp notification processed");
    } catch (whatsappError) {
      console.error("[Quiz Gen] WhatsApp notification failed:", whatsappError);
    }

    return NextResponse.json({
      success: true,
      date: today,
      subject: todayTopic.subject,
      topic: todayTopic.topic,
      questionsCount: quizData.questions.length,
      quizLink,
    });
  } catch (error) {
    console.error("[Quiz Gen] Failed:", error);
    return NextResponse.json(
      { error: "Quiz generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
