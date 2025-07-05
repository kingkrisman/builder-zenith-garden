import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Lightbulb,
  Keyboard,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Tip {
  title: string;
  description: string;
  shortcut?: string;
  category: "navigation" | "search" | "upload" | "general";
}

export function HelpTips() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips: Tip[] = [
    {
      title: "Quick Search",
      description:
        "Press Ctrl+K (Cmd+K on Mac) to quickly focus the search bar",
      shortcut: "⌘K",
      category: "search",
    },
    {
      title: "Upload Shortcut",
      description: "Press Ctrl+U (Cmd+U on Mac) to quickly go to upload page",
      shortcut: "⌘U",
      category: "upload",
    },
    {
      title: "Browse Resources",
      description: "Press Ctrl+R (Cmd+R on Mac) to browse all resources",
      shortcut: "⌘R",
      category: "navigation",
    },
    {
      title: "Dark Mode",
      description:
        "Toggle between light and dark themes using the theme button",
      category: "general",
    },
    {
      title: "Bookmark Resources",
      description: "Click the bookmark icon to save resources for later",
      category: "general",
    },
    {
      title: "Filter by Category",
      description: "Use the category dropdown to filter resources by type",
      category: "search",
    },
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    );
  }

  const tip = tips[currentTip];

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tip {currentTip + 1} of {tips.length}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{tip.title}</h4>
            {tip.shortcut && (
              <Badge variant="secondary" className="text-xs">
                <Keyboard className="h-3 w-3 mr-1" />
                {tip.shortcut}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{tip.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTip}
            disabled={currentTip === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentTip ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTip}
            disabled={currentTip === tips.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
