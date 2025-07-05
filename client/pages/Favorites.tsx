import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Favorites() {
  const [userRole, setUserRole] = useState<"student" | "lecturer">("student");

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onRoleSwitch={setUserRole} />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Downloads</h1>
          <p className="text-muted-foreground text-lg">
            Track your downloaded resources and favorites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Downloads</div>
              <p className="text-xs text-muted-foreground">
                Your download history will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
