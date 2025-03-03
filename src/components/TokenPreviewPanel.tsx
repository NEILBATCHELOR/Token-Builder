import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

import { TokenFormData } from "@/types/token";
import { DeploymentStatus } from "./DeploymentStatus";
import ContractPreview from "./ContractPreview";
import TokenStatusManager from "./TokenStatusManager";
import { TransactionHistory } from "./TransactionHistory";
import ExportButton from "./ExportButton";

interface TokenPreviewPanelProps {
  tokenDetails?: TokenFormData;
}

const TokenPreviewPanel = ({
  tokenDetails = {
    name: "Example Token",
    symbol: "EXT",
    decimals: 18,
    standard: "ERC20",
    metadata: {
      description: "An example token for demonstration",
      properties: {
        canTransfer: true,
        isMintable: true,
      },
    },
  },
}: TokenPreviewPanelProps) => {
  return (
    <Card className="h-full bg-card p-6 flex flex-col gap-4 sticky top-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold">Token Preview</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{tokenDetails.standard}</Badge>
          <DeploymentStatus status={tokenDetails.status || "DRAFT"} />
        </div>
      </div>

      <div className="mb-4">
        <ExportButton tokenData={tokenDetails} className="w-full" />
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2">Basic Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-mono">{tokenDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol:</span>
                <span className="font-mono">{tokenDetails.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decimals:</span>
                <span className="font-mono">{tokenDetails.decimals}</span>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-medium mb-2">Metadata</h3>
            <div className="space-y-2">
              {Object.entries(tokenDetails.metadata).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground capitalize">
                      {key}:
                    </span>
                    <div className="font-mono text-right">
                      {typeof value === "object" ? (
                        <pre className="text-sm">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value)
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-medium mb-2">Deployment Status</h3>
            <TokenStatusManager
              status={tokenDetails.status || "DRAFT"}
              onStatusChange={(newStatus) => {
                // Handle status change
                console.log("Status changed to:", newStatus);
              }}
              approvals={tokenDetails.approvals}
              onApprove={(approver) => {
                // Handle new approval
                console.log("New approval from:", approver);
              }}
            />
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Contract Preview</h3>
            <ContractPreview
              code={
                tokenDetails.contractPreview ||
                (tokenDetails.blocks &&
                  tokenDetails.blocks[0]?.contractPreview) ||
                "// Contract code will be generated based on configuration"
              }
            />
          </section>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TokenPreviewPanel;
