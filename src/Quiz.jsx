import React, { useMemo, useState } from 'react'

function getLevel(xp) {
  if (xp >= 200) return { level: 3, title: 'Shepherd' }
  if (xp >= 100) return { level: 2, title: 'Teacher' }
  return { level: 1, title: 'Disciple' }
}

const XP_PER_CORRECT = 20

export default function Quiz({ quiz, onClose, onEarnXP }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [showMotivate, setShowMotivate] = useState(false)

  const q = quiz?.questions?.[idx]
  const total = quiz?.questions?.length || 0

  function submit(option) {
    if (done) return
    setSelected(option)
    const isCorrect = option === q.answer
    if (isCorrect) {
      setCorrectCount(c => c + 1)
    } else {
      setShowMotivate(true)
      setTimeout(() => setShowMotivate(false), 3000)
    }
    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(i => i + 1)
        setSelected(null)
      } else {
        setDone(true)
        const earned = correctCount * XP_PER_CORRECT + (isCorrect ? XP_PER_CORRECT : 0)
        onEarnXP?.(earned)
      }
    }, 650)
  }

  if (!quiz) {
    return (
      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Quiz Not Found</h2>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Close</button>
        </div>
      </div>
    )
  }

  const percent = total ? Math.round(((idx + (done ? 1 : 0)) / total) * 100) : 0

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-aurora bg-[length:200%_200%] animate-aurora quiz-particles">
      <div className="absolute inset-0 backdrop-blur-xl" />

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="glass px-4 py-2 rounded-2xl">
          <p className="text-sm opacity-80">{quiz.title}</p>
          <div className="mt-2 w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 animate-pulseGlow" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-2xl glass hover:bg-white/10">Close ✕</button>
      </div>

      {/* Body */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-24">
        {!done ? (
          <div className="glass mt-6 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold">Q{idx + 1}. {q.question}</h2>
            <div className="mt-4 grid gap-3">
              {q.options.map((opt) => {
                const isCorrect = selected && opt === q.answer
                const isWrong = selected && opt === selected && selected !== q.answer
                return (
                  <button
                    key={opt}
                    onClick={() => submit(opt)}
                    disabled={!!selected}
                    className={
                      'text-left px-4 py-3 rounded-xl border transition-colors ' +
                      (isCorrect ? 'border-emerald-400 bg-emerald-400/10' : isWrong ? 'border-rose-400 bg-rose-400/10' : 'border-white/10 hover:bg-white/10')
                    }
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="glass mt-6 p-8 rounded-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold">Well done! ✅</h2>
            <p>You scored <span className="font-semibold">{correctCount}</span> / {total}</p>
            <p>XP Earned: <span className="font-semibold">{correctCount * XP_PER_CORRECT}</span></p>
            <button onClick={onClose} className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Close</button>
          </div>
        )}
      </div>

      {/* Motivational marquee when wrong */}
      {showMotivate && (
        <div className="pointer-events-none fixed bottom-10 left-0 right-0 z-20">
          <div className="whitespace-nowrap text-center font-semibold animate-marquee">
            Keep going! "Your word is a lamp to my feet and a light to my path." — Psalm 119:105 • You can do this! • Try again with faith!
          </div>
        </div>
      )}
    </div>
  )
}
