'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type QuestionResult = {
  questionId: number
  question: string
  options: string[]
  studentAnswer: number
  correctAnswer: number
  isCorrect: boolean
  explanation: string
}

type QuizResults = {
  success?: boolean
  studentName: string
  date?: string
  subject?: string
  topic?: string
  score: number
  totalQuestions: number
  percentage?: number
  results: QuestionResult[]
  error?: boolean
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults')
    if (stored) {
      const data: QuizResults = JSON.parse(stored)
      setResults(data)
      if (data.score >= 3) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [])

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center rounded-3xl bg-white p-8 shadow-xl max-w-md w-full border border-blue-100">
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-2xl font-black text-gray-800 mb-2">ප්‍රතිඵල හමු නොවීය</p>
          <p className="text-gray-500 mb-6 font-medium">කරුණාකර මුල් පිටුවට ගොස් ප්‍රශ්නාවලිය ආරම්භ කරන්න.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-white font-extrabold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            මුල් පිටුවට යන්න 🏠
          </button>
        </div>
      </div>
    )
  }

  const { score, totalQuestions, results: questionResults, studentName, subject, topic } = results
  const percentage = Math.round((score / totalQuestions) * 100)
  const optionLabels = ['(1)', '(2)', '(3)']

  let emoji = '🏆'
  let message = ''
  let subMessage = ''
  let badgeColor = 'from-amber-400 to-yellow-500 text-amber-950'

  if (score >= 5) {
    emoji = '👑'
    message = 'විශිෂ්ටයි! සම්පූර්ණ ලකුණු!'
    subMessage = 'ඔබ අද දවසේ ශිෂ්‍යත්ව සුපිරි තරුවක්! 🌟'
    badgeColor = 'from-yellow-400 via-amber-400 to-yellow-500 text-yellow-950 shadow-yellow-500/30'
  } else if (score >= 4) {
    emoji = '🎉'
    message = 'හරිම දක්ෂයි! ඉතා හොඳයි!'
    subMessage = 'ශිෂ්‍යත්ව විභාගයට ඔබේ සූදානම විශිෂ්ටයි! 🚀'
    badgeColor = 'from-emerald-400 to-green-500 text-emerald-950 shadow-green-500/30'
  } else if (score >= 3) {
    emoji = '💪'
    message = 'හොඳ උත්සාහයක්!'
    subMessage = 'තව ටිකක් පුහුණු වෙමු, හෙට නැවත උත්සාහ කරමු!'
    badgeColor = 'from-blue-400 to-indigo-500 text-white shadow-blue-500/30'
  } else {
    emoji = '📖'
    message = 'තව පුහුණු වෙමු!'
    subMessage = 'වරදින තරමටයි පාඩම හොඳින් මතක හිටින්නේ. හෙට නැවත එන්න!'
    badgeColor = 'from-purple-400 to-pink-500 text-white shadow-purple-500/30'
  }

  const confettiColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bb5', '#845ec2', '#00c9a7']

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-8 px-4 max-w-lg mx-auto">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '3px',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Results Hero Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-center mb-6 border-4 border-blue-100 relative overflow-hidden">
        
        {/* Big Emoji */}
        <div className="text-6xl sm:text-7xl mb-3 animate-bounce">{emoji}</div>

        {/* Student Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 font-extrabold text-sm mb-3 border border-blue-200">
          👦 {studentName} ගේ ප්‍රතිඵලය
        </div>

        {/* Score Ring / Display */}
        <div className="my-2">
          <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-inner">
            <span className="text-5xl sm:text-6xl font-black text-blue-900 tracking-tight">
              {score} <span className="text-3xl text-gray-400 font-bold">/ {totalQuestions}</span>
            </span>
            <span className="text-sm font-extrabold text-blue-700 mt-1">
              ලකුණු ප්‍රතිශතය: {percentage}%
            </span>
          </div>
        </div>

        {/* Feedback Message */}
        <h2 className="text-2xl font-black text-gray-900 mt-4 leading-snug">
          {message}
        </h2>
        <p className="text-sm font-bold text-gray-600 mt-1 leading-relaxed">
          {subMessage}
        </p>

        {/* Share Score on WhatsApp */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🏆 *මම සුමිත් සර්ගේ ශිෂ්‍යත්ව ප්‍රශ්නාවලියට සහභාගී වුණා!*\n\n👦 *නම:* ${studentName}\n📊 *මගේ ලකුණු:* ${score}/${totalQuestions} (${percentage}%)\n📖 *විෂය:* ${subject || 'ශිෂ්‍යත්ව පුහුණුව'}\n\n👉 *ඔබත් දැන්ම ප්‍රශ්නාවලියට සහභාගී වී ලකුණු බලන්න:*\n${typeof window !== 'undefined' ? window.location.origin : ''}\n\n— *සුමිත් සර්ගේ පන්තිය*`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full min-h-[50px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md active:scale-95 transition-all"
          >
            <span className="text-xl">📲</span>
            <span>ලකුණු WhatsApp එකට Share කරන්න</span>
          </a>
        </div>

      </div>

      {/* Review All Questions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span>📋</span> ප්‍රශ්න සහ නිවැරදි විවරණ
          </h3>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-blue-800 shadow-sm border border-blue-100">
            ප්‍රශ්න {totalQuestions} යි
          </span>
        </div>

        <div className="space-y-4">
          {questionResults && questionResults.map((r, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-5 border-2 shadow-sm ${
                r.isCorrect ? 'bg-white border-green-300' : 'bg-white border-red-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  r.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {r.isCorrect ? '✓' : '✗'}
                </span>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">ප්‍රශ්න අංක 0{idx + 1}</p>
                  <p className="font-extrabold text-gray-900 text-base leading-snug mt-0.5">{r.question}</p>
                </div>
              </div>

              {/* Options Breakdown */}
              <div className="space-y-1.5 ml-10 mb-3">
                {r.options.map((opt, optIdx) => {
                  let optClass = 'bg-gray-50 text-gray-600 border border-gray-100'
                  let indicator = optionLabels[optIdx]

                  if (optIdx === r.correctAnswer) {
                    optClass = 'bg-emerald-50 text-emerald-950 font-black border-2 border-emerald-400'
                    indicator = '✅ ' + optionLabels[optIdx]
                  } else if (optIdx === r.studentAnswer && !r.isCorrect) {
                    optClass = 'bg-red-50 text-red-950 font-bold border-2 border-red-300 line-through opacity-80'
                    indicator = '❌ ' + optionLabels[optIdx]
                  }

                  return (
                    <div key={optIdx} className={`p-2.5 rounded-xl text-sm flex items-center gap-2 ${optClass}`}>
                      <span className="font-bold">{indicator}</span>
                      <span>{opt}</span>
                    </div>
                  )
                })}
              </div>

              {/* Explanation Box */}
              <div className="ml-10 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs font-semibold text-amber-950 leading-relaxed">
                <p className="font-black text-amber-900 mb-0.5 flex items-center gap-1">
                  <span>💡</span> නිවැරදි විවරණය:
                </p>
                <p>{r.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => router.push('/')}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-4 text-xl font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 min-h-[56px] transition-all flex items-center justify-center gap-2 mb-6"
      >
        <span>නැවත මුල් පිටුවට යන්න</span>
        <span>🏠</span>
      </button>

      {/* Footer */}
      <footer className="text-center text-xs font-semibold text-gray-500 pb-4">
        👨‍🏫 සුමිත් සර්ගේ 5 ශ්‍රේණිය ශිෂ්‍යත්ව පුහුණු මධ්‍යස්ථානය
      </footer>

    </main>
  )
}
