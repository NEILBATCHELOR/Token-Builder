import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

interface ContractPreviewProps {
  code: string;
}

const ContractPreview = ({
  code = "// Contract code will be generated based on configuration",
}: ContractPreviewProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Card className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Smart Contract Preview</h3>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <pre className="font-mono text-sm">{code}</pre>
      </ScrollArea>
    </Card>
  );
};

export default ContractPreview;
