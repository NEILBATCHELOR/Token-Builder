import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { TokenFormData } from "@/types/token";

interface ImportButtonProps {
  onImport: (data: TokenFormData) => void;
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

const ImportButton = ({
  onImport,
  variant = "outline",
  size = "default",
  className = "",
}: ImportButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as TokenFormData;
        onImport(importedData);
      } catch (error) {
        console.error("Error parsing imported file:", error);
        alert("Invalid configuration file. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);

    // Reset the input so the same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: "none" }}
      />
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleImportClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Configuration
      </Button>
    </>
  );
};

export default ImportButton;
