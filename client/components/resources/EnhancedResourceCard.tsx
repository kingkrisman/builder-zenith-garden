import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Calendar,
  User,
  Eye,
  MoreVertical,
  Trash2,
  Edit,
  Bookmark,
  BookmarkCheck,
  Star,
  MessageSquare,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Resource, ResourceCategory } from "@shared/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedResourceCardProps {
  resource: Resource & {
    rating?: number;
    isBookmarked?: boolean;
    commentsCount?: number;
  };
  userRole: "student" | "lecturer";
  onDownload: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
  onEdit?: (resourceId: string) => void;
  onBookmark?: (resourceId: string) => void;
  onShare?: (resourceId: string) => void;
}

const categoryColors = {
  [ResourceCategory.LECTURE_NOTES]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [ResourceCategory.ASSIGNMENT]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [ResourceCategory.PAST_QUESTIONS]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  [ResourceCategory.REFERENCE_MATERIAL]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  [ResourceCategory.SYLLABUS]:
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
};

const categoryLabels = {
  [ResourceCategory.LECTURE_NOTES]: "Lecture Notes",
  [ResourceCategory.ASSIGNMENT]: "Assignment",
  [ResourceCategory.PAST_QUESTIONS]: "Past Questions",
  [ResourceCategory.REFERENCE_MATERIAL]: "Reference",
  [ResourceCategory.SYLLABUS]: "Syllabus",
};

export function EnhancedResourceCard({
  resource,
  userRole,
  onDownload,
  onDelete,
  onEdit,
  onBookmark,
  onShare,
}: EnhancedResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(
    resource.isBookmarked || false,
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(resource.id);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {resource.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {resource.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {userRole === "student" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isBookmarked ? "Remove bookmark" : "Add bookmark"}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onShare?.(resource.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share resource</TooltipContent>
            </Tooltip>

            {userRole === "lecturer" && (onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(resource.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(resource.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={categoryColors[resource.category]}>
            {categoryLabels[resource.category]}
          </Badge>
          <Badge variant="outline">{resource.subject}</Badge>
          {resource.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{resource.tags.length - 2} more
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{formatFileSize(resource.fileSize)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(resource.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{resource.uploadedBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{resource.downloadCount} downloads</span>
            </div>
            {resource.commentsCount !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{resource.commentsCount} comments</span>
              </div>
            )}
          </div>

          {resource.rating && <div>{renderStars(resource.rating)}</div>}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onDownload(resource.id)}
          className="w-full"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
