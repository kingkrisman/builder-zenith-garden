import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  User,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";

interface Activity {
  id: string;
  type: "download" | "upload" | "comment" | "rating";
  user: string;
  resource: string;
  timestamp: string;
  details?: string;
}

interface RecentActivityProps {
  userRole: "student" | "lecturer";
}

export function RecentActivity({ userRole }: RecentActivityProps) {
  // Mock activity data - in real app, this would come from API
  const activities: Activity[] = [
    {
      id: "1",
      type: "download",
      user: "John Doe",
      resource: "Data Structures Lecture Notes",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      type: "upload",
      user: "Dr. Sarah Johnson",
      resource: "Advanced Algorithms Assignment",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      type: "comment",
      user: "Alice Smith",
      resource: "Database Systems Midterm",
      timestamp: "3 hours ago",
      details: "Very helpful resource!",
    },
    {
      id: "4",
      type: "rating",
      user: "Bob Wilson",
      resource: "Machine Learning Fundamentals",
      timestamp: "1 day ago",
      details: "5 stars",
    },
    {
      id: "5",
      type: "download",
      user: "Carol Davis",
      resource: "Operating Systems Final Exam",
      timestamp: "2 days ago",
    },
  ];

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "download":
        return <Download className="h-4 w-4 text-green-600" />;
      case "upload":
        return <Upload className="h-4 w-4 text-blue-600" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "rating":
        return <FileText className="h-4 w-4 text-yellow-600" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "download":
        return `downloaded "${activity.resource}"`;
      case "upload":
        return `uploaded "${activity.resource}"`;
      case "comment":
        return `commented on "${activity.resource}"`;
      case "rating":
        return `rated "${activity.resource}"`;
      default:
        return `interacted with "${activity.resource}"`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <span className="text-sm font-medium">{activity.user}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {getActivityText(activity)}
                </p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    "{activity.details}"
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
