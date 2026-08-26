/**
 * WhatsApp Notification Service
 * Supports multiple methods:
 * 1. Green-API / UltraMsg / CallMeBot (Automated WhatsApp API)
 * 2. Meta WhatsApp Cloud API (Official)
 * 3. One-Click WhatsApp Web/App Share link generation
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || ""; // e.g. https://api.green-api.com/waInstance.../sendMessage/...
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || "";
const WHATSAPP_CHAT_ID = process.env.WHATSAPP_CHAT_ID || ""; // Group ID or Phone number (e.g., 9477xxxxxxx@c.us or 1203630xxxx@g.us)

/**
 * Format the Sinhala daily quiz message for WhatsApp (supports WhatsApp formatting like *bold*, _italic_)
 */
export function formatWhatsAppQuizMessage(
  subject: string,
  topic: string,
  subjectEmoji: string,
  quizLink: string
): string {
  const today = new Date().toLocaleDateString("si-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `📚 *අද දවසේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය*

📅 *දිනය:* ${today}
${subjectEmoji} *විෂය:* ${subject}
📋 *මාතෘකාව:* ${topic}
❓ *ප්‍රශ්න ගණන:* 5

👉 *ප්‍රශ්නාවලියට සහභාගී වීමට:*
${quizLink}

⏰ අද ප්‍රශ්නාවලියට පිළිතුරු දී ඔබේ දැනුම පරීක්ෂා කරගන්න!
🏆 ලකුණු 5/5 ගත හැකිද බලන්න!

— *සුමිත් සර්ගේ 5 ශ්‍රේණිය ශිෂ්‍යත්ව පන්තිය* 📖`;
}

/**
 * Generate a direct "click-to-chat" WhatsApp share link
 * Anyone can click this link to instantly open WhatsApp and send the pre-written message to any chat/group
 */
export function generateWhatsAppShareLink(
  subject: string,
  topic: string,
  subjectEmoji: string,
  quizLink: string
): string {
  const message = formatWhatsAppQuizMessage(subject, topic, subjectEmoji, quizLink);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Automatically send WhatsApp message via API (Green-API / UltraMsg / Gateway)
 */
export async function sendDailyWhatsAppNotification(
  subject: string,
  topic: string,
  subjectEmoji: string,
  quizLink: string
): Promise<boolean> {
  if (!WHATSAPP_API_URL || !WHATSAPP_CHAT_ID) {
    console.log("WhatsApp automated API not configured. One-click share link is still available.");
    return false;
  }

  const message = formatWhatsAppQuizMessage(subject, topic, subjectEmoji, quizLink);

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: WHATSAPP_CHAT_ID,
        message: message,
        ...(WHATSAPP_API_TOKEN ? { token: WHATSAPP_API_TOKEN } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WhatsApp API error:", errorText);
      return false;
    }

    console.log("WhatsApp automated notification sent successfully!");
    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message via API:", error);
    return false;
  }
}
