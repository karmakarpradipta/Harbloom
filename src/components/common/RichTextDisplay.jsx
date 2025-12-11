import React from "react";
import { cn } from "@/lib/utils";

const RichTextDisplay = ({ content, className }) => {
  if (!content) return null;
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;
