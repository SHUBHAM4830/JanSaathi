import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animation sequence after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements - City Silhouette with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, 
              rgba(255,255,255,0.9) 0%, 
              rgba(255,255,255,0.7) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231E3A8A' fill-opacity='0.1' d='M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")
          `
        }}
      >
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-jansaathi-darkSlate/95 dark:to-jansaathi-darkSlate/90 transition-all duration-300"></div>
      </div>

      {/* City Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-32 md:h-48 z-[1] overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-auto"
          style={{ transform: "translateZ(0)" }}
        >
          <path
            fill="currentColor"
            fillOpacity="0.1"
            d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,208C672,224,768,256,864,261.3C960,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="transition-colors duration-300 text-jansaathi-royalBlue dark:text-jansaathi-royalBlue"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-12 md:pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Animation */}
          <div 
            className={cn(
              "mx-auto mb-6 w-48 h-48 relative flex items-center justify-center",
              isVisible ? "opacity-100" : "opacity-0",
              "transition-opacity duration-700"
            )}
          >
            <img 
              src="/logo.png" 
              alt="JanSaathi Logo" 
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
          
          {/* JanSaathi Title with Scale Animation */}
          <h1 
            className={cn(
              "text-5xl md:text-7xl font-bold mb-6 tracking-tight",
              isVisible ? "animate-scale-up" : "opacity-0 scale-90"
            )}
          >
            <span className="bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange bg-clip-text text-transparent">JanSaathi</span>
          </h1>
          
          {/* Typewriter Effect */}
          <div className={cn(
            "mb-8 h-8 typing-container", 
            isVisible ? "visible" : "invisible"
          )}>
            <h2 className="typing-text text-lg md:text-xl bg-gradient-to-r from-jansaathi-slateGray to-jansaathi-royalBlue dark:from-jansaathi-lightGray dark:to-jansaathi-lightGray bg-clip-text text-transparent font-medium">
              Your Voice, Your Companion
            </h2>
          </div>
          
          {/* Description with Fade Animation */}
          <p 
            className={cn(
              "text-lg md:text-xl text-jansaathi-slateGray dark:text-jansaathi-lightGray/90 mb-10 max-w-2xl mx-auto",
              isVisible ? "animate-fade-in animation-delay-800" : "opacity-0"
            )}
          >
            Empowering citizens through technology and transparency. 
            Together, we build stronger and more engaged communities.
          </p>
          
          {/* CTA Buttons without animation between them */}
          <div 
            className={cn(
              "flex flex-wrap justify-center gap-4",
              isVisible ? "animate-fade-in animation-delay-1000" : "opacity-0"
            )}
          >
            <button 
              onClick={() => navigate('/login')}
              className="btn-cta"
            >
              Get Started
            </button>
            <button className="border-2 border-jansaathi-royalBlue dark:border-jansaathi-lightGray text-jansaathi-royalBlue dark:text-jansaathi-lightGray hover:bg-jansaathi-royalBlue/10 dark:hover:bg-jansaathi-lightGray/10 rounded-full px-6 py-3 font-medium transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Floating shapes - visual flair */}
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/5 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70"></div>
        <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-jansaathi-saffronOrange/10 dark:bg-jansaathi-saffronOrange/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-1000 opacity-70"></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-8 md:h-12 mx-auto">
          <div className="h-2 w-2 rounded-full bg-jansaathi-royalBlue dark:bg-jansaathi-lightGray mb-1"></div>
          <div className="h-2 w-2 rounded-full bg-jansaathi-royalBlue dark:bg-jansaathi-lightGray mb-1 opacity-60"></div>
          <div className="h-2 w-2 rounded-full bg-jansaathi-royalBlue dark:bg-jansaathi-lightGray opacity-30"></div>
        </div>
      </div>
    </section>
  );
}
