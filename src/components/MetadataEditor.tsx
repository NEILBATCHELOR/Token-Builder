import React from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

interface MetadataField {
  name: string;
  type: "text" | "textarea" | "boolean" | "number";
  description?: string;
  required?: boolean;
  value: string | boolean | number;
  editable?: boolean;
}

interface MetadataEditorProps {
  fields?: MetadataField[];
  onFieldChange?: (name: string, value: string | boolean | number) => void;
  standardType?: string;
}

const getFieldsByStandard = (standard: string): MetadataField[] => {
  const standardSpecificFields: Record<string, MetadataField[]> = {
    ERC20: [
      {
        name: "Description",
        type: "textarea",
        description: "Token details and use case summary",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "External URL",
        type: "text",
        description: "Link to project website or documentation",
        value: "",
        editable: true,
      },
      {
        name: "Max Supply",
        type: "number",
        description: "Maximum number of tokens that will ever exist",
        required: true,
        value: 1000000,
        editable: true,
      },
      {
        name: "Is Transferable",
        type: "boolean",
        description: "Whether the token can be transferred between addresses",
        value: true,
        editable: true,
      },
    ],
    ERC721: [
      {
        name: "Collection Name",
        type: "text",
        description: "Name of the NFT collection",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Description",
        type: "textarea",
        description: "Description of the NFT collection",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Base URI",
        type: "text",
        description: "Base URI for token metadata",
        value: "",
        editable: true,
      },
      {
        name: "Royalty Percentage",
        type: "number",
        description: "Percentage of secondary sales that goes to creator",
        value: 0,
        editable: true,
      },
    ],
    ERC1155: [
      {
        name: "Collection Name",
        type: "text",
        description: "Name of the multi-token collection",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Description",
        type: "textarea",
        description: "Description of the multi-token collection",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Base URI",
        type: "text",
        description: "Base URI for token metadata",
        value: "",
        editable: true,
      },
      {
        name: "Supports Batch Transfers",
        type: "boolean",
        description: "Whether batch transfers are enabled",
        value: true,
        editable: true,
      },
    ],
    ERC1400: [
      {
        name: "Security Type",
        type: "text",
        description: "Type of security token (e.g., equity, debt, real estate)",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Issuer Name",
        type: "text",
        description: "Legal entity issuing the security token",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Compliance Requirements",
        type: "textarea",
        description: "Regulatory requirements for token holders",
        value: "",
        editable: true,
      },
      {
        name: "KYC Required",
        type: "boolean",
        description: "Whether KYC verification is required for token holders",
        value: true,
        editable: true,
      },
    ],
    ERC3525: [
      {
        name: "Slot Description",
        type: "textarea",
        description: "Description of what the slot represents",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Value Unit",
        type: "text",
        description:
          "Unit of measurement for token values (e.g., shares, credits)",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Allows Value Transfer",
        type: "boolean",
        description:
          "Whether value can be transferred between tokens in the same slot",
        value: true,
        editable: true,
      },
    ],
    ERC4626: [
      {
        name: "Underlying Asset",
        type: "text",
        description: "Token address of the asset held in the vault",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Yield Strategy",
        type: "textarea",
        description: "Description of how yield is generated",
        required: true,
        value: "",
        editable: true,
      },
      {
        name: "Management Fee",
        type: "number",
        description: "Annual fee percentage for vault management",
        value: 0,
        editable: true,
      },
      {
        name: "Performance Fee",
        type: "number",
        description: "Percentage of profits taken as performance fee",
        value: 0,
        editable: true,
      },
    ],
  };

  return standardSpecificFields[standard] || [];
};

const MetadataEditor: React.FC<MetadataEditorProps> = ({
  onFieldChange = () => {},
  standardType = "ERC20",
}) => {
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});

  const fields = React.useMemo(
    () => getFieldsByStandard(standardType),
    [standardType],
  );

  // Initialize field values when standard type changes
  React.useEffect(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.name] = field.value;
    });
    setFieldValues(initialValues);
  }, [standardType, fields]);

  // Handle field value changes
  const handleFieldChange = (name: string, value: any) => {
    setFieldValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    onFieldChange(name, value);
  };

  const renderField = (field: MetadataField) => {
    const fieldId = `metadata-${field.name}`;
    const fieldValue =
      fieldValues[field.name] !== undefined
        ? fieldValues[field.name]
        : field.value;

    return (
      <div key={field.name} className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor={fieldId} className="font-medium">
            {field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{field.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {field.type === "textarea" && (
          <Textarea
            id={fieldId}
            value={fieldValue as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="min-h-[100px]"
            disabled={!field.editable}
          />
        )}

        {field.type === "text" && (
          <Input
            id={fieldId}
            type="text"
            value={fieldValue as string}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={!field.editable}
          />
        )}

        {field.type === "number" && (
          <Input
            id={fieldId}
            type="number"
            value={fieldValue as number}
            onChange={(e) =>
              handleFieldChange(field.name, parseFloat(e.target.value))
            }
            disabled={!field.editable}
          />
        )}

        {field.type === "boolean" && (
          <Switch
            id={fieldId}
            checked={fieldValue as boolean}
            onCheckedChange={(checked) =>
              handleFieldChange(field.name, checked)
            }
            disabled={!field.editable}
          />
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-white">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {standardType} Metadata Editor
          </h3>
          <p className="text-sm text-muted-foreground">
            {standardType === "ERC4626"
              ? "A standard for yield-bearing vaults, automating deposits, withdrawals, and asset conversions for lending, staking, and structured DeFi products."
              : standardType === "ERC20"
                ? "Configure metadata for your fungible token."
                : standardType === "ERC721"
                  ? "Configure metadata for your non-fungible token collection."
                  : standardType === "ERC1155"
                    ? "Configure metadata for your multi-token standard."
                    : standardType === "ERC1400"
                      ? "Configure metadata for your security token."
                      : standardType === "ERC3525"
                        ? "Configure metadata for your semi-fungible token."
                        : "Configure additional properties for your token."}
          </p>
        </div>

        <div className="space-y-6">
          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field) => renderField(field))}
            </div>
          ) : standardType === "ERC4626" ? (
            <>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Field</Label>
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                    <div>Name</div>
                    <div>Description</div>
                    <div>Editable?</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>Name</div>
                    <div className="text-sm text-muted-foreground">
                      Token name
                    </div>
                    <div>
                      <Switch
                        checked={fieldValues["name"] || false}
                        onChange={(checked) =>
                          handleFieldChange("name", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>Symbol</div>
                    <div className="text-sm text-muted-foreground">
                      Token symbol
                    </div>
                    <div>
                      <Switch
                        checked={fieldValues["symbol"] || false}
                        onChange={(checked) =>
                          handleFieldChange("symbol", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>Asset</div>
                    <div className="text-sm text-muted-foreground">
                      Underlying asset type
                    </div>
                    <div>
                      <Switch
                        checked={fieldValues["asset"] || false}
                        onChange={(checked) =>
                          handleFieldChange("asset", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>Total Assets</div>
                    <div className="text-sm text-muted-foreground">
                      Total assets held in vault
                    </div>
                    <div className="text-sm text-muted-foreground">
                      (auto-calculated)
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">
                  Vault-Specific Advanced Settings
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Yield Strategy</Label>
                      <p className="text-sm text-muted-foreground">
                        Specifies yield source (e.g., staking, lending,
                        arbitrage)
                      </p>
                    </div>
                    <Switch
                      checked={fieldValues["yieldStrategy"] || false}
                      onChange={(checked) =>
                        handleFieldChange("yieldStrategy", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compounding</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-reinvests profits back into the vault
                      </p>
                    </div>
                    <Switch
                      checked={fieldValues["compounding"] || false}
                      onChange={(checked) =>
                        handleFieldChange("compounding", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Withdrawal Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce lock-up periods or gradual withdrawals
                      </p>
                    </div>
                    <Switch
                      checked={fieldValues["withdrawalRestrictions"] || false}
                      onChange={(checked) =>
                        handleFieldChange("withdrawalRestrictions", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Rebalancing</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjusts portfolio to maintain asset allocation
                      </p>
                    </div>
                    <Switch
                      checked={fieldValues["autoRebalancing"] || false}
                      onChange={(checked) =>
                        handleFieldChange("autoRebalancing", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dynamic NAV Calculation</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates share price based on accrued returns
                      </p>
                    </div>
                    <Switch
                      checked={fieldValues["dynamicNAV"] || false}
                      onChange={(checked) =>
                        handleFieldChange("dynamicNAV", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 border rounded-md bg-muted/20">
              <p className="text-center text-muted-foreground">
                Select a token standard to view specific metadata fields
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MetadataEditor;
