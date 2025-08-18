import { ThemeProvider } from "./components/ThemeProvider"
import TodoApp from "./components/TodoApp"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todo-app-theme">
      <TodoApp />
    </ThemeProvider>
  )
}

export default App
