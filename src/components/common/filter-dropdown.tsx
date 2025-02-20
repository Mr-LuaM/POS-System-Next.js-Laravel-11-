"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterDropdownProps {
  label: string;
  options: { id: string; name: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

/**
 * ✅ Optimized Filter Dropdown (Fixes Search, Selection & UX)
 */
export default function FilterDropdown({
  label,
  options,
  selectedValue = "all", // ✅ Ensure default value
  onChange,
  loading = false,
}: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // ✅ Reset search term when selection changes
  React.useEffect(() => {
    setSearchTerm(""); 
  }, [selectedValue]);

  // ✅ Properly filter options based on search term (case-insensitive)
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  // ✅ Find selected label dynamically
  const selectedLabel =
    options.find((option) => option.id === selectedValue)?.name || `Select ${label}...`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
          disabled={loading}
        >
          {loading ? "Loading..." : selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>No {label} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => {
                      onChange(option.id); // ✅ Pass correct value
                      setOpen(false); // ✅ Close dropdown after selection
                    }}
                    className="cursor-pointer"
                  >
                    {option.name}
                    <Check
                      className={cn(
                        "ml-auto transition-opacity",
                        selectedValue === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
