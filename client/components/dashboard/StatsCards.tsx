import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Star,
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalResources: number;
    totalDownloads: number;
    subjects: number;
    activeUsers: number;
    weeklyUploads: number;
    weeklyDownloads: number;
    avgRating: number;
    recentActivity: number;
  };
  userRole: "student" | "lecturer";
}

export function StatsCards({ stats, userRole }: StatsCardsProps) {
  const studentStats = [
    {
      title: "Available Resources",
      value: stats.totalResources.toString(),
      icon: FileText,
      description: "+2 new this week",
      color: "text-blue-600",
    },
    {
      title: "My Downloads",
      value: "23",
      icon: Download,
      description: "+5 this week",
      color: "text-green-600",
    },
    {
      title: "Subjects Available",
      value: stats.subjects.toString(),
      icon: BookOpen,
      description: "Across departments",
      color: "text-purple-600",
    },
    {
      title: "Study Progress",
      value: "78%",
      icon: TrendingUp,
      description: "This semester",
      color: "text-orange-600",
      progress: 78,
    },
  ];

  const lecturerStats = [
    {
      title: "My Resources",
      value: "12",
      icon: FileText,
      description: "+2 uploaded this week",
      color: "text-blue-600",
    },
    {
      title: "Total Downloads",
      value: stats.totalDownloads.toString(),
      icon: Download,
      description: `+${stats.weeklyDownloads} this week`,
      color: "text-green-600",
    },
    {
      title: "Active Students",
      value: stats.activeUsers.toString(),
      icon: Users,
      description: "+12% from last month",
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      description: "From student feedback",
      color: "text-yellow-600",
      progress: (stats.avgRating / 5) * 100,
    },
  ];

  const displayStats = userRole === "lecturer" ? lecturerStats : studentStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mb-2">
              {stat.description}
            </p>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="h-1" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
