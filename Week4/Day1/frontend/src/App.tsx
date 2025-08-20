import { useEffect, useState } from 'react';
import { Task } from './types';
import { TaskAPI } from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Stats from './components/Stats';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await TaskAPI.list();
        setTasks(data);
      } catch (e: any) {
        setError(e?.response?.data?.error ?? e.message ?? 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function onCreated(task: Task) {
    setTasks(prev => [task, ...prev]);
  }
  function onUpdated(task: Task) {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
  }
  function onDeleted(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-gray-200/70 bg-white/75 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Todo App</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="card p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Add Task</h2>
              <Stats tasks={tasks} />
            </div>
            <TaskForm onCreated={onCreated} setError={setError} />
            <div className="min-h-5 text-sm text-red-600 dark:text-red-400">{error}</div>
            <div className="pt-2">
              {loading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              ) : (
                <TaskList tasks={tasks} onUpdated={onUpdated} onDeleted={onDeleted} setError={setError} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
