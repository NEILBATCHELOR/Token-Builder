import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DeploymentStatus } from "@/components/DeploymentStatus";
import {
  Layers,
  FileCode,
  History,
  Package,
  Zap,
  Check,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  tokenStatus?: string;
}

export function Sidebar({
  activeSection,
  onSectionChange,
  tokenStatus = "DRAFT",
}: SidebarProps) {
  const sections = [
    {
      id: "token-blocks",
      name: "Token Blocks",
      icon: <Layers className="h-5 w-5" />,
      description: "Define token structure and properties",
      completed: true,
    },
    {
      id: "contract",
      name: "Contract",
      icon: <Package className="h-5 w-5" />,
      description: "Review and customize smart contract",
      completed: false,
    },
    {
      id: "history",
      name: "History",
      icon: <History className="h-5 w-5" />,
      description: "View transaction and change history",
      completed: false,
    },
  ];

  return (
    <div className="w-64 border-r h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Deployment Status</h3>
        <DeploymentStatus status={tokenStatus as any} />
      </div>
      <ScrollArea className="flex-1">
        <div className="py-4 px-2 space-y-1">
          {sections.map((section) => (
            <div key={section.id} className="mb-2">
              <Button
                variant={activeSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start relative"
                onClick={() => onSectionChange(section.id)}
              >
                {section.icon}
                <span className="ml-2">{section.name}</span>
                {section.completed && (
                  <Badge
                    variant="outline"
                    className="absolute right-2 bg-green-50"
                  >
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs">Done</span>
                  </Badge>
                )}
              </Button>
              {activeSection === section.id && (
                <p className="text-xs text-muted-foreground px-4 py-1">
                  {section.description}
                </p>
              )}
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="px-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/admin">
              <Settings className="h-5 w-5 mr-2" />
              Token Administration
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
