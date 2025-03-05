import React, { useState } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TokenBlock } from "@/types/token";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface RedemptionFormProps {
  tokenBlocks: TokenBlock[];
  onSubmit: (redemptionData: RedemptionData) => void;
}

export interface RedemptionData {
  tokenBlockId: string;
  redemptionType: "scheduled" | "on-demand";
  redemptionAmount: number;
  redemptionDate: Date | null;
  redemptionReason: string;
  burnTokens: boolean;
  notifyInvestors: boolean;
  approvalRequired: boolean;
}

const RedemptionForm: React.FC<RedemptionFormProps> = ({
  tokenBlocks,
  onSubmit,
}) => {
  const [redemptionData, setRedemptionData] = useState<RedemptionData>({
    tokenBlockId: tokenBlocks[0]?.id || "",
    redemptionType: "scheduled",
    redemptionAmount: 0,
    redemptionDate: null,
    redemptionReason: "",
    burnTokens: true,
    notifyInvestors: true,
    approvalRequired: true,
  });

  const handleChange = (field: keyof RedemptionData, value: any) => {
    setRedemptionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(redemptionData);
  };

  const selectedBlock = tokenBlocks.find(
    (block) => block.id === redemptionData.tokenBlockId,
  );

  return (
    <Card className="p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="tokenBlock">Token Block</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select which token block to redeem tokens from</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={redemptionData.tokenBlockId}
            onValueChange={(value) => handleChange("tokenBlockId", value)}
          >
            <SelectTrigger id="tokenBlock">
              <SelectValue placeholder="Select token block" />
            </SelectTrigger>
            <SelectContent>
              {tokenBlocks.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name} ({block.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="redemptionType">Redemption Type</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Scheduled: Occurs on specified dates according to a schedule
                  </p>
                  <p>On-demand: Initiated by issuer or investor request</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={redemptionData.redemptionType}
            onValueChange={(value: "scheduled" | "on-demand") =>
              handleChange("redemptionType", value)
            }
          >
            <SelectTrigger id="redemptionType">
              <SelectValue placeholder="Select redemption type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="on-demand">On-demand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="redemptionAmount">Redemption Amount</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of tokens to redeem</p>
                  {selectedBlock && (
                    <p className="text-xs mt-1">
                      Max: {selectedBlock.totalSupply}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="redemptionAmount"
            type="number"
            value={redemptionData.redemptionAmount}
            onChange={(e) =>
              handleChange("redemptionAmount", parseFloat(e.target.value))
            }
            min="0"
            max={selectedBlock?.totalSupply}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="redemptionDate">Redemption Date</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Date when the redemption will be processed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !redemptionData.redemptionDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {redemptionData.redemptionDate ? (
                  format(redemptionData.redemptionDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={redemptionData.redemptionDate || undefined}
                onSelect={(date) => handleChange("redemptionDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="redemptionReason">Redemption Reason</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Explanation for the redemption (e.g., maturity, early
                    repayment)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="redemptionReason"
            value={redemptionData.redemptionReason}
            onChange={(e) => handleChange("redemptionReason", e.target.value)}
            placeholder="Explain the reason for this redemption..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Redemption Options</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="burnTokens">Burn Tokens After Redemption</Label>
              <p className="text-sm text-muted-foreground">
                Permanently remove redeemed tokens from circulation
              </p>
            </div>
            <Switch
              id="burnTokens"
              checked={redemptionData.burnTokens}
              onCheckedChange={(checked) => handleChange("burnTokens", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifyInvestors">Notify Investors</Label>
              <p className="text-sm text-muted-foreground">
                Send automated notifications to affected token holders
              </p>
            </div>
            <Switch
              id="notifyInvestors"
              checked={redemptionData.notifyInvestors}
              onCheckedChange={(checked) =>
                handleChange("notifyInvestors", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="approvalRequired">
                Require Multi-Signature Approval
              </Label>
              <p className="text-sm text-muted-foreground">
                Redemption will need approval from authorized signers
              </p>
            </div>
            <Switch
              id="approvalRequired"
              checked={redemptionData.approvalRequired}
              onCheckedChange={(checked) =>
                handleChange("approvalRequired", checked)
              }
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Process Redemption
        </Button>
      </form>
    </Card>
  );
};

export default RedemptionForm;
