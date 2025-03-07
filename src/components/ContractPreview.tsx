import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Copy, Download } from "lucide-react";
import React, { useState } from "react";
import { TokenStandard } from "@/types/token";

interface ContractPreviewProps {
  code: string;
  standard?: TokenStandard;
}

const ContractPreview = ({
  code = "// Contract code will be generated based on configuration",
  standard = "ERC20",
}: ContractPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContract = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${standard}_Contract.sol`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting for Solidity
  const highlightSolidity = (code: string) => {
    // Basic syntax highlighting for Solidity
    return code
      .replace(/(\/\/.*)/g, '<span style="color: #6A9955">$1</span>') // Comments
      .replace(
        /\b(pragma|solidity|contract|function|uint|address|string|mapping|event|require|public|private|external|internal|returns|memory|storage|calldata|emit|constructor|modifier|struct|enum|bool|bytes|uint256|int256)\b/g,
        '<span style="color: #569CD6">$1</span>',
      ) // Keywords
      .replace(
        /\b(true|false|null|this|super)\b/g,
        '<span style="color: #569CD6">$1</span>',
      ) // Constants
      .replace(
        /\b(0x[a-fA-F0-9]+)\b/g,
        '<span style="color: #B5CEA8">$1</span>',
      ) // Hex numbers
      .replace(/\b(\d+)\b/g, '<span style="color: #B5CEA8">$1</span>') // Numbers
      .replace(
        /(['"])(?:(?=(\\?))\2.)*?\1/g,
        '<span style="color: #CE9178">$&</span>',
      ); // Strings
  };

  return (
    <Card className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Smart Contract Preview</h3>
          <p className="text-xs text-muted-foreground">
            {standard} Standard Implementation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadContract}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-slate-50">
        <pre
          className="font-mono text-sm"
          dangerouslySetInnerHTML={{ __html: highlightSolidity(code) }}
        ></pre>
      </ScrollArea>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          This contract is generated according to the {standard} standard and
          includes all the features you've configured.
        </p>
        <p className="mt-1">
          For deployment, you'll need to compile this code using a Solidity
          compiler (version ^0.8.0).
        </p>
      </div>
    </Card>
  );
};

export default ContractPreview;
