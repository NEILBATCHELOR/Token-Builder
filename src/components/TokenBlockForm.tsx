import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Trash2, Info } from "lucide-react";
import { TokenBlock, TokenStandard } from "@/types/token";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TokenBlockFormProps {
  block: TokenBlock;
  isFirstBlock?: boolean;
  onBlockChange: (updatedBlock: TokenBlock) => void;
  onBlockDelete?: () => void;
  hasErrors?: boolean;
}

const standardOptions: { value: TokenStandard; label: string }[] = [
  { value: "ERC20", label: "ERC20 - Fungible Token" },
  { value: "ERC721", label: "ERC721 - Non-Fungible Token" },
  { value: "ERC1155", label: "ERC1155 - Multi Token" },
  { value: "ERC1400", label: "ERC1400 - Security Token" },
  { value: "ERC3525", label: "ERC3525 - Semi-Fungible Token" },
  { value: "ERC4626", label: "ERC4626 - Tokenized Vault Standard" },
];

export default function TokenBlockForm({
  block,
  isFirstBlock = false,
  onBlockChange,
  onBlockDelete,
  hasErrors = false,
}: TokenBlockFormProps) {
  // Initialize block with default values if properties are undefined
  const safeBlock = {
    ...block,
    name: block.name || "",
    symbol: block.symbol || "",
    decimals: block.decimals || 18,
    totalSupply: block.totalSupply || 0,
    metadata: block.metadata || {},
  };

  const handleFieldChange = (
    field: keyof TokenBlock,
    value: string | number | any,
  ) => {
    const updatedBlock = { ...safeBlock, [field]: value };

    // Always update contract preview when any field changes
    try {
      const { generateContract } = require("@/lib/contractTemplates");
      updatedBlock.contractPreview = generateContract(updatedBlock);
    } catch (error) {
      console.error("Error generating contract:", error);
    }

    onBlockChange(updatedBlock);
  };

  return (
    <Card className={`p-6 space-y-4 ${hasErrors ? "border-destructive" : ""}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {isFirstBlock ? 1 : parseInt(block.id.split("-")[0]) + 1}
          </span>
          <h3 className="text-lg font-semibold">Token Block Configuration</h3>
        </div>
        {!isFirstBlock && onBlockDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBlockDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${safeBlock.id}-standard`}>Token Standard</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                  <p className="font-medium mb-2">Token Standard Selection</p>
                  <p className="text-sm">
                    Choose the appropriate standard based on your token's
                    purpose:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>
                      <span className="font-medium">ERC20:</span> For fungible
                      tokens like cryptocurrencies
                    </li>
                    <li>
                      <span className="font-medium">ERC721:</span> For unique
                      NFTs like digital art
                    </li>
                    <li>
                      <span className="font-medium">ERC1155:</span> For both
                      fungible and non-fungible tokens
                    </li>
                    <li>
                      <span className="font-medium">ERC1400:</span> For
                      regulated security tokens
                    </li>
                    <li>
                      <span className="font-medium">ERC3525:</span> For
                      semi-fungible tokens with value
                    </li>
                    <li>
                      <span className="font-medium">ERC4626:</span> For
                      yield-bearing vault tokens
                    </li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            defaultValue={safeBlock.standard}
            onValueChange={(value) => {
              const standard = value as TokenStandard;
              const updatedBlock = {
                ...safeBlock,
                standard,
                metadata: safeBlock.metadata || {},
              };
              onBlockChange(updatedBlock);
            }}
          >
            <SelectTrigger id={`${safeBlock.id}-standard`}>
              <SelectValue>
                {standardOptions.find((opt) => opt.value === safeBlock.standard)
                  ?.label || "Select token standard"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {standardOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Standardized fungible tokens used for payments, governance, and DeFi
            applications.
          </p>
        </div>

        {/* Common fields for all standards */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${safeBlock.id}-name`}>Token Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    The full name of your token (e.g., "Ethereum", "Bitcoin")
                  </p>
                  <p className="text-xs mt-1">
                    This will be visible in wallets and exchanges
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id={`${safeBlock.id}-name`}
            defaultValue={safeBlock.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="My Token"
            className={!safeBlock.name ? "border-destructive" : ""}
            required
          />
          {!safeBlock.name && (
            <p className="text-xs text-destructive">Token name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${safeBlock.id}-symbol`}>Token Symbol</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    A short ticker symbol for your token (e.g., "ETH", "BTC")
                  </p>
                  <p className="text-xs mt-1">Usually 3-5 capital letters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id={`${safeBlock.id}-symbol`}
            defaultValue={safeBlock.symbol}
            onChange={(e) => handleFieldChange("symbol", e.target.value)}
            placeholder="TKN"
            className={
              !safeBlock.symbol || safeBlock.symbol.length > 10
                ? "border-destructive"
                : ""
            }
            required
            maxLength={10}
          />
          {!safeBlock.symbol && (
            <p className="text-xs text-destructive">Token symbol is required</p>
          )}
          {safeBlock.symbol && safeBlock.symbol.length > 10 && (
            <p className="text-xs text-destructive">
              Symbol should be 10 characters or less
            </p>
          )}
        </div>

        {/* ERC20 specific fields */}
        {safeBlock.standard === "ERC20" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={`${safeBlock.id}-decimals`}>Decimals</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The number of decimal places your token supports</p>
                      <p className="text-xs mt-1">
                        Standard is 18 decimals (like ETH). Stablecoins often
                        use 6 decimals.
                      </p>
                      <p className="text-xs mt-1">
                        This affects how divisible your token will be.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id={`${safeBlock.id}-decimals`}
                type="number"
                value={safeBlock.decimals}
                onChange={(e) =>
                  handleFieldChange("decimals", parseInt(e.target.value))
                }
                min="0"
                max="18"
                className={
                  safeBlock.decimals < 0 || safeBlock.decimals > 18
                    ? "border-destructive"
                    : ""
                }
              />
              {(safeBlock.decimals < 0 || safeBlock.decimals > 18) && (
                <p className="text-xs text-destructive">
                  Decimals must be between 0 and 18
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={`${safeBlock.id}-totalSupply`}>
                  Total Supply
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The maximum number of tokens that will ever exist</p>
                      <p className="text-xs mt-1">
                        For reference: Bitcoin has 21 million, Ethereum has no
                        fixed supply
                      </p>
                      <p className="text-xs mt-1">
                        This number will be multiplied by 10^decimals for the
                        actual supply
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id={`${safeBlock.id}-totalSupply`}
                type="number"
                value={safeBlock.totalSupply}
                onChange={(e) =>
                  handleFieldChange("totalSupply", parseInt(e.target.value))
                }
                min="0"
                className={
                  safeBlock.totalSupply < 0 ? "border-destructive" : ""
                }
              />
              {safeBlock.totalSupply < 0 && (
                <p className="text-xs text-destructive">
                  Total supply must be a positive number
                </p>
              )}
            </div>
          </>
        )}

        {/* ERC721 specific fields */}
        {safeBlock.standard === "ERC721" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${block.id}-name`}>Name</Label>
              <Input
                id={`${block.id}-name`}
                value={block.metadata?.name || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    name: e.target.value,
                  })
                }
                placeholder="Name of the NFT collection (e.g., 'CryptoPunks')"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-symbol`}>Symbol</Label>
              <Input
                id={`${block.id}-symbol`}
                value={block.metadata?.symbol || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    symbol: e.target.value,
                  })
                }
                placeholder="Short token identifier (e.g., 'PUNK')"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-description`}>Description</Label>
              <Input
                id={`${block.id}-description`}
                value={block.metadata?.description || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    description: e.target.value,
                  })
                }
                placeholder="Summary of the NFT's purpose or attributes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-imageUrl`}>Image URL</Label>
              <Input
                id={`${block.id}-imageUrl`}
                value={block.metadata?.imageUrl || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="URI pointing to the digital asset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-attributes`}>Attributes</Label>
              <Input
                id={`${block.id}-attributes`}
                value={JSON.stringify(block.metadata?.attributes || {})}
                onChange={(e) => {
                  try {
                    const attributes = JSON.parse(e.target.value);
                    handleFieldChange("metadata", {
                      ...block.metadata,
                      attributes,
                    });
                  } catch (error) {
                    // Handle invalid JSON input
                  }
                }}
                placeholder="Key-value pairs for metadata (e.g., Rarity, Color, Level)"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Advanced Settings</h4>

              <div className="space-y-2">
                <Label htmlFor={`${block.id}-royalties`}>Royalties (%)</Label>
                <Input
                  id={`${block.id}-royalties`}
                  type="number"
                  value={block.metadata?.royalties || 0}
                  onChange={(e) =>
                    handleFieldChange("metadata", {
                      ...block.metadata,
                      royalties: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  max="100"
                  placeholder="Define royalty percentage for secondary sales"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor={`${block.id}-transferable`}>
                  Transferability
                </Label>
                <Switch
                  id={`${block.id}-transferable`}
                  checked={block.metadata?.transferable !== false}
                  onCheckedChange={(checked) =>
                    handleFieldChange("metadata", {
                      ...block.metadata,
                      transferable: checked,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${block.id}-customUri`}>
                  Custom Metadata URI
                </Label>
                <Input
                  id={`${block.id}-customUri`}
                  value={block.metadata?.customUri || ""}
                  onChange={(e) =>
                    handleFieldChange("metadata", {
                      ...block.metadata,
                      customUri: e.target.value,
                    })
                  }
                  placeholder="Allow off-chain metadata linking"
                />
              </div>
            </div>
          </div>
        )}

        {/* ERC3525 specific fields */}
        {safeBlock.standard === "ERC3525" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${block.id}-name`}>Name</Label>
              <Input
                id={`${block.id}-name`}
                value={block.metadata?.name || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    name: e.target.value,
                  })
                }
                placeholder="Token name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-symbol`}>Symbol</Label>
              <Input
                id={`${block.id}-symbol`}
                value={block.metadata?.symbol || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    symbol: e.target.value,
                  })
                }
                placeholder="Short identifier"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-token-id`}>Token ID</Label>
              <Input
                id={`${block.id}-token-id`}
                value={block.metadata?.tokenId || ""}
                disabled
                placeholder="Unique identifier within slot groups (auto-generated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-slot`}>Slot</Label>
              <Input
                id={`${block.id}-slot`}
                value={block.metadata?.slot || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    slot: e.target.value,
                  })
                }
                placeholder="Shared attribute identifier for token grouping"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-value`}>Value</Label>
              <Input
                id={`${block.id}-value`}
                type="number"
                value={block.metadata?.value || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    value: parseFloat(e.target.value),
                  })
                }
                placeholder="Numeric amount representing holdings (e.g., shares, credits)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-interest-rate`}>
                NAV (Net Asset Value)
              </Label>
              <Input
                id={`${block.id}-interest-rate`}
                type="number"
                value={block.metadata?.interestRate || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    interestRate: parseFloat(e.target.value),
                  })
                }
                placeholder="Net Asset Value for yield-bearing tokens"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-4">Advanced Settings</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Split/Merge Functionality</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dynamic token management
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.splitMergeEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        splitMergeEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Redeemable Value</Label>
                    <p className="text-sm text-muted-foreground">
                      Set rules for cashing out
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.redeemableValue || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        redeemableValue: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Expiration</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-revoke tokens on a set date
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.expiration || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        expiration: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERC1400 specific fields */}
        {safeBlock.standard === "ERC1400" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${block.id}-name`}>Name</Label>
              <Input
                id={`${block.id}-name`}
                value={block.metadata?.name || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    name: e.target.value,
                  })
                }
                placeholder="Security token name (e.g., 'Tokenized Bond 2025')"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-symbol`}>Symbol</Label>
              <Input
                id={`${block.id}-symbol`}
                value={block.metadata?.symbol || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    symbol: e.target.value,
                  })
                }
                placeholder="Short ticker symbol"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Restricted Jurisdictions</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allJurisdictions = [
                        "Cuba",
                        "North Korea",
                        "Russia",
                        "Donetsk (Ukraine)",
                        "Belarus",
                        "Venezuela",
                        "Democratic Republic of the Congo",
                        "Lebanon",
                        "Somalia",
                        "Yemen",
                        "Iran",
                        "Syria",
                        "Crimea (Ukraine)",
                        "Luhansk (Ukraine)",
                        "Myanmar (Burma)",
                        "Zimbabwe",
                        "Iraq",
                        "Libya",
                        "Sudan",
                      ];
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        restrictedJurisdictions: allJurisdictions,
                      });
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        restrictedJurisdictions: [],
                      });
                    }}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-cuba`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Cuba",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Cuba"]
                          : current.filter((j) => j !== "Cuba");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-cuba`}>Cuba</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-north-korea`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "North Korea",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "North Korea"]
                          : current.filter((j) => j !== "North Korea");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-north-korea`}>
                      North Korea
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-russia`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Russia",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Russia"]
                          : current.filter((j) => j !== "Russia");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-russia`}>Russia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-donetsk`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Donetsk (Ukraine)",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Donetsk (Ukraine)"]
                          : current.filter((j) => j !== "Donetsk (Ukraine)");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-donetsk`}>
                      Donetsk (Ukraine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-belarus`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Belarus",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Belarus"]
                          : current.filter((j) => j !== "Belarus");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-belarus`}>Belarus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-venezuela`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Venezuela",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Venezuela"]
                          : current.filter((j) => j !== "Venezuela");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-venezuela`}>Venezuela</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-drc`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Democratic Republic of the Congo",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Democratic Republic of the Congo"]
                          : current.filter(
                              (j) => j !== "Democratic Republic of the Congo",
                            );
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-drc`}>
                      Democratic Republic of the Congo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-lebanon`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Lebanon",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Lebanon"]
                          : current.filter((j) => j !== "Lebanon");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-lebanon`}>Lebanon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-somalia`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Somalia",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Somalia"]
                          : current.filter((j) => j !== "Somalia");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-somalia`}>Somalia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-yemen`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Yemen",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Yemen"]
                          : current.filter((j) => j !== "Yemen");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-yemen`}>Yemen</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-iran`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Iran",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Iran"]
                          : current.filter((j) => j !== "Iran");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-iran`}>Iran</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-syria`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Syria",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Syria"]
                          : current.filter((j) => j !== "Syria");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-syria`}>Syria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-crimea`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Crimea (Ukraine)",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Crimea (Ukraine)"]
                          : current.filter((j) => j !== "Crimea (Ukraine)");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-crimea`}>
                      Crimea (Ukraine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-luhansk`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Luhansk (Ukraine)",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Luhansk (Ukraine)"]
                          : current.filter((j) => j !== "Luhansk (Ukraine)");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-luhansk`}>
                      Luhansk (Ukraine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-myanmar`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Myanmar (Burma)",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Myanmar (Burma)"]
                          : current.filter((j) => j !== "Myanmar (Burma)");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-myanmar`}>
                      Myanmar (Burma)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-zimbabwe`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Zimbabwe",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Zimbabwe"]
                          : current.filter((j) => j !== "Zimbabwe");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-zimbabwe`}>Zimbabwe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-iraq`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Iraq",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Iraq"]
                          : current.filter((j) => j !== "Iraq");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-iraq`}>Iraq</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-libya`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Libya",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Libya"]
                          : current.filter((j) => j !== "Libya");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-libya`}>Libya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${block.id}-sudan`}
                      checked={block.metadata?.restrictedJurisdictions?.includes(
                        "Sudan",
                      )}
                      onChange={(e) => {
                        const current =
                          block.metadata?.restrictedJurisdictions || [];
                        const updated = e.target.checked
                          ? [...current, "Sudan"]
                          : current.filter((j) => j !== "Sudan");
                        handleFieldChange("metadata", {
                          ...block.metadata,
                          restrictedJurisdictions: updated,
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`${block.id}-sudan`}>Sudan</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-whitelist-requirements`}>
                Whitelist Requirements
              </Label>
              <Input
                id={`${block.id}-whitelist-requirements`}
                value={block.metadata?.whitelistRequirements || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    whitelistRequirements: e.target.value,
                  })
                }
                placeholder="Compliance details (e.g., KYC/AML, accreditation)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-issuance-date`}>Issuance Date</Label>
              <Input
                id={`${block.id}-issuance-date`}
                type="date"
                value={block.metadata?.issuanceDate || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    issuanceDate: e.target.value,
                  })
                }
                placeholder="Start date of issuance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-maturity-date`}>Maturity Date</Label>
              <Input
                id={`${block.id}-maturity-date`}
                type="date"
                value={block.metadata?.maturityDate || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    maturityDate: e.target.value,
                  })
                }
                placeholder="Date when redemption occurs"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-4">Advanced Settings</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Transfer Restrictions</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit trading to KYC-verified wallets
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.transferRestrictions || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        transferRestrictions: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lock-up Periods</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent early selling
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.lockupPeriods || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        lockupPeriods: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compliance Modules</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-restrict based on investor type
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.complianceModules || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        complianceModules: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERC4626 specific fields */}
        {safeBlock.standard === "ERC4626" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${block.id}-name`}>Name</Label>
              <Input
                id={`${block.id}-name`}
                value={block.metadata?.name || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    name: e.target.value,
                  })
                }
                placeholder="Token name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-symbol`}>Symbol</Label>
              <Input
                id={`${block.id}-symbol`}
                value={block.metadata?.symbol || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    symbol: e.target.value,
                  })
                }
                placeholder="Token symbol"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-asset`}>Asset</Label>
              <Input
                id={`${block.id}-asset`}
                value={block.metadata?.asset || ""}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    asset: e.target.value,
                  })
                }
                placeholder="Underlying asset type"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${block.id}-total-assets`}>Total Assets</Label>
              <Input
                id={`${block.id}-total-assets`}
                type="number"
                value={block.metadata?.totalAssets || 0}
                onChange={(e) =>
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    totalAssets: parseFloat(e.target.value),
                  })
                }
                placeholder="Total assets held in vault"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-4">Vault Functions</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deposit</Label>
                    <p className="text-sm text-muted-foreground">
                      Deposit assets into vault
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.depositEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        depositEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Withdraw</Label>
                    <p className="text-sm text-muted-foreground">
                      Withdraw from vault
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.withdrawEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        withdrawEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Convert to Shares</Label>
                    <p className="text-sm text-muted-foreground">
                      Convert deposits to vault shares
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.convertToSharesEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        convertToSharesEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Convert to Assets</Label>
                    <p className="text-sm text-muted-foreground">
                      Convert shares to underlying assets
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.convertToAssetsEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        convertToAssetsEnabled: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Max Withdraw</Label>
                    <p className="text-sm text-muted-foreground">
                      Get max allowable withdrawal
                    </p>
                  </div>
                  <Switch
                    checked={block.metadata?.maxWithdrawEnabled || false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("metadata", {
                        ...block.metadata,
                        maxWithdrawEnabled: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERC1155 specific fields */}
        {safeBlock.standard === "ERC1155" && (
          <>
            <div className="space-y-4">
              {(safeBlock.metadata.tokens || []).map(
                (token: any, index: number) => (
                  <div key={token.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Token #{index + 1}</Label>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens.splice(index, 1);
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="pl-4 border-l-2 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${block.id}-token-type`}>
                          Token Type
                        </Label>
                        <Select
                          defaultValue="Fungible"
                          onValueChange={(value) => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens[index] = {
                              ...newTokens[index],
                              type: value,
                            };
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        >
                          <SelectTrigger id={`${block.id}-token-type`}>
                            <SelectValue>Fungible</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fungible">Fungible</SelectItem>
                            <SelectItem value="Semi-Fungible">
                              Semi-Fungible
                            </SelectItem>
                            <SelectItem value="Non-Fungible">
                              Non-Fungible
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${block.id}-token-name`}>Name</Label>
                        <Input
                          id={`${block.id}-token-name`}
                          placeholder="Collection or asset name"
                          onChange={(e) => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens[index] = {
                              ...newTokens[index],
                              name: e.target.value,
                            };
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${block.id}-token-amount`}>
                          Amount
                        </Label>
                        <Input
                          id={`${block.id}-token-amount`}
                          type="number"
                          placeholder="Quantity of tokens issued per ID"
                          onChange={(e) => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens[index] = {
                              ...newTokens[index],
                              amount: parseInt(e.target.value),
                            };
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${block.id}-token-max-supply`}>
                          Maximum Supply
                        </Label>
                        <Input
                          id={`${block.id}-token-max-supply`}
                          type="number"
                          placeholder="0"
                          onChange={(e) => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens[index] = {
                              ...newTokens[index],
                              maxSupply: parseInt(e.target.value),
                            };
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${block.id}-token-uri`}>URI</Label>
                        <Input
                          id={`${block.id}-token-uri`}
                          placeholder="Metadata link (JSON format)"
                          onChange={(e) => {
                            const newTokens = [
                              ...(block.metadata.tokens || []),
                            ];
                            newTokens[index] = {
                              ...newTokens[index],
                              uri: e.target.value,
                            };
                            handleFieldChange("metadata", {
                              ...block.metadata,
                              tokens: newTokens,
                            });
                          }}
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`${block.id}-token-burnable`}>
                            Burnable
                          </Label>
                          <Switch
                            id={`${block.id}-token-burnable`}
                            onCheckedChange={(checked) => {
                              const newTokens = [
                                ...(block.metadata.tokens || []),
                              ];
                              newTokens[index] = {
                                ...newTokens[index],
                                burnable: checked,
                              };
                              handleFieldChange("metadata", {
                                ...block.metadata,
                                tokens: newTokens,
                              });
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`${block.id}-token-transferable`}>
                            Transferable
                          </Label>
                          <Switch
                            id={`${block.id}-token-transferable`}
                            defaultChecked
                            onCheckedChange={(checked) => {
                              const newTokens = [
                                ...(block.metadata.tokens || []),
                              ];
                              newTokens[index] = {
                                ...newTokens[index],
                                transferable: checked,
                              };
                              handleFieldChange("metadata", {
                                ...block.metadata,
                                tokens: newTokens,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newToken = {
                    id: crypto.randomUUID(),
                    type: "Fungible",
                    name: "",
                    amount: 0,
                    maxSupply: 0,
                    uri: "",
                    burnable: false,
                    transferable: true,
                  };
                  handleFieldChange("metadata", {
                    ...block.metadata,
                    tokens: [...(block.metadata.tokens || []), newToken],
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Token
              </Button>
            </div>
          </>
        )}

        {/* Common Settings for all standards */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-sm font-semibold">Token Features</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                  <p className="font-medium mb-2">Token Features</p>
                  <p className="text-sm">
                    These features determine the functionality of your token:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Mintable:</span> Allows
                      creating new tokens after deployment
                    </li>
                    <li>
                      <span className="font-medium">Burnable:</span> Allows
                      destroying tokens, reducing total supply
                    </li>
                    <li>
                      <span className="font-medium">Pausable:</span> Adds
                      emergency stop functionality for security
                    </li>
                    <li>
                      <span className="font-medium">
                        Transfer Restrictions:
                      </span>{" "}
                      Enables rules for who can transfer tokens
                    </li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mintable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow creation of new tokens
                </p>
              </div>
              <Switch
                checked={safeBlock.metadata?.mintable || false}
                onCheckedChange={(checked) =>
                  handleFieldChange("metadata", {
                    ...safeBlock.metadata,
                    mintable: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Burnable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow tokens to be destroyed
                </p>
              </div>
              <Switch
                checked={safeBlock.metadata?.burnable || false}
                onCheckedChange={(checked) =>
                  handleFieldChange("metadata", {
                    ...safeBlock.metadata,
                    burnable: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Pausable</Label>
                <p className="text-sm text-muted-foreground">
                  Enable emergency stop functionality
                </p>
              </div>
              <Switch
                checked={safeBlock.metadata?.pausable || false}
                onCheckedChange={(checked) =>
                  handleFieldChange("metadata", {
                    ...safeBlock.metadata,
                    pausable: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Transfer Restrictions</Label>
                <p className="text-sm text-muted-foreground">
                  Limit transfers based on rules
                </p>
              </div>
              <Switch
                checked={safeBlock.metadata?.transferRestrictions || false}
                onCheckedChange={(checked) =>
                  handleFieldChange("metadata", {
                    ...safeBlock.metadata,
                    transferRestrictions: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Common field for all standards */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${safeBlock.id}-ownerAddress`}>
              Owner Address
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    The Ethereum address that will own and control this token
                  </p>
                  <p className="text-xs mt-1">
                    This address will receive the initial supply and have admin
                    rights
                  </p>
                  <p className="text-xs mt-1">
                    Format: 0x followed by 40 hexadecimal characters
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id={`${safeBlock.id}-ownerAddress`}
            value={safeBlock.ownerAddress || ""}
            onChange={(e) => handleFieldChange("ownerAddress", e.target.value)}
            placeholder="0x..."
          />
        </div>

        {!isFirstBlock && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${safeBlock.id}-ratio`}>
                Ratio to First Block
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The conversion rate between this token and the primary
                      token
                    </p>
                    <p className="text-xs mt-1">
                      Example: If set to 2.0, each unit of the primary token is
                      worth 2 units of this token
                    </p>
                    <p className="text-xs mt-1">
                      Used for multi-token systems with pegged or related values
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`${safeBlock.id}-ratio`}
              type="number"
              value={safeBlock.ratioToFirstBlock || 1.0}
              onChange={(e) =>
                handleFieldChange(
                  "ratioToFirstBlock",
                  parseFloat(e.target.value),
                )
              }
              min="0"
              step="0.001"
              placeholder="1.0"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
