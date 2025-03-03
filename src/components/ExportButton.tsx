import React from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { TokenFormData } from "@/types/token";

interface ExportButtonProps {
  tokenData: TokenFormData;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ExportButton = ({
  tokenData,
  variant = "outline",
  size = "default",
  className = "",
}: ExportButtonProps) => {
  const handleExport = () => {
    // Create a JSON blob from the token data
    const jsonData = JSON.stringify(tokenData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tokenData.name || "token"}-configuration.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Configuration
    </Button>
  );
};

export default ExportButton;
