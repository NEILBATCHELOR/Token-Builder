import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

import { TokenFormData, TokenBlock } from "@/types/token";
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
  // Get the first token block for standard-specific display
  const primaryBlock = tokenDetails.blocks?.[0];
  const tokenStandard = primaryBlock?.standard || tokenDetails.standard;

  return (
    <Card className="h-full bg-card p-6 flex flex-col gap-4 sticky top-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold">Token Preview</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{tokenStandard}</Badge>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard:</span>
                <span className="font-mono">{tokenStandard}</span>
              </div>
              {primaryBlock?.totalSupply !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply:</span>
                  <span className="font-mono">
                    {primaryBlock.totalSupply.toLocaleString()}
                  </span>
                </div>
              )}
              {tokenDetails.blocks && tokenDetails.blocks.length > 1 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Blocks:</span>
                  <span className="font-mono">
                    {tokenDetails.blocks.length}
                  </span>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Token Features Section */}
          <section>
            <h3 className="text-lg font-medium mb-2">Token Features</h3>
            <div className="space-y-2">
              {primaryBlock?.metadata?.mintable !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mintable:</span>
                  <span className="font-mono">
                    {primaryBlock.metadata.mintable ? "Yes" : "No"}
                  </span>
                </div>
              )}
              {primaryBlock?.metadata?.burnable !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Burnable:</span>
                  <span className="font-mono">
                    {primaryBlock.metadata.burnable ? "Yes" : "No"}
                  </span>
                </div>
              )}
              {primaryBlock?.metadata?.pausable !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pausable:</span>
                  <span className="font-mono">
                    {primaryBlock.metadata.pausable ? "Yes" : "No"}
                  </span>
                </div>
              )}
              {primaryBlock?.metadata?.transferRestrictions !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Transfer Restrictions:
                  </span>
                  <span className="font-mono">
                    {primaryBlock.metadata.transferRestrictions ? "Yes" : "No"}
                  </span>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Standard-specific sections */}
          {tokenStandard === "ERC721" && primaryBlock?.metadata && (
            <section>
              <h3 className="text-lg font-medium mb-2">NFT Properties</h3>
              <div className="space-y-2">
                {primaryBlock.metadata.imageUrl && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Image URL:</span>
                    <span className="font-mono truncate max-w-[200px]">
                      {primaryBlock.metadata.imageUrl}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.transferable !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transferable:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.transferable ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.royalties !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Royalties:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.royalties}%
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.customUri && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom URI:</span>
                    <span className="font-mono truncate max-w-[200px]">
                      {primaryBlock.metadata.customUri}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {tokenStandard === "ERC1155" && primaryBlock?.metadata?.tokens && (
            <section>
              <h3 className="text-lg font-medium mb-2">Multi-Token Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Count:</span>
                  <span className="font-mono">
                    {primaryBlock.metadata.tokens.length}
                  </span>
                </div>
                {primaryBlock.metadata.tokens
                  .slice(0, 3)
                  .map((token: any, index: number) => (
                    <div key={index} className="border p-2 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Token #{index + 1}:
                        </span>
                        <span className="font-mono">
                          {token.name || `Token ${index + 1}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-mono">
                          {token.type || "Fungible"}
                        </span>
                      </div>
                      {token.amount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-mono">{token.amount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                {primaryBlock.metadata.tokens.length > 3 && (
                  <div className="text-sm text-muted-foreground text-center">
                    + {primaryBlock.metadata.tokens.length - 3} more tokens
                  </div>
                )}
              </div>
            </section>
          )}

          {tokenStandard === "ERC1400" && primaryBlock?.metadata && (
            <section>
              <h3 className="text-lg font-medium mb-2">
                Security Token Details
              </h3>
              <div className="space-y-2">
                {primaryBlock.metadata.issuanceDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Issuance Date:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.issuanceDate}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.maturityDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Maturity Date:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.maturityDate}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.restrictedJurisdictions && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Restricted Jurisdictions:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.restrictedJurisdictions.length}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.transferRestrictions !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transfer Restrictions:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.transferRestrictions
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.lockupPeriods !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Lock-up Periods:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.lockupPeriods ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {tokenStandard === "ERC3525" && primaryBlock?.metadata && (
            <section>
              <h3 className="text-lg font-medium mb-2">
                Semi-Fungible Token Details
              </h3>
              <div className="space-y-2">
                {primaryBlock.metadata.slot !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slot:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.slot}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.value !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.value}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.splitMergeEnabled !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Split/Merge:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.splitMergeEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.redeemableValue !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Redeemable Value:
                    </span>
                    <span className="font-mono">
                      {primaryBlock.metadata.redeemableValue ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {tokenStandard === "ERC4626" && primaryBlock?.metadata && (
            <section>
              <h3 className="text-lg font-medium mb-2">Vault Token Details</h3>
              <div className="space-y-2">
                {primaryBlock.metadata.asset && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.asset}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.totalAssets !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Assets:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.totalAssets}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.depositEnabled !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.depositEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                )}
                {primaryBlock.metadata.withdrawEnabled !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdraw:</span>
                    <span className="font-mono">
                      {primaryBlock.metadata.withdrawEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          <Separator />

          <section>
            <h3 className="text-lg font-medium mb-2">Metadata</h3>
            <div className="space-y-2">
              {Object.entries(tokenDetails.metadata || {}).map(
                ([key, value]) => (
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
                ),
              )}
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
              standard={tokenStandard}
            />
          </section>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TokenPreviewPanel;
