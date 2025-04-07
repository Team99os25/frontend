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
}

export function EmployeeList({ title, employees }: EmployeeListProps) {
  return (
    <Card className="w-full bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
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