import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// JSON schema for structured quiz output
const quizResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    date: { type: SchemaType.STRING, description: "Today's date in YYYY-MM-DD format" },
    subject: { type: SchemaType.STRING, description: "Subject name in Sinhala" },
    topic: { type: SchemaType.STRING, description: "Topic name in Sinhala" },
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.NUMBER },
          question: { type: SchemaType.STRING, description: "Question text in Sinhala" },
          options: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 options in Sinhala"
          },
          correctAnswer: {
            type: SchemaType.NUMBER,
            description: "Index of correct answer (0, 1, or 2)"
          },
          explanation: {
            type: SchemaType.STRING,
            description: "Simple explanation in Sinhala suitable for a 10-year-old"
          },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation"],
      },
    },
  },
  required: ["date", "subject", "topic", "questions"],
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  date: string;
  subject: string;
  topic: string;
  questions: QuizQuestion[];
}

export async function generateQuiz(
  subject: string,
  topic: string,
  pastPaperSamples: string
): Promise<QuizData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: quizResponseSchema,
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const prompt = `ඔබ ශ්‍රී ලංකාවේ 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයට (Grade 5 Scholarship Exam) දරුවන් සූදානම් කරන ප්‍රවීණ ගුරුවරයෙකි.

අද දිනය: ${today}
විෂය: ${subject}
මාතෘකාව: ${topic}

ශිෂ්‍යත්ව විභාග past paper ප්‍රශ්න රටා:
${pastPaperSamples}

ඉහත past paper රටා අනුව, "${topic}" මාතෘකාවට අදාළ MCQ ප්‍රශ්න 5ක් සිංහලෙන් ලියන්න.

අනිවාර්ය නීති:
1. සෑම ප්‍රශ්නයකටම විකල්ප 3ක් (අ, ආ, ඇ) පමණක් තිබිය යුතුය
2. 5 වසර දරුවෙකුට (වයස 9-10) තේරුම් ගත හැකි සරල, පැහැදිලි සිංහල භාවිත කරන්න
3. සෑම ප්‍රශ්නයකටම කෙටි, පැහැදිලි විවරණයක් (explanation) ලියන්න - දරුවෙකුට තේරුම් ගත හැකි ලෙස
4. ප්‍රශ්න past paper විභාග මට්ටමට ගැළපිය යුතුය
5. ප්‍රශ්න එකිනෙකට වෙනස් විය යුතුය (විවිධ sub-topics ආවරණය කරන්න)
6. correctAnswer යනු options array එකේ index එකයි (0, 1, හෝ 2)
7. date field එකට "${today}" යොදන්න

JSON format එකෙන් return කරන්න.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  try {
    const quizData: QuizData = JSON.parse(text);

    // Validate the response
    if (!quizData.questions || quizData.questions.length !== 5) {
      throw new Error("Expected exactly 5 questions");
    }

    for (const q of quizData.questions) {
      if (!q.options || q.options.length !== 3) {
        throw new Error(`Question ${q.id} must have exactly 3 options`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 2) {
        throw new Error(`Question ${q.id} has invalid correctAnswer index`);
      }
    }

    return quizData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error(`Failed to generate valid quiz: ${error}`);
  }
}
