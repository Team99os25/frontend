import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EmployeeCardProps {
  employeeId: string;
  employeeName: string;
  vulnerabilityScore: number;
  date: string;
}

export function EmployeeCard({ employeeId, employeeName, vulnerabilityScore, date }: EmployeeCardProps) {
  return (
    <Card className="w-full bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[1.01]">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{employeeName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-400">ID:</span>
            <span className="font-medium text-gray-800 dark:text-gray-300">{employeeId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-400">Vulnerability Score:</span>
            <span className={`font-medium ${
              vulnerabilityScore > 7 ? 'text-red-600 dark:text-red-400' : 
              vulnerabilityScore > 4 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-green-600 dark:text-green-400'
            }`}>
              {vulnerabilityScore}/10
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-400">Date:</span>
            <span className="font-medium text-gray-800 dark:text-gray-300">{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 