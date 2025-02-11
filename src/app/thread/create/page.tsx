"use client";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import Navbar from "@/components/Navbar";
import RichTextEditorComponent from "@/components/RichTextEditor";
import React, { useState } from "react";

export default function Chatbot() {
  return (
    <div className="">
      <Navbar />

      <div className="">
        <div className="text-xl font-bold">Title</div>
        <div className="">
          <input type="text" />
        </div>
        <div className="">
          <MantineProvider>
            <RichTextEditorComponent />
          </MantineProvider>
        </div>
      </div>
    </div>
  );
}
