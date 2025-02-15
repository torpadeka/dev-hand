"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const content = "";

interface RichTextEditorProps {
  onSubmit: (content: string) => void; // ✅ Function to send content to parent
  clear: boolean; // ✅ Clear the editor content
}

const RichTextEditorComponent = forwardRef(
  ({ onSubmit, clear }: RichTextEditorProps, ref) => {
    const [editorHtml, setEditorHtml] = useState("");
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content,
      immediatelyRender: false,
    });

    useImperativeHandle(ref, () => ({
      getEditorContent: () => {
        if (editor) {
          onSubmit(editor.getHTML());
        }
      },
    }));

    useEffect(() => {
      editor?.commands.clearContent();
    }, [clear]);

    if (!editor)
      return <Skeleton className="h-[100px] w-full rounded-xl bg-background" />;
    return (
      <div className="">
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content className="max-h-[500px] overflow-y-auto" />
        </RichTextEditor>
      </div>
    );
  }
);

export default RichTextEditorComponent;
