const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

/**
 * Send a message to a Telegram group/channel via the Bot API.
 * No library dependency — uses simple fetch.
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot credentials not configured. Skipping notification.");
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

/**
 * Format and send daily quiz notification to the Telegram group
 */
export async function sendDailyQuizNotification(
  subject: string,
  topic: string,
  subjectEmoji: string,
  quizLink: string
): Promise<boolean> {
  const today = new Date().toLocaleDateString("si-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const message = `📚 <b>අද දවසේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය</b>

📅 ${today}
${subjectEmoji} <b>විෂය:</b> ${subject}
📋 <b>මාතෘකාව:</b> ${topic}
❓ <b>ප්‍රශ්න:</b> 5

👉 <a href="${quizLink}">ප්‍රශ්නාවලිය පටන් ගන්න</a>

⏰ අද ප්‍රශ්නාවලියට පිළිතුරු දී ඔබේ දැනුම පරීක්ෂා කරගන්න!
🏆 ලකුණු 5/5 ගත හැකිද බලන්න!

— සුමිත් සර්ගේ ශිෂ්‍යත්ව පන්තිය 📖`;

  return sendTelegramMessage(message);
}
