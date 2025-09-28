import React, { useMemo, useState } from 'react'
import Quiz from './Quiz.jsx'
import { loadAllQuizzes } from './loadAllQuizzes.js'

export default function QuizWrapper({ studyId, open, onClose, onEarnXP }) {
  const [visible, setVisible] = useState(open)
  const quizzes = useMemo(() => loadAllQuizzes(), [])
  const quiz = quizzes[String(studyId)]

  React.useEffect(() => setVisible(open), [open])

  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => { setVisible(false); onClose?.() }} />
      <div className="absolute inset-0">
        <Quiz
          quiz={quiz}
          onClose={() => { setVisible(false); onClose?.() }}
          onEarnXP={onEarnXP}
        />
      </div>
    </div>
  )
}
