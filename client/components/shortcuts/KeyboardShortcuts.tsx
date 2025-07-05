import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "k":
            event.preventDefault();
            // Focus search input if available
            const searchInput = document.querySelector(
              'input[placeholder*="Search"]',
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case "u":
            event.preventDefault();
            navigate("/upload");
            break;
          case "r":
            event.preventDefault();
            navigate("/resources");
            break;
          case "h":
            event.preventDefault();
            navigate("/");
            break;
          default:
            break;
        }
      }

      // ESC key
      if (event.key === "Escape") {
        // Close any open modals/dropdowns
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null; // This component doesn't render anything
}
