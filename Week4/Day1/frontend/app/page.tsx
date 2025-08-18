import { ThemeProvider } from "../src/components/ThemeProvider"
import TodoApp from "../src/components/TodoApp"

export default function Page() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todo-app-theme">
      <TodoApp />
    </ThemeProvider>
  )
}
