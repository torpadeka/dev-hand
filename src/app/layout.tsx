import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Hand",
  description:
    "A forum-like web app platform for learning, for developers and programmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased dark`}>
        {" "}
        <MantineProvider
          forceColorScheme="dark"
          theme={{
            components: {
              RichTextEditor: {
                styles: {
                  toolbar: {
                    backgroundColor: "#141d24", // Dark gray background
                    color: "white",
                  },
                  content: {
                    backgroundColor: "#141d24", // Dark gray background
                    color: "white",
                  },
                },
              },
            },
          }}
        >
          {children}{" "}
        </MantineProvider>
        <Toaster />
      </body>
    </html>
  );
}
