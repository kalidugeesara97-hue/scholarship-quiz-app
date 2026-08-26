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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-xl border border-blue-100">
          <div className="text-5xl mb-4 animate-bounce">📝</div>
          <p className="text-2xl font-black text-blue-700">ප්‍රශ්න පූරණය වෙමින් පවතී...</p>
          <p className="text-sm font-semibold text-gray-500 mt-2">සුළු මොහොතක් රැඳී සිටින්න ⏳</p>
        </div>
      </div>
    )
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center rounded-3xl bg-white p-8 shadow-xl max-w-md w-full border border-blue-100">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-2xl font-black text-gray-800 mb-2">ප්‍රශ්න සූදානම් කරමින්</p>
          <p className="text-gray-600 mb-6 font-medium">අද දින ප්‍රශ්නාවලිය ආරම්භ කිරීමට සූදානම් වන්න</p>
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

  const question = quizData.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quizData.questions.length - 1
  const optionLabels = ['(1)', '(2)', '(3)']

  const handleOptionClick = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    const newAnswers = [...answers, index]
    setAnswers(newAnswers)
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
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-6 px-4 flex flex-col justify-between max-w-lg mx-auto">
      
      {/* Top Header Card */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-md border border-white mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 bg-blue-100 rounded-xl">👦</span>
            <div>
              <p className="text-xs font-bold text-gray-500">ශිෂ්‍යයාගේ නම</p>
              <p className="font-black text-blue-950 text-base">{studentName}</p>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow">
            ප්‍රශ්නය {currentQuestion + 1} / {quizData.questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3.5 w-full rounded-full bg-blue-100 overflow-hidden p-0.5 border border-blue-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500"
            style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / quizData.questions.length) * 100}%` }}
          />
        </div>

        {/* Subject Pill */}
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-extrabold border border-indigo-100">
            <span>{quizData.subjectEmoji || '📚'}</span>
            <span>{quizData.subject} • {quizData.topic}</span>
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-4 border-blue-100 flex-1 flex flex-col justify-between my-2">
        <div>
          {/* Question Number Badge */}
          <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-black mb-3">
            ප්‍රශ්න අංක 0{currentQuestion + 1}
          </div>

          {/* Question Title */}
          <h2 className="mb-6 text-xl sm:text-2xl font-black text-gray-900 leading-snug">
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => {
              let btnClass = 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-800'
              let iconClass = 'bg-gray-200 text-gray-700'

              if (showResult && selectedAnswer === idx) {
                btnClass = 'bg-blue-100 border-2 border-blue-600 text-blue-950 font-black shadow-md ring-2 ring-blue-300'
                iconClass = 'bg-blue-600 text-white'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showResult}
                  className={`flex items-center gap-3.5 rounded-2xl p-4 text-left text-lg w-full min-h-[60px] ${btnClass} transition-all active:scale-[0.98] disabled:cursor-default`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-sm transition-all ${iconClass}`}>
                    {optionLabels[idx]}
                  </span>
                  <span className="leading-relaxed font-bold flex-1">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Answer Recorded Feedback */}
          {showResult && (
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-2 border-emerald-200 animate-slide-up flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <p className="font-black text-emerald-900 text-sm">ඔබේ පිළිතුර සාර්ථකව සටහන් විය!</p>
                <p className="text-emerald-700 text-xs font-semibold">අවසානයේ සියලු නිවැරදි පිළිතුරු විවරණ බලාගත හැක.</p>
              </div>
            </div>
          )}
        </div>

        {/* Next / Finish Button */}
        {showResult && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleNext}
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-4 text-xl font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 min-h-[56px] transition-all flex items-center justify-center gap-2"
            >
              <span>{submitting ? '⏳ ලකුණු සටහන් කරමින්...' : isLastQuestion ? '🏆 ප්‍රතිඵල බලමු!' : 'ඊළඟ ප්‍රශ්නය'}</span>
              {!submitting && <span>{isLastQuestion ? '🎉' : '→'}</span>}
            </button>
          </div>
        )}
      </div>

      {/* Encouragement Footer */}
      <div className="text-center text-xs font-bold text-gray-500 mt-2">
        🎯 5 ශ්‍රේණිය ශිෂ්‍යත්ව ප්‍රශ්නාවලිය • සුමිත් සර්
      </div>

    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-xl text-blue-700 font-black">📝 පූරණය වෙමින්...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
