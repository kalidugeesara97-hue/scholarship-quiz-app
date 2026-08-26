'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type QuizInfo = {
  subject: string
  topic: string
  subjectEmoji?: string
}

const SUBJECT_LIST = [
  { name: 'පරිසරය', emoji: '🌿', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'සිංහල', emoji: '📖', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'ගණිතය', emoji: '➕', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'සාමාන්‍ය බුද්ධිය', emoji: '🧠', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50 text-purple-800 border-purple-200' },
]

export default function Home() {
  const router = useRouter()
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(true)
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null)

  useEffect(() => {
    const fetchTodayQuiz = async () => {
      try {
        const res = await fetch('/api/today')
        if (res.ok) {
          const data = await res.json()
          setQuizInfo(data)
        } else {
          setQuizInfo({ subject: 'පරිසරය', topic: 'ශ්‍රී ලංකාවේ ජාතික සංකේත හා භූගෝලය', subjectEmoji: '🌿' })
        }
      } catch (e) {
        setQuizInfo({ subject: 'පරිසරය', topic: 'ශ්‍රී ලංකාවේ ජාතික සංකේත හා භූගෝලය', subjectEmoji: '🌿' })
      } finally {
        setLoading(false)
      }
    }
    fetchTodayQuiz()
  }, [])

  const handleStart = () => {
    const nameToUse = studentName.trim()
    if (!nameToUse) {
      alert('කරුණාකර ඔබේ නම ඇතුළත් කරන්න! 😊')
      return
    }
    router.push(`/quiz?name=${encodeURIComponent(nameToUse)}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-8 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-blue-100">
          <div className="text-5xl mb-4 animate-bounce">📚</div>
          <p className="text-2xl font-black text-blue-700">ප්‍රශ්නාවලිය සකස් වෙමින් පවතී...</p>
          <p className="text-sm font-semibold text-gray-500 mt-2">සුළු මොහොතක් රැඳී සිටින්න ⏳</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Main Hero Card */}
        <div className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-4 border-blue-100 relative overflow-hidden">
          
          {/* Top Banner Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider shadow-sm">
              <span>🌟</span> 2026 ශිෂ්‍යත්ව ජයමඟ
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800 text-xs font-black">
              <span>🎯</span> දෛනික පුහුණුව
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-2 text-4xl shadow-inner">
              🎓
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-blue-900 leading-tight">
              සුමිත් සර්ගේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය
            </h1>
            <p className="text-sm font-bold text-indigo-600 mt-1">
              5 ශ්‍රේණියේ දරුවන් සඳහාම විශේෂයෙන් සකසන ලද MCQ පුහුණුව
            </p>
          </div>

          {/* Today's Active Quiz Badge */}
          {quizInfo && (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-20 text-7xl font-black select-none pointer-events-none">
                {quizInfo.subjectEmoji || '📝'}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                    අද දවසේ ප්‍රශ්නාවලිය
                  </span>
                  <span className="text-xs font-bold text-blue-200">5 ප්‍රශ්න • විනාඩි 5</span>
                </div>
                <h2 className="text-2xl font-black flex items-center gap-2 mt-1">
                  <span>{quizInfo.subjectEmoji || '🌿'}</span>
                  <span>{quizInfo.subject}</span>
                </h2>
                <p className="text-sm font-medium text-blue-100 mt-1">
                  📌 මාතෘකාව: <span className="font-bold text-white">{quizInfo.topic}</span>
                </p>
              </div>
            </div>
          )}

          {/* Name Input Section */}
          <div className="mb-6 text-left bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <label className="mb-2 block text-base font-extrabold text-gray-800 flex items-center gap-2">
              <span>✍️</span> ඔබේ නම ඇතුළත් කරන්න:
            </label>
            <input 
              type="text"
              className="w-full min-h-[56px] rounded-xl border-2 border-blue-300 bg-white px-4 py-3 text-lg font-bold text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
              placeholder="උදා: කසුන් පෙරේරා..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart()
              }}
            />
            <p className="text-xs font-semibold text-gray-500 mt-2 flex items-center gap-1">
              <span>🔒</span> ඔබේ ලකුණු සුමිත් සර්ගේ Google Sheet වෙත සුරක්ෂිතව සටහන් වේ.
            </p>
          </div>

          {/* Start Quiz Button */}
          <button 
            onClick={handleStart}
            className="w-full min-h-[58px] rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 px-6 py-4 text-xl font-black text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>ප්‍රශ්නාවලිය පටන් ගමු!</span>
            <span className="text-2xl">🚀</span>
          </button>

          {/* WhatsApp Share Button */}
          {quizInfo && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `📚 *සුමිත් සර්ගේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය*\n\n📖 *විෂය:* ${quizInfo.subject}\n📋 *මාතෘකාව:* ${quizInfo.topic}\n❓ *ප්‍රශ්න ගණන:* 5\n\n👉 *ප්‍රශ්නාවලියට සහභාගී වීමට:*\n${typeof window !== 'undefined' ? window.location.origin : ''}\n\n🏆 ලකුණු 5/5 ගත හැකිද බලන්න!\n— *සුමිත් සර්ගේ පන්තිය*`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full min-h-[50px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md transition-all active:scale-95"
              >
                <span className="text-xl">📲</span>
                <span>WhatsApp Group එකට Share කරන්න</span>
              </a>
            </div>
          )}

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
            <div className="text-3xl p-2 bg-blue-50 rounded-xl">⏱️</div>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">විනාඩි 5ක පුහුණුව</p>
              <p className="text-xs text-gray-500">දිනපතා කෙටි අභ්‍යාස</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
            <div className="text-3xl p-2 bg-amber-50 rounded-xl">💡</div>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">ක්ෂණික පැහැදිලි කිරීම්</p>
              <p className="text-xs text-gray-500">නිවැරදි පිළිතුරු විවරණ</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
            <div className="text-3xl p-2 bg-purple-50 rounded-xl">🧠</div>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">විභාග රටාවේ ප්‍රශ්න</p>
              <p className="text-xs text-gray-500">පසුගිය ප්‍රශ්න පත්‍ර ආශ්‍රයෙන්</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
            <div className="text-3xl p-2 bg-emerald-50 rounded-xl">📊</div>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">ප්‍රතිඵල සටහන් වීම</p>
              <p className="text-xs text-gray-500">ගුරුවරයාට ලැබෙන වාර්තා</p>
            </div>
          </div>
        </div>

        {/* Subjects Covered Section */}
        <div className="bg-white/80 backdrop-blur p-5 rounded-3xl border border-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 text-center">
            ආවරණය වන ප්‍රධාන විෂය ක්ෂේත්‍ර 4
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUBJECT_LIST.map((s, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border ${s.bg} text-center font-black text-sm flex flex-col items-center justify-center gap-1 shadow-sm`}>
                <span className="text-2xl">{s.emoji}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Motivational Quote */}
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-4 text-center">
          <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
            💡 අද දවසේ ශිෂ්‍යත්ව අවවාදය
          </p>
          <p className="text-sm font-bold text-amber-900 leading-relaxed">
            &ldquo;සෑම ප්‍රශ්නයක්ම දෙවරක් හොඳින් කියවන්න. කලබල නොවී සිතා බලා නිවැරදිම පිළිතුර තෝරාගන්න!&rdquo;
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs font-semibold text-gray-500 pb-4">
          👨‍🏫 සුමිත් සර්ගේ 5 ශ්‍රේණිය ශිෂ්‍යත්ව සම්මන්ත්‍රණ මාලාව • සියලු හිමිකම් ඇවිරිණි
        </footer>

      </div>
    </main>
  )
}

