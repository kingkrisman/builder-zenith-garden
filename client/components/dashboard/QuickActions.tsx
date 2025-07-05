import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  Search,
  BookOpen,
  TrendingUp,
  Users,
  FileText,
  Download,
  Star,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  userRole: "student" | "lecturer";
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const studentActions = [
    {
      title: "Browse Resources",
      description: "Find study materials and assignments",
      icon: Search,
      href: "/resources",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "My Downloads",
      description: "View downloaded resources",
      icon: Download,
      href: "/favorites",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Study Schedule",
      description: "Plan your study sessions",
      icon: Calendar,
      href: "/schedule",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      title: "Ask Questions",
      description: "Get help from community",
      icon: Users,
      href: "/community",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
  ];

  const lecturerActions = [
    {
      title: "Upload Resource",
      description: "Share materials with students",
      icon: Upload,
      href: "/upload",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "View Analytics",
      description: "Track student engagement",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Manage Classes",
      description: "Organize your courses",
      icon: BookOpen,
      href: "/classes",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      title: "Student Feedback",
      description: "Review ratings and comments",
      icon: Star,
      href: "/feedback",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
  ];

  const actions = userRole === "lecturer" ? lecturerActions : studentActions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex-col items-start text-left hover:shadow-md transition-shadow"
              asChild
            >
              <Link to={action.href}>
                <div className={`p-2 rounded-lg mb-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
