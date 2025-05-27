"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import RichTextEditorComponent from "@/components/RichTextEditorComponent";
import CategorySelector from "@/components/CategorySelector";
import { SaveConfirmationDialog } from "@/components/SaveConfirmationDialog";
import { createSubThread, createThread } from "@/actions/thread-queries";
import { redirect } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bot, Info } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { askAzureOpenAI } from "@/app/chatbot/function";
import AdvancedSpinnerLoading from "@/components/Loading";

interface CreateThreadProps {
  userID: number;
  categories: Map<number, string>;
}

export default function CreateThreadClient({
  userID,
  categories,
}: CreateThreadProps) {
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [savedContent, setSavedContent] = useState("");
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [hasError, setHasError] = useState(true);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [allowAIAnswers, setAllowAIAnswers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const categorySelectorRef = useRef<{
    getSelectedCategories: () => void;
  } | null>(null);
  const editorRef = useRef<{ getEditorContent: () => void } | null>(null);

  const handleSave = () => {
    if (categorySelectorRef.current) {
      categorySelectorRef.current.getSelectedCategories();
    }
    if (editorRef.current) {
      editorRef.current.getEditorContent();
    }

    setTriggerValidation(true);
  };

  useEffect(() => {
    if (!triggerValidation) return;

    let hasError = false;

    if (title.trim().length < 15) {
      setErrorTitle("Title must be at least 15 characters.");
      hasError = true;
    } else {
      setErrorTitle("");
    }

    if (savedCategories.length === 0) {
      setErrorCategory("Please select at least one category.");
      hasError = true;
    } else {
      setErrorCategory("");
    }

    if (savedContent.trim().length < 50) {
      setErrorDetail("Content must be at least 50 characters.");
      hasError = true;
    } else {
      setErrorDetail("");
    }

    setHasError(hasError);
    setTriggerValidation(false);
  }, [savedCategories, savedContent, title, triggerValidation]);

  const handleSubmission = async () => {
    try {
      setIsLoading(true);
      console.log(userID);
      const threadId: number = await createThread(
        userID,
        title,
        savedContent,
        "question",
        0,
        savedCategories
      );
      console.log("Question submitted successfully!");
      if (allowAIAnswers) {
        const response = await askAzureOpenAI(savedContent);
        await createSubThread(threadId || 0, 0, response, true);
        console.log(savedContent);
      }
    } finally {
      setIsLoading(false);
      redirect("/thread/create/success");
    }
  };

  return (
    <div className="">
      <Navbar />
      <AdvancedSpinnerLoading
        isLoading={isLoading}
        onCancel={() => setIsLoading(false)}
      />
      <div className="text-center m-5 text-primary-foreground flex flex-col">
        <span className="font-bold text-2xl">
          Confused? Get guidance from the community!
        </span>
        <span className="text-base border-0 border-b-[1px] border-foreground pb-2">
          No question is too small! Ask now and let the community assist you!
        </span>
      </div>
      <div className="flex bg-primary rounded-lg m-5 p-3 h-full">
        <div className="w-2/3">
          <div className="">
            <div className="text-xl font-bold text-primary-foreground">
              Title
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Input title here..."
                className="w-full bg-background rounded-sm p-2 border-[1px] border-[#424242]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="text-destructive">{errorTitle}</div>
            </div>
            <div className="">
              <div className="text-xl font-bold mt-5 text-primary-foreground">
                Tell Us Your Detail Problem
              </div>
              <div className="w-full">
                <RichTextEditorComponent
                  ref={editorRef}
                  onSubmit={setSavedContent}
                  clear={false}
                />
                <div className="text-destructive">{errorDetail}</div>
              </div>
            </div>
          </div>

          {/* AI Answer Preference Section */}
          <div className="mt-6 p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ai-answers"
                  checked={allowAIAnswers}
                  onCheckedChange={(checked: boolean) =>
                    setAllowAIAnswers(checked as boolean)
                  }
                  className="border-border data-[state=checked]:bg-button data-[state=checked]:border-button"
                />
                <Label
                  htmlFor="ai-answers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Bot className="h-4 w-4 text-chart-3" />
                  Allow AI to answer this question
                </Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary border-border max-w-xs">
                    <p className="text-sm">
                      When enabled, our AI assistant can provide instant answers
                      to your question alongside community responses. This can
                      help you get faster solutions while still receiving human
                      insights.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-foreground/70 mt-2 ml-6">
              {allowAIAnswers
                ? "AI will provide instant answers along with community responses"
                : "Only community members will be able to answer your question"}
            </p>
          </div>

          <div className="hover:cursor-text mt-5 flex gap-x-10">
            <a
              href="#_"
              className="relative inline-flex group items-center justify-center px-2 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-chart-4 active:shadow-none shadow-lg bg-gradient-to-tr from-chart-4/80 to-chart-4/90 border-chart-4 text-white rounded overflow-hidden"
              onClick={handleSave}
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-40 opacity-10"></span>
              <span className="relative">Save Question</span>
            </a>
            <SaveConfirmationDialog
              disable={hasError}
              onConfirm={handleSubmission}
            />
          </div>
        </div>
        <div className="w-1/3">
          <CategorySelector
            ref={categorySelectorRef}
            onSubmit={setSavedCategories}
            categories={categories}
          />
          <div className="text-destructive mx-3 my-1">{errorCategory}</div>
        </div>
      </div>
    </div>
  );
}
