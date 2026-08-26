'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Question = {
  id: number
  question: string
  options: string[]
}

type QuizApiResponse = {
  available: boolean
  date: string
  subject: string
  topic: string
  subjectEmoji: string
  questions: Question[]
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentName = searchParams.get('name') || 'සිසුවා'

  const [loading, setLoading] = useState(true)
  const [quizData, setQuizData] = useState<QuizApiResponse | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<{isCorrect: boolean, correctAnswer: number, explanation: string} | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch('/api/today')
        if (res.ok) {
          const data = await res.json()
          if (data.available) {
            setQuizData(data)
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📝</div>
          <p className="text-2xl font-bold text-blue-600">ප්‍රශ්න සකසමින්... ⏳</p>
        </div>
      </div>
    )
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-xl font-bold text-gray-700 mb-4">අද දිනට ප්‍රශ්නාවලියක් තවම සකස් කර නැත</p>
          <p className="text-gray-500 mb-6">ටික වේලාවකින් නැවත උත්සාහ කරන්න</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-full bg-blue-500 px-6 py-3 text-white font-bold"
          >
            ආපසු යන්න
          </button>
        </div>
      </div>
    )
  }

  const question = quizData.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quizData.questions.length - 1
  const optionLabels = ['අ', 'ආ', 'ඇ']

  const handleOptionClick = async (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)

    // Store the answer
    const newAnswers = [...answers, index]
    setAnswers(newAnswers)

    // For intermediate questions, we show a "pending" state
    // The actual grading happens server-side on final submit
    // For now, just show visual feedback without revealing correctness
    // (correct answers are not sent from /api/today for security)
    setAnswerFeedback(null) // Will be revealed after submit
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      setSubmitting(true)
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentName, answers })
        })

        if (res.ok) {
          const data = await res.json()
          sessionStorage.setItem('quizResults', JSON.stringify(data))
        } else {
          // Fallback: store basic info
          sessionStorage.setItem('quizResults', JSON.stringify({
            studentName,
            score: 0,
            totalQuestions: quizData.questions.length,
            results: [],
            error: true
          }))
        }
      } catch {
        sessionStorage.setItem('quizResults', JSON.stringify({
          studentName,
          score: 0,
          totalQuestions: quizData.questions.length,
          results: [],
          error: true
        }))
      }

      router.push('/results')
    } else {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setAnswerFeedback(null)
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👦</span>
          <span className="font-bold text-blue-800 text-sm">{studentName}</span>
        </div>
        <div className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-800 text-sm">
          {currentQuestion + 1}/{quizData.questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
          style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / quizData.questions.length) * 100}%`, transition: 'width 0.5s ease' }}
        />
      </div>

      {/* Subject Info */}
      <div className="mb-4 text-center">
        <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-bold text-purple-700">
          {quizData.subjectEmoji} {quizData.subject} — {quizData.topic}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="animate-slide-up">
          <h2 className="mb-8 text-xl font-extrabold text-gray-800 leading-relaxed text-center">
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => {
              let btnClass = 'bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800'
              let icon = optionLabels[idx]

              if (showResult && selectedAnswer === idx) {
                btnClass = 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-bold'
                icon = '✓'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showResult}
                  className={`flex items-center gap-3 rounded-xl p-4 text-left text-lg w-full min-h-[56px] ${btnClass} disabled:cursor-default`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">
                    {icon}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Info after selecting */}
          {showResult && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 border-2 border-amber-200 animate-slide-up">
              <p className="font-bold text-amber-800 mb-1">💡 ඔබේ පිළිතුර වාර්තා විය!</p>
              <p className="text-amber-700 text-sm">ප්‍රතිඵල සියල්ල අවසානයේ පෙනෙනු ඇත.</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNext}
          disabled={submitting}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 text-xl font-bold text-white shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 min-h-[56px] animate-slide-up"
        >
          {submitting ? '⏳ ලකුණු ගණනය කරමින්...' : isLastQuestion ? '🏆 ප්‍රතිඵල බලමු!' : 'ඊළඟ ප්‍රශ්නය →'}
        </button>
      )}
    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-blue-600 font-bold">📝 පූරණය වෙමින්...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
