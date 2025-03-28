"use client";

import { useState, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

// Using forwardRef to handle the ref properly
const POSSearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ onSearch }: SearchBarProps, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
    setSearchQuery(""); // ✅ Clear after search
    inputRef.current?.focus(); // ✅ Keep input focused
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <Input
        ref={ref || inputRef} // Use forwarded ref if provided
        type="text"
        placeholder="Scan barcode or enter SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1"
        autoFocus
      />
      <Button onClick={handleSearch}>
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
});

POSSearchBar.displayName = "POSSearchBar"; // For debugging purposes

export default POSSearchBar;
