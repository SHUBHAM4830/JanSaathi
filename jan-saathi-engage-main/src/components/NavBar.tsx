import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        "bg-white/95 dark:bg-jansaathi-darkSlate/95 backdrop-blur-md shadow-sm",
        {
          "shadow-md": scrolled,
        }
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="JanSaathi Logo" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange bg-clip-text text-transparent">
              JanSaathi
            </span>
          </a>
        </div>

        <div className="flex items-center space-x-8">
          {isHomePage && (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-jansaathi-royalBlue dark:hover:text-jansaathi-royalBlue transition-colors">
                  Services
                </a>
                <a href="#initiatives" className="text-gray-700 dark:text-gray-300 hover:text-jansaathi-royalBlue dark:hover:text-jansaathi-royalBlue transition-colors">
                  Initiatives
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-jansaathi-royalBlue dark:hover:text-jansaathi-royalBlue transition-colors">
                  Contact
                </a>
              </div>
              <Button
                onClick={() => navigate("/register")}
                className="hidden md:flex bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange text-white hover:opacity-90 transition-opacity"
              >
                Get Involved
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
