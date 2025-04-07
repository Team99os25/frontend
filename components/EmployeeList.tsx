import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeCard } from "./EmployeeCard"

interface Employee {
  employeeId: string;
  employeeName: string;
  vulnerabilityScore: number;
  date: string;
}

interface EmployeeListProps {
  title: string;
  employees: Employee[];
  className?: string;
}

export function EmployeeList({ title, employees, className }: EmployeeListProps) {
  return (
    <Card className={`w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-lg rounded-xl h-[80vh] flex flex-col ${className}`}>
      <CardHeader className="p-3 flex-none">
        <CardTitle className="text-lg font-semibold text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.employeeId}
              {...employee}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 