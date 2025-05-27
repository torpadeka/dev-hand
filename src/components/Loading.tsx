"use client";

import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedSpinnerLoadingProps {
  isLoading: boolean;
  onCancel?: () => void;
}

export default function AdvancedSpinnerLoading({
  isLoading,
  onCancel,
}: AdvancedSpinnerLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-primary border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-button" />
            <span className="font-semibold text-foreground">
              Dev Hand Assistant
            </span>
          </div>
          {/* {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 text-foreground/60 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )} */}
        </div>

        {/* Spinner and Content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-border rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-transparent border-t-button rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div
              className="absolute inset-2 border-2 border-transparent border-t-chart-3 rounded-full animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-button rounded-full flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Creating Thread
            </h3>
            <p className="text-sm text-foreground/70">
              Analyzing your question and crafting a detailed answer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
