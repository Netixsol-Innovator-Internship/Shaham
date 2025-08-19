import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Clock, Target, Sparkles, Zap, Trophy, Star } from 'lucide-react';
import { TaskAPI } from '../api';
import { ThemeToggle } from './ThemeToggle';

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskAPI.list();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await TaskAPI.create({ title: newTaskTitle.trim() });
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await TaskAPI.update(id, { completed });
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await TaskAPI.remove(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl shadow-2xl">
                <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                TaskFlow ✨
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Transform your productivity with style
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {completionRate > 0 && (
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{completionRate}% Complete</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {tasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Tasks</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {pendingTasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-500" 
                     style={{ width: tasks.length > 0 ? `${(pendingTasks.length / tasks.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {completedTasks.length}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Completed</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" 
                     style={{ width: tasks.length > 0 ? `${(completedTasks.length / tasks.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="relative group mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                Create Something Amazing
              </h2>
            </div>
            
            <form onSubmit={addTask} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What incredible thing will you accomplish today?"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 text-white text-lg font-bold rounded-2xl hover:from-violet-600 hover:via-pink-600 hover:to-cyan-600 focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Plus className="w-6 h-6" />
                  <span>Add Magic</span>
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Tasks List */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Epic Journey</h2>
                </div>
                {tasks.length > 0 && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in progress
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="p-16 text-center">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Loading your amazing tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-16 text-center">
                <div className="relative mx-auto w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
                  <Target className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Ready to Start Something Great?</h3>
                <p className="text-lg text-gray-500 dark:text-gray-500">Add your first task above and watch the magic happen!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {tasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="group p-6 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-pink-50/50 dark:hover:from-violet-900/10 dark:hover:to-pink-900/10 transition-all duration-300 relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center space-x-4">
                      <button
                        onClick={() => toggleTask(task.id, !task.completed)}
                        className="flex-shrink-0 relative group/toggle"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-0 group-hover/toggle:opacity-30 transition-opacity duration-300"></div>
                        {task.completed ? (
                          <div className="relative">
                            <CheckCircle2 className="w-8 h-8 text-green-500 drop-shadow-lg animate-pulse" />
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <Circle className="w-8 h-8 text-gray-400 hover:text-violet-500 transition-colors duration-300 hover:scale-110 transform" />
                            <div className="absolute inset-0 border-2 border-transparent hover:border-violet-400 rounded-full transition-colors duration-300"></div>
                          </div>
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-lg font-medium transition-all duration-300 ${
                          task.completed 
                            ? 'text-gray-500 dark:text-gray-400 line-through opacity-75' 
                            : 'text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                          </p>
                          {task.completed && (
                            <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="font-medium">Completed!</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Motivational Footer */}
        {completedTasks.length > 0 && (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full px-6 py-3 shadow-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Amazing! You've completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}! 🎉
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}