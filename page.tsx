'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STUDENT_NAMES = [
  'කසුන්', 'නිමේෂ', 'සනුකා', 'දිනුකා', 'හිරුණි', 'රවීශ', 'මධුෂානි', 'සචිත්', 'කවිඳු', 'නෙත්මි'
]

type QuizInfo = {
  subject: string
  topic: string
}

export default function Home() {
  const router = useRouter()
  const [selectedName, setSelectedName] = useState('')
  const [customName, setCustomName] = useState('')
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
          setQuizInfo({ subject: 'පරිසරය', topic: 'අපේ ගම' })
        }
      } catch (e) {
        setQuizInfo({ subject: 'පරිසරය', topic: 'අපේ ගම' })
      } finally {
        setLoading(false)
      }
    }
    fetchTodayQuiz()
  }, [])

  const handleStart = () => {
    const nameToUse = customName.trim() || selectedName
    if (!nameToUse) {
      alert('කරුණාකර ඔබේ නම තෝරන්න හෝ ලියන්න!')
      return
    }
    router.push(`/quiz?name=${encodeURIComponent(nameToUse)}`)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-2xl font-bold text-blue-600">මඳක් රැඳී සිටින්න... ⏳</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-blue-600 leading-tight">📚 අද දවසේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය</h1>
        
        {quizInfo ? (
          <div className="mb-6 rounded-xl bg-blue-50 p-4 border-2 border-blue-100">
            <p className="text-lg font-bold text-blue-800">විෂය: {quizInfo.subject}</p>
            <p className="text-md text-blue-600">මාතෘකාව: {quizInfo.topic}</p>
          </div>
        ) : (
          <div className="mb-6 rounded-xl bg-red-50 p-4 border-2 border-red-100">
            <p className="text-red-600">අද දිනට ප්‍රශ්නාවලියක් නොමැත.</p>
          </div>
        )}

        <div className="mb-4 text-left">
          <label className="mb-2 block text-sm font-bold text-gray-700">ඔබේ නම තෝරන්න:</label>
          <select 
            className="w-full min-h-[48px] rounded-xl border-2 border-blue-200 bg-white px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
            value={selectedName}
            onChange={(e) => {
              setSelectedName(e.target.value)
              setCustomName('')
            }}
          >
            <option value="">-- නම තෝරන්න --</option>
            {STUDENT_NAMES.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="mb-8 text-left">
          <label className="mb-2 block text-sm font-bold text-gray-700">ඔබේ නම ලැයිස්තුවේ නැත්නම් මෙහි ලියන්න:</label>
          <input 
            type="text"
            className="w-full min-h-[48px] rounded-xl border-2 border-blue-200 bg-white px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
            placeholder="ඔබේ නම..."
            value={customName}
            onChange={(e) => {
              setCustomName(e.target.value)
              setSelectedName('')
            }}
          />
        </div>

        <button 
          onClick={handleStart}
          disabled={!quizInfo}
          className="w-full min-h-[48px] rounded-full bg-blue-500 px-6 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          ප්‍රශ්නාවලිය පටන් ගමු! 🚀
        </button>

        {quizInfo && (
          <div className="mt-6 border-t pt-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `📚 *අද දවසේ ශිෂ්‍යත්ව ප්‍රශ්නාවලිය*\n\n📖 *විෂය:* ${quizInfo.subject}\n📋 *මාතෘකාව:* ${quizInfo.topic}\n❓ *ප්‍රශ්න ගණන:* 5\n\n👉 *ප්‍රශ්නාවලියට සහභාගී වීමට:*\n${typeof window !== 'undefined' ? window.location.origin : ''}/quiz\n\n🏆 ලකුණු 5/5 ගත හැකිද බලන්න!\n— *සුමිත් සර්ගේ පන්තිය*`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full min-h-[48px] rounded-full bg-emerald-600 px-4 py-3 text-base font-bold text-white shadow hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <span>📲</span>
              <span>WhatsApp Group එකට Share කරන්න</span>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
