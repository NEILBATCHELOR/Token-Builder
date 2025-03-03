import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ConfigurationSectionProps {
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  hasError?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ConfigurationSection = ({
  title = "Configuration Section",
  description = "This section contains configuration options",
  defaultOpen = true,
  hasError = false,
  children = (
    <div className="p-4 text-muted-foreground">
      Configuration content goes here
    </div>
  ),
  className,
}: ConfigurationSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "w-full bg-background border rounded-lg shadow-sm",
        hasError && "border-destructive",
        className,
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/50 rounded-t-lg">
          <div className="flex flex-col items-start">
            <h3
              className={cn(
                "text-lg font-semibold",
                hasError && "text-destructive",
              )}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isOpen && "transform rotate-180",
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="p-4 border-t">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ConfigurationSection;
