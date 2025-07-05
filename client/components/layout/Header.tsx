import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, LogOut, Settings, Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  userRole: "student" | "lecturer";
  onRoleSwitch: (role: "student" | "lecturer") => void;
}

export function Header({ userRole, onRoleSwitch }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AcademicHub
            </span>
          </Link>
          <Badge variant={userRole === "lecturer" ? "default" : "secondary"}>
            {userRole === "lecturer" ? "Lecturer" : "Student"}
          </Badge>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/resources"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/resources"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Resources
          </Link>
          {userRole === "lecturer" && (
            <Link
              to="/upload"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/upload"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Upload
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {userRole === "lecturer" && (
            <Button size="sm" asChild>
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {userRole === "lecturer" ? "Dr. Smith" : "John Doe"}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {userRole === "lecturer"
                      ? "Computer Science Department"
                      : "Computer Science Student"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  onRoleSwitch(userRole === "student" ? "lecturer" : "student")
                }
              >
                <User className="mr-2 h-4 w-4" />
                <span>
                  Switch to {userRole === "student" ? "Lecturer" : "Student"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
