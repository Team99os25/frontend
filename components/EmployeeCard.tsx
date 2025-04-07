import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EmployeeCardProps {
  employeeId: string;
  employeeName: string;
  vulnerabilityScore: number;
  date: string;
}

export function EmployeeCard({ employeeId, employeeName, vulnerabilityScore, date }: EmployeeCardProps) {
  return (
    <Card className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-lg hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[1.01] hover:border-blue-500/30">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-slate-200">{employeeName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">ID:</span>
            <span className="font-medium text-slate-300">{employeeId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Vulnerability Score:</span>
            <span className={`font-medium ${
              vulnerabilityScore > 7 ? 'text-red-400' : 
              vulnerabilityScore > 4 ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {vulnerabilityScore}/10
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Date:</span>
            <span className="font-medium text-slate-300">{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 