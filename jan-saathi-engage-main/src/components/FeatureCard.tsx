
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-xl",
        "transform hover:-translate-y-1",
        className
      )}
    >
      <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-jansaathi-royalBlue/20 to-jansaathi-saffronOrange/20 dark:from-jansaathi-royalBlue/30 dark:to-jansaathi-saffronOrange/30">
        <Icon className="h-6 w-6 text-jansaathi-royalBlue dark:text-jansaathi-lightGray" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-jansaathi-slateGray/80 dark:text-jansaathi-lightGray/80">
        {description}
      </p>
    </div>
  );
}
