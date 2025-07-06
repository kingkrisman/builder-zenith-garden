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
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BookOpen, User, LogOut, Settings, Upload, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  userRole?: "student" | "lecturer";
  onRoleSwitch?: (role: "student" | "lecturer") => void;
}

export function Header({ userRole, onRoleSwitch }: HeaderProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Use auth user role if available, otherwise fall back to prop
  const currentRole = user?.role || userRole || "student";

  const handleLogout = () => {
    logout();
  };

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
          {isAuthenticated && (
            <Badge
              variant={currentRole === "lecturer" ? "default" : "secondary"}
            >
              {currentRole === "lecturer" ? "Lecturer" : "Student"}
            </Badge>
          )}
        </div>

        {isAuthenticated && (
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
            {currentRole === "lecturer" && (
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
        )}

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {currentRole === "lecturer" && (
                <Button size="sm" asChild>
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Link>
                </Button>
              )}

              <NotificationBell />
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.name?.charAt(0)?.toUpperCase() || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {onRoleSwitch && (
                    <DropdownMenuItem
                      onClick={() =>
                        onRoleSwitch(
                          currentRole === "student" ? "lecturer" : "student",
                        )
                      }
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>
                        Switch to{" "}
                        {currentRole === "student" ? "Lecturer" : "Student"}
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signin">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
