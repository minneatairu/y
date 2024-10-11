import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata = {
  metadataBase: new URL("https://ai-sdk-preview-attachments.vercel.dev"),
  title: "Da Braidr by Minne",
  description: "Experimental preview of attachments in useChat hook",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/xkr0sog.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
