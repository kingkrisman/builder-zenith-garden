import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { EnhancedResourceCard } from "@/components/resources/EnhancedResourceCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Upload,
} from "lucide-react";
import { Resource, ResourceCategory, ResourcesResponse } from "@shared/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"student" | "lecturer">("student");
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      const data = (await response.json()) as ResourcesResponse;
      setResources(data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `resource-${resourceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading resource:", error);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setResources((prev) => prev.filter((r) => r.id !== resourceId));
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || categoryFilter === "all" || resource.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloadCount, 0),
    subjects: new Set(resources.map((r) => r.subject)).size,
    activeUsers: 156,
    weeklyUploads: 8,
    weeklyDownloads: 145,
    avgRating: 4.2,
    recentActivity: 23,
  };

  // Mock data for demonstration
  useEffect(() => {
    if (resources.length === 0 && !loading) {
      const mockResources: Resource[] = [
        {
          id: "1",
          title: "Introduction to Data Structures and Algorithms",
          description:
            "Comprehensive lecture notes covering arrays, linked lists, stacks, queues, and basic algorithms with examples and exercises.",
          fileName: "dsa-intro.pdf",
          fileSize: 2048576,
          category: ResourceCategory.LECTURE_NOTES,
          subject: "Computer Science",
          uploadedBy: "Dr. Sarah Johnson",
          uploadedAt: "2024-01-15T10:00:00Z",
          downloadCount: 145,
          tags: ["algorithms", "data-structures", "programming"],
        },
        {
          id: "2",
          title: "Midterm Examination - Database Systems",
          description:
            "Previous year midterm questions covering normalization, SQL queries, transaction management, and database design.",
          fileName: "db-midterm-2023.pdf",
          fileSize: 1048576,
          category: ResourceCategory.PAST_QUESTIONS,
          subject: "Database Systems",
          uploadedBy: "Prof. Michael Chen",
          uploadedAt: "2024-01-10T14:30:00Z",
          downloadCount: 89,
          tags: ["midterm", "sql", "normalization", "database-design"],
        },
        {
          id: "3",
          title: "Software Engineering Assignment 2",
          description:
            "Design patterns assignment focusing on Factory, Observer, and Strategy patterns with implementation requirements.",
          fileName: "se-assignment-2.pdf",
          fileSize: 512000,
          category: ResourceCategory.ASSIGNMENT,
          subject: "Software Engineering",
          uploadedBy: "Dr. Emily Rodriguez",
          uploadedAt: "2024-01-12T09:15:00Z",
          downloadCount: 67,
          tags: ["design-patterns", "assignment", "java", "uml"],
        },
      ];
      setResources(mockResources);
    }
  }, [loading, resources.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onRoleSwitch={setUserRole} />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userRole === "lecturer" ? "Dr. Smith" : "John"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {userRole === "lecturer"
              ? "Manage your academic resources and track student engagement."
              : "Discover and download academic resources for your studies."}
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <StatsCards stats={stats} userRole={userRole} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions userRole={userRole} />

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={ResourceCategory.LECTURE_NOTES}>
                  Lecture Notes
                </SelectItem>
                <SelectItem value={ResourceCategory.ASSIGNMENT}>
                  Assignments
                </SelectItem>
                <SelectItem value={ResourceCategory.PAST_QUESTIONS}>
                  Past Questions
                </SelectItem>
                <SelectItem value={ResourceCategory.REFERENCE_MATERIAL}>
                  Reference Material
                </SelectItem>
                <SelectItem value={ResourceCategory.SYLLABUS}>
                  Syllabus
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {userRole === "lecturer" ? "Your Resources" : "Recent Resources"}
            </h2>
            <Button variant="outline" asChild>
              <Link to="/resources">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter
                  ? "Try adjusting your search or filter criteria."
                  : userRole === "lecturer"
                    ? "Upload your first resource to get started."
                    : "No resources available yet."}
              </p>
              {userRole === "lecturer" && (
                <Button asChild>
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.slice(0, 6).map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  userRole={userRole}
                  onDownload={handleDownload}
                  onDelete={userRole === "lecturer" ? handleDelete : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}