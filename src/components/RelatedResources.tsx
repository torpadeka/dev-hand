"use client";

import { useState } from "react";
import {
  BookOpen,
  Code,
  ExternalLink,
  ThumbsUp,
  Clock,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RelatedResourcesWidget() {
  const [activeTab, setActiveTab] = useState("resources");

  const resources = [
    {
      title: "Pointer Arithmetic in C",
      type: "Article",
      author: "Dennis Ritchie",
      rating: 4.8,
      views: 12453,
      icon: <Code className="h-4 w-4 text-[hsl(var(--chart-3))]" />,
      link: "#",
    },
    {
      title: "Understanding Memory Management",
      type: "Tutorial",
      author: "Linus Torvalds",
      rating: 4.9,
      views: 8721,
      icon: <BookOpen className="h-4 w-4 text-[hsl(var(--chart-2))]" />,
      link: "#",
    },
    {
      title: "Array Indexing Deep Dive",
      type: "Video",
      author: "Bjarne Stroustrup",
      rating: 4.7,
      views: 6532,
      icon: <BarChart2 className="h-4 w-4 text-[hsl(var(--chart-4))]" />,
      link: "#",
    },
  ];

  const relatedQuestions = [
    {
      title: "What's the difference between arr[i] and *(arr+i)?",
      answers: 7,
      votes: 42,
      time: "2 days ago",
    },
    {
      title: "How to properly allocate 2D arrays in C?",
      answers: 5,
      votes: 31,
      time: "1 week ago",
    },
    {
      title:
        "Why does sizeof(array) return the correct size but sizeof(pointer) doesn't?",
      answers: 12,
      votes: 76,
      time: "3 days ago",
    },
  ];

  return (
    <Card className="bg-[hsl(var(--primary))] border-[hsl(var(--border))] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <span>Related Resources</span>
          <Tabs defaultValue="resources" className="w-[240px]">
            <TabsList className="grid w-full grid-cols-2 h-8 bg-[hsl(var(--background))]">
              <TabsTrigger
                value="resources"
                onClick={() => setActiveTab("resources")}
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                onClick={() => setActiveTab("questions")}
              >
                Questions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {activeTab === "resources" ? (
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-start p-2 rounded-md hover:bg-[hsl(var(--background))] transition-colors group"
              >
                <div className="h-8 w-8 rounded-md bg-[hsl(var(--background))] flex items-center justify-center mr-3 group-hover:bg-[hsl(var(--background)/0.7)]">
                  {resource.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {resource.title}
                    </h4>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-[hsl(var(--foreground)/0.7)]">
                    <span>{resource.author}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{resource.rating}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{resource.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {relatedQuestions.map((question, index) => (
              <div
                key={index}
                className="p-2 rounded-md hover:bg-[hsl(var(--background))] transition-colors"
              >
                <h4 className="font-medium text-sm line-clamp-2">
                  {question.title}
                </h4>
                <div className="flex items-center mt-1 text-xs text-[hsl(var(--foreground)/0.7)]">
                  <div className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{question.votes}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>{question.answers} answers</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{question.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-[hsl(var(--border))] pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[hsl(var(--button))] text-xs flex items-center justify-center"
        >
          View all {activeTab === "resources" ? "resources" : "questions"}
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
