import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Layers, FileCode, History, Package, Zap } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const sections = [
    {
      id: "token-blocks",
      name: "Token Blocks",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      id: "metadata",
      name: "Metadata",
      icon: <FileCode className="h-5 w-5" />,
    },
    {
      id: "contract",
      name: "Contract",
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: "deployment",
      name: "Deployment",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "history",
      name: "History",
      icon: <History className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 border-r h-[calc(100vh-3.5rem)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="py-4 px-2 space-y-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSectionChange(section.id)}
            >
              {section.icon}
              <span className="ml-2">{section.name}</span>
            </Button>
          ))}
        </div>
        <Separator className="my-4" />
      </ScrollArea>
    </div>
  );
}
