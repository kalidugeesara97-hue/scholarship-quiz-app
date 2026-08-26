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
      if (data.score >= 4) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
  }, [])

  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-5xl mb-4">🤔</div>
          <p className="text-xl font-bold text-gray-700 mb-4">ප්‍රතිඵල හමු නොවීය</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-full bg-blue-500 px-6 py-3 text-white font-bold min-h-[48px]"
          >
            මුල් පිටුවට යන්න
          </button>
        </div>
      </div>
    )
  }

  if (results.error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-gray-700 mb-4">ලකුණු ගණනය කිරීමේ දෝෂයක් ඇති විය</p>
          <p className="text-gray-500 mb-6">කරුණාකර නැවත උත්සාහ කරන්න</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-full bg-blue-500 px-6 py-3 text-white font-bold min-h-[48px]"
          >
            නැවත උත්සාහ කරන්න
          </button>
        </div>
      </div>
    )
  }

  const { score, totalQuestions, results: questionResults, studentName, subject, topic } = results
  const percentage = Math.round((score / totalQuestions) * 100)
  const optionLabels = ['අ', 'ආ', 'ඇ']

  let emoji = '📖'
  let message = ''
  let messageColor = ''

  if (score >= 5) {
    emoji = '🏆'
    message = 'සම්පූර්ණ ලකුණු! ඔබ අසාමාන්‍යයි! 🌟'
    messageColor = 'text-yellow-600'
  } else if (score >= 4) {
    emoji = '🎉'
    message = 'හරිම දක්ෂයි! 🌟'
    messageColor = 'text-green-600'
  } else if (score >= 3) {
    emoji = '💪'
    message = 'හොඳයි! තව ටිකක් වැඩ කරමු!'
    messageColor = 'text-blue-600'
  } else if (score >= 2) {
    emoji = '📚'
    message = 'හොඳට ඉගෙන ගමු, හෙට නැවත එන්න!'
    messageColor = 'text-orange-600'
  } else {
    emoji = '🌱'
    message = 'කමක් නැහැ, හෙට නැවත උත්සාහ කරන්න! 💖'
    messageColor = 'text-purple-600'
  }

  const confettiColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bb5', '#845ec2']

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Score Card */}
      <div className="rounded-2xl bg-white p-6 shadow-xl text-center mb-6 animate-bounce-in">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{score}/{totalQuestions}</h1>
        <p className={`text-xl font-bold ${messageColor} mb-4`}>{message}</p>

        {/* Student Info */}
        <div className="text-sm text-gray-500 mb-4">
          <span className="font-bold">{studentName}</span>
          {subject && <span> • {subject}</span>}
          {topic && <span> • {topic}</span>}
        </div>

        {/* Percentage Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full ${
              percentage >= 80 ? 'bg-green-500' :
              percentage >= 60 ? 'bg-blue-500' :
              percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%`, transition: 'width 1s ease' }}
          />
        </div>
        <p className="text-sm text-gray-500">{percentage}%</p>
      </div>

      {/* Question Review */}
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">📋 ප්‍රශ්න විමර්ශනය</h2>

      <div className="flex flex-col gap-4 mb-8">
        {questionResults && questionResults.map((r, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 border-2 ${
              r.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } animate-slide-up`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Question Header */}
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xl">{r.isCorrect ? '✅' : '❌'}</span>
              <p className="font-bold text-gray-800 leading-relaxed">{r.question}</p>
            </div>

            {/* Options */}
            <div className="ml-7 flex flex-col gap-1 mb-3">
              {r.options.map((opt, optIdx) => {
                let optClass = 'text-gray-500'
                let prefix = optionLabels[optIdx]

                if (optIdx === r.correctAnswer) {
                  optClass = 'text-green-700 font-bold'
                  prefix = '✓ ' + optionLabels[optIdx]
                }
                if (optIdx === r.studentAnswer && optIdx !== r.correctAnswer) {
                  optClass = 'text-red-600 line-through'
                  prefix = '✗ ' + optionLabels[optIdx]
                }

                return (
                  <p key={optIdx} className={`text-sm ${optClass}`}>
                    {prefix}) {opt}
                  </p>
                )
              })}
            </div>

            {/* Explanation */}
            <div className="ml-7 rounded-lg bg-amber-50 p-3 border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-bold">💡 විවරණය:</span> {r.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 text-xl font-bold text-white shadow-lg hover:shadow-xl active:scale-95 min-h-[56px] mb-8"
      >
        හෙට නැවත එන්න! 🌅
      </button>
    </main>
  )
}
