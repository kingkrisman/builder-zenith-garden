import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Download,
} from "lucide-react";
import { Resource, ResourceCategory, ResourcesResponse } from "@shared/api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Resources() {
  const [userRole, setUserRole] = useState<"student" | "lecturer">("student");
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "downloads" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  const subjects = [...new Set(resources.map((r) => r.subject))];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterAndSortResources();
  }, [
    resources,
    searchQuery,
    categoryFilter,
    subjectFilter,
    sortBy,
    sortOrder,
  ]);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      const data = (await response.json()) as ResourcesResponse;
      setResources(data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      // Mock data for demonstration
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
        {
          id: "4",
          title: "Machine Learning Fundamentals",
          description:
            "Introduction to machine learning concepts, supervised and unsupervised learning, with practical examples in Python.",
          fileName: "ml-fundamentals.pdf",
          fileSize: 3145728,
          category: ResourceCategory.LECTURE_NOTES,
          subject: "Artificial Intelligence",
          uploadedBy: "Dr. Alex Kumar",
          uploadedAt: "2024-01-08T16:20:00Z",
          downloadCount: 203,
          tags: ["machine-learning", "python", "ai", "supervised-learning"],
        },
        {
          id: "5",
          title: "Final Exam 2023 - Operating Systems",
          description:
            "Complete final examination with solutions covering process management, memory management, file systems, and security.",
          fileName: "os-final-2023.pdf",
          fileSize: 1572864,
          category: ResourceCategory.PAST_QUESTIONS,
          subject: "Operating Systems",
          uploadedBy: "Prof. Lisa Wang",
          uploadedAt: "2024-01-05T11:45:00Z",
          downloadCount: 178,
          tags: ["final-exam", "processes", "memory", "file-systems"],
        },
        {
          id: "6",
          title: "Network Security Course Syllabus",
          description:
            "Complete syllabus for Network Security course including topics, assessment criteria, and recommended readings.",
          fileName: "netsec-syllabus.pdf",
          fileSize: 256000,
          category: ResourceCategory.SYLLABUS,
          subject: "Network Security",
          uploadedBy: "Dr. Robert Black",
          uploadedAt: "2024-01-03T08:30:00Z",
          downloadCount: 45,
          tags: ["syllabus", "security", "networks", "cryptography"],
        },
      ];
      setResources(mockResources);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortResources = () => {
    let filtered = resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        resource.category === categoryFilter;
      const matchesSubject =
        !subjectFilter ||
        subjectFilter === "all" ||
        resource.subject === subjectFilter;
      return matchesSearch && matchesCategory && matchesSubject;
    });

    // Sort resources
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case "downloads":
          comparison = a.downloadCount - b.downloadCount;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredResources(filtered);
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

        // Update download count locally
        setResources((prev) =>
          prev.map((r) =>
            r.id === resourceId
              ? { ...r, downloadCount: r.downloadCount + 1 }
              : r,
          ),
        );
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

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setSubjectFilter("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onRoleSwitch={setUserRole} />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Academic Resources</h1>
          <p className="text-muted-foreground text-lg">
            Browse and download academic materials, assignments, and lecture
            notes
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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
                    Reference
                  </SelectItem>
                  <SelectItem value={ResourceCategory.SYLLABUS}>
                    Syllabus
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>

              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as any)}
              >
                <ToggleGroupItem value="grid" size="sm">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" size="sm">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(searchQuery || categoryFilter || subjectFilter) && (
                <>
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {categoryFilter && (
                    <Badge variant="secondary">
                      Category: {categoryFilter.replace("_", " ")}
                      <button
                        onClick={() => setCategoryFilter("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {subjectFilter && (
                    <Badge variant="secondary">
                      Subject: {subjectFilter}
                      <button
                        onClick={() => setSubjectFilter("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                </>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredResources.length} of {resources.length} resources
            </div>
          </div>
        </div>

        {/* Resources Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className={
                  viewMode === "list"
                    ? "bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                    : ""
                }
              >
                {viewMode === "list" ? (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{resource.subject}</span>
                        <span>•</span>
                        <span>{resource.uploadedBy}</span>
                        <span>•</span>
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(resource.id)}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <ResourceCard
                    resource={resource}
                    userRole={userRole}
                    onDownload={handleDownload}
                    onDelete={
                      userRole === "lecturer" ? handleDelete : undefined
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
