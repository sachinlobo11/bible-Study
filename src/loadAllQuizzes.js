// Auto-import all JSON quizzes from src/data using Vite's import.meta.glob
export function loadAllQuizzes() {
  const modules = import.meta.glob('./data/*.json', { eager: true })
  const quizzes = {}
  for (const path in modules) {
    const id = path.split('/').pop().replace('.json','')
    quizzes[id] = modules[path].default || modules[path]
  }
  return quizzes
}
