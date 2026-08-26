import { google, sheets_v4 } from "googleapis";

let sheetsClient: sheets_v4.Sheets | null = null;

function getCredentials() {
  const credsBase64 = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credsBase64) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS environment variable is not set");
  }
  return JSON.parse(Buffer.from(credsBase64, "base64").toString("utf-8"));
}

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const credentials = getCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    throw new Error("GOOGLE_SHEET_ID environment variable is not set");
  }
  return id;
}

/**
 * Log a new quiz entry to the "Daily Log" sheet tab
 */
export async function logDailyQuiz(
  date: string,
  subject: string,
  topic: string,
  quizId: string,
  quizLink: string
): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Daily Log!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[date, subject, topic, 5, quizLink, 0]],
    },
  });
}

/**
 * Record a student's quiz submission to the "Student Scores" tab
 */
export async function recordStudentScore(
  date: string,
  studentName: string,
  subject: string,
  topic: string,
  score: number,
  totalQuestions: number,
  questionResults: boolean[],
  submitTime: string
): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const resultSymbols = questionResults.map((r) => (r ? "✅" : "❌"));

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Student Scores!A:K",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          date,
          studentName,
          subject,
          topic,
          `${score}/${totalQuestions}`,
          ...resultSymbols,
          submitTime,
        ],
      ],
    },
  });
}

/**
 * Save quiz JSON data to the "Quiz Data" tab for persistent storage
 */
export async function saveQuizData(
  date: string,
  quizJson: string
): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Quiz Data!A:B",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[date, quizJson]],
    },
  });
}

/**
 * Load quiz data for a specific date from "Quiz Data" tab
 */
export async function loadQuizData(date: string): Promise<string | null> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Quiz Data!A:B",
    });

    const rows = response.data.values;
    if (!rows) return null;

    // Find the row for the given date (search from end for latest)
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i][0] === date) {
        return rows[i][1];
      }
    }

    return null;
  } catch {
    console.error("Failed to load quiz data for date:", date);
    return null;
  }
}

/**
 * Update the participant count in "Daily Log" for a given date
 */
export async function incrementParticipantCount(date: string): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Daily Log!A:F",
    });

    const rows = response.data.values;
    if (!rows) return;

    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i][0] === date) {
        const currentCount = parseInt(rows[i][5] || "0", 10);
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Daily Log!F${i + 1}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[currentCount + 1]],
          },
        });
        break;
      }
    }
  } catch (error) {
    console.error("Failed to increment participant count:", error);
  }
}

/**
 * Initialize the Google Sheet with required tabs and headers
 * (Call this once during setup)
 */
export async function initializeSheet(): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const tabConfigs = [
    {
      name: "Daily Log",
      headers: ["දිනය", "විෂය", "මාතෘකාව", "ප්‍රශ්න ගණන", "Quiz Link", "සහභාගී ළමුන්"],
    },
    {
      name: "Student Scores",
      headers: [
        "දිනය", "ළමයාගේ නම", "විෂය", "මාතෘකාව", "ලකුණු",
        "Q1", "Q2", "Q3", "Q4", "Q5", "Submit වේලාව",
      ],
    },
    {
      name: "Quiz Data",
      headers: ["දිනය", "Quiz JSON"],
    },
  ];

  // Get existing sheet tabs
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTabs = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];

  for (const config of tabConfigs) {
    if (!existingTabs.includes(config.name)) {
      // Create the tab
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: config.name },
              },
            },
          ],
        },
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${config.name}!A1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [config.headers],
        },
      });
    }
  }
}
