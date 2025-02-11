"use client";
// import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import Navbar from "@/components/Navbar";
import RichTextEditorComponent from "@/components/RichTextEditorComponent";
import CategorySelector from "@/components/CategorySelector";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { IoMdHelp } from "react-icons/io";
import { SaveConfirmationDialog } from "@/components/SaveConfirmationDialog";
import { insertThread } from "@/actions/thread-queries";

export default function CreateThread() {
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [savedContent, setSavedContent] = useState("");
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [hasError, setHasError] = useState(true);
  const [triggerValidation, setTriggerValidation] = useState(false);

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
    await insertThread("1", title, savedContent, "question");
    console.log("Question submitted successfully!");
  };

  return (
    <div className="">
      <Navbar />
      <div className="text-center m-5 text-primary-foreground flex flex-col">
        <span className="font-bold text-2xl">
          Confused? Get guidance from the community!
        </span>
        <span className="text-base border-0 border-b-[1px] border-foreground pb-2">
          No question is too small! Ask now and let the community assist you!
        </span>
      </div>
      <div className="flex bg-primary rounded-lg m-5 p-3 h-full">
        <div className=""></div>
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
                />
                <div className="text-destructive">{errorDetail}</div>
              </div>
            </div>
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
          />
          <div className="text-destructive mx-3 my-1">{errorCategory}</div>
        </div>
      </div>
    </div>
  );
}
