
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 500);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-jansaathi-darkSlate transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange bg-clip-text text-transparent">
        JanSaathi
      </div>
      <div className="text-lg md:text-xl mb-8 text-jansaathi-slateGray dark:text-jansaathi-lightGray">
        Loading... {progress}%
      </div>
      <div className="w-64 md:w-80 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
