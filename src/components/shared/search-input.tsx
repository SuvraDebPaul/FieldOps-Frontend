"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string; // the value currently in the URL
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export default function SearchInput({
  value: urlValue,
  onSearch,
  placeholder = "Search…",
  delay = 400,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(urlValue);
  const [syncedValue, setSyncedValue] = useState(urlValue);

  // The URL changed from outside (e.g. "Clear filters") → show it in the box.
  // This "adjust state during render" pattern is recommended by React over an effect.
  if (urlValue !== syncedValue) {
    setSyncedValue(urlValue);
    if (urlValue !== text.trim()) setText(urlValue);
  }

  const debouncedSearch = useDebouncedCallback(onSearch, delay);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
        onChange={(e) => {
          setText(e.target.value);
          debouncedSearch(e.target.value.trim());
        }}
      />
    </div>
  );
}
