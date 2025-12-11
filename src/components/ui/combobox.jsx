import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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

export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = "Select item...",
  emptyText = "No item found.",
  onCreate,
  createLabel = "Create new",
  isLoading = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((framework) => framework.value === value)?.label ||
              value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(value, search) => {
            if (value.includes(search)) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup className="p-2 space-y-1">
                {!isLoading &&
                  options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ::: ${option.value}`}
                      className="cursor-pointer"
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
              {onCreate &&
                query.length > 0 &&
                !options.some(
                  (o) => o.label.toLowerCase() === query.toLowerCase()
                ) && (
                  <CommandGroup>
                    <CommandItem
                      value={query} // Always match the query string
                      className="cursor-pointer font-medium text-primary"
                      onSelect={() => {
                        onCreate(query);
                        setOpen(false);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {createLabel.includes("%s")
                        ? createLabel.replace("%s", query)
                        : `${createLabel} "${query}"`}
                    </CommandItem>
                  </CommandGroup>
                )}
            </CommandList>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
