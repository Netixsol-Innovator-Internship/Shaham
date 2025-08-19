import { Card } from "./ui/Card"
import { CheckCircle, Clock, Target } from "lucide-react"

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completed = tasks.filter((task) => task.completed).length
  const pending = tasks.length - completed
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6 text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
            <div className="relative">
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white mb-3 shadow-lg`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              {index === 2 && tasks.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{completionRate}% Complete</div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
