'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  id: string
  role: 'user' | 'model'
  text: string
  timestamp: string
}

const QUICK_PROMPTS = [
  '👨‍🏫 සුමිත් සර්ගේ පන්ති විස්තර',
  '➕ ගණිත ගැටලු ලේසියෙන් හදන්නේ කොහොමද?',
  '💡 පාඩම් මතක තබාගන්න හොඳම ක්‍රම',
  '🌿 පරිසරය පාඩම් මතක තබාගැනීම'
]

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'ආයුබෝවන් දුවේ/පුතේ! 🌟 මම **සුමිත් සර්ගේ AI ගුරු සහයකයා**.\n\n5 ශ්‍රේණියේ ශිෂ්‍යත්ව විභාගයේ ප්‍රශ්න, පාඩම් මතක තබාගන්නා ක්‍රම හෝ සුමිත් සර්ගේ පන්ති ගැන ඕනෑම දෙයක් මාගෙන් විමසන්න! 📚✨',
      timestamp: 'දැන්'
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('si-LK', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: m.text
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history })
      })

      const data = await res.json()

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'සමාවෙන්න, මට පිළිතුර ලබා දීමට නොහැකි විය.',
        timestamp: new Date().toLocaleTimeString('si-LK', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'සමාවෙන්න, සබඳතාවයේ දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න. 😊',
          timestamp: 'දැන්'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-white shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all border-2 border-white/80"
        aria-label="Ask AI Assistant"
      >
        <span className="text-2xl animate-pulse">🤖</span>
        <span className="font-extrabold text-sm hidden sm:inline">සුමිත් සර් AI සහයක</span>
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[580px] bg-white sm:rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur text-2xl border border-white/20">
                👨‍🏫
              </div>
              <div>
                <h3 className="font-black text-base leading-tight flex items-center gap-1.5">
                  <span>සුමිත් සර්ගේ AI සහයක</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">Online</span>
                </h3>
                <p className="text-xs text-blue-200 font-medium">5 ශ්‍රේණිය ශිෂ්‍යත්ව ප්‍රශ්න හා තොරතුරු</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all"
            >
              ✕
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-blue-50/70 border-b border-blue-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-3 py-1 rounded-full bg-white text-xs font-bold text-blue-800 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-base shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md font-medium'
                      : 'bg-white text-gray-800 border border-blue-100 rounded-tl-xs shadow-sm whitespace-pre-wrap'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white text-sm">
                  🤖
                </div>
                <div className="bg-white border border-blue-100 p-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs font-bold text-gray-500 ml-1">සිතමින් පවතී...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="සුමිත් සර්ගෙන් ප්‍රශ්නයක් අසන්න..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-2xl border-2 border-blue-200 bg-blue-50/30 px-4 py-2.5 text-sm font-medium text-gray-800 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-40 transition-all active:scale-95"
              >
                ➔
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  )
}
