import { NextResponse } from "next/server";
import { askSumithSirAssistant } from "../../../lib/gemini";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const reply = await askSumithSirAssistant(message, history || []);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "සමාවෙන්න, සුළු තාක්ෂණික දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න. 😊" },
      { status: 200 }
    );
  }
}
