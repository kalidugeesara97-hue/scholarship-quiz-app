# 📚 සුමිත් සර්ගේ ශිෂ්‍යත්ව දෛනික ප්‍රශ්නාවලී පද්ධතිය

> **Automated Daily Quiz System for Grade 5 Scholarship Students**

5 ශ්‍රේණිය ශිෂ්‍යත්ව පන්ති දරුවන් සඳහා, **Gemini AI** මඟින් දිනපතා ස්වයංක්‍රීයව MCQ ප්‍රශ්නාවලී ජනනය කරන, ළමා-හිතකාමී web app එකක්.

## ✨ විශේෂාංග

- 🤖 **AI-Generated Questions** — Gemini 2.0 Flash මඟින් past paper patterns base කරගෙන සිංහලෙන් MCQ ජනනය
- ⏰ **Daily Automation** — උදෑසන 6:00 ට ස්වයංක්‍රීයව quiz ready
- 📱 **Child-Friendly UI** — Mobile-first, large buttons, instant feedback, confetti celebrations
- 📊 **Google Sheet Dashboard** — සියලු ළමුන්ගේ ලකුණු එක තැනකින් track
- 🤖 **Telegram Bot** — දිනපතා quiz link ස්වයංක්‍රීයව group එකට share
- 💰 **සම්පූර්ණයෙන්ම නොමිලේ** — Vercel + Gemini + Google Sheets free tiers

## 🚀 Setup Guide

### පියවර 1: Gemini API Key

1. [Google AI Studio](https://aistudio.google.com/) වෙත යන්න
2. API Key එකක් create කරන්න
3. Copy කරගන්න

### පියවර 2: Google Sheet + Service Account

1. [Google Cloud Console](https://console.cloud.google.com/) → New Project
2. **Google Sheets API** enable කරන්න
3. **IAM & Admin → Service Accounts** → Create → JSON key download
4. Google Sheet එකක් create කරන්න (tabs 3ක් auto-create වේ)
5. Service Account email එකට Sheet එකේ **Editor** access දෙන්න
6. JSON key file එක base64 encode කරන්න:
   ```bash
   # Mac/Linux:
   base64 -i service-account-key.json | tr -d '\n'
   
   # Windows PowerShell:
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account-key.json"))
   ```

### පියවර 3: Telegram Bot (Optional)

1. Telegram → **@BotFather** → `/newbot`
2. Bot token ලබාගන්න
3. Bot එක ඔබේ class group එකට add කරන්න
4. Chat ID ලබාගන්න:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```

### පියවර 4: Deploy to Vercel

1. මෙම repo එක GitHub වෙත push කරන්න
2. [Vercel](https://vercel.com) → Import Project
3. **Environment Variables** add කරන්න:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Gemini API key |
| `GOOGLE_SHEETS_CREDENTIALS` | Base64 encoded service account JSON |
| `GOOGLE_SHEET_ID` | Spreadsheet ID (URL එකෙන්) |
| `NEXT_PUBLIC_BASE_URL` | Vercel deploy URL |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | Telegram group chat ID |
| `CRON_SECRET` | Random string for cron security |

4. **Deploy** → Done! 🎉

### පියවර 5: Initial Setup

Deploy වූ පසු, Google Sheet tabs initialize කිරීමට:
```
GET https://your-app.vercel.app/api/generate-quiz
```
(Vercel Dashboard → Functions → Trigger manually)

## 📱 Usage

- **දරුවන්:** `https://your-app.vercel.app` → නම select → quiz start
- **තාත්තා:** Google Sheet Dashboard එකෙන් ලකුණු review
- **Automation:** දිනපතා 6AM ට quiz auto-generate + Telegram notify

## 🗂️ Project Structure

```
scholarship-quiz/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (Sinhala fonts)
│   │   ├── page.tsx             # Landing page
│   │   ├── quiz/page.tsx        # Quiz interface
│   │   ├── results/page.tsx     # Score + explanations
│   │   └── api/
│   │       ├── generate-quiz/   # Cron → Gemini → quiz
│   │       ├── today/           # Get today's quiz
│   │       └── submit/          # Auto-grade + record
│   └── lib/
│       ├── gemini.ts            # Gemini API client
│       ├── google-sheets.ts     # Sheets integration
│       ├── topic-scheduler.ts   # Topic rotation
│       ├── past-paper-bank.ts   # Past paper patterns
│       └── telegram.ts          # Bot notifications
├── data/
│   ├── topics.json              # Subjects + topics
│   ├── past-paper-samples.json  # Question patterns
│   └── students.json            # Student name list
├── vercel.json                  # Cron config
└── .env.example                 # Env template
```

## 📝 දරුවන්ගේ නම් යාවත්කාලීන කිරීම

`data/students.json` file එක edit කරන්න:
```json
["කසුන්", "නිමේෂ", "අලූත් නම"]
```

## 🔧 Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your actual values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📄 License

MIT — සුමිත් සර්ගේ ශිෂ්‍යත්ව පන්තිය සඳහා සාදන ලදී.
