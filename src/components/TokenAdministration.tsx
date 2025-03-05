import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TokenBlock, TokenFormData } from "@/types/token";
// Removed RedemptionForm import
import { toast } from "./ui/use-toast";
import {
  AlertCircle,
  Check,
  Coins,
  Flame,
  Lock,
  Unlock,
  PauseCircle,
  PlayCircle,
  Search,
  Plus,
  Minus,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";

interface TokenAdministrationProps {
  tokenDetails: TokenFormData;
  onTokenUpdate?: (updatedToken: TokenFormData) => void;
}

type ActionType =
  | "redemption"
  | "mint"
  | "burn"
  | "pause"
  | "lock"
  | "block"
  | "unblock";

interface PendingApproval {
  id: string;
  type: ActionType;
  data: any;
  status: "pending" | "approved" | "rejected" | "executed";
  createdAt: string;
  requestedBy?: string;
}

interface TokenHolder {
  address: string;
  name: string;
  balance: number;
  status: "active" | "locked" | "blocked";
}

const TokenAdministration: React.FC<TokenAdministrationProps> = ({
  tokenDetails,
  onTokenUpdate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("redemption");
  const [isPaused, setIsPaused] = useState(tokenDetails.status === "PAUSED");
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(
    [],
  );
  const [mintAmount, setMintAmount] = useState<number>(0);
  const [mintRecipient, setMintRecipient] = useState<string>("");
  const [burnAmount, setBurnAmount] = useState<number>(0);
  const [burnSource, setBurnSource] = useState<string>("");
  const [selectedTokenBlock, setSelectedTokenBlock] = useState<string>(
    tokenDetails.blocks[0]?.id || "",
  );
  const [searchWallet, setSearchWallet] = useState<string>("");

  // Mock token holders for demonstration
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([
    {
      address: "0x1234...5678",
      name: "Investor A",
      balance: 10000,
      status: "active",
    },
    {
      address: "0x8765...4321",
      name: "Investor B",
      balance: 5000,
      status: "active",
    },
    {
      address: "0xabcd...efgh",
      name: "Investor C",
      balance: 2500,
      status: "locked",
    },
    {
      address: "0xijkl...mnop",
      name: "Investor D",
      balance: 1000,
      status: "blocked",
    },
  ]);

  // Token information
  const totalSupply = tokenDetails.blocks.reduce(
    (sum, block) => sum + block.totalSupply,
    0,
  );
  const holderCount = tokenHolders.length;

  // Removed handleRedemptionSubmit function

  const handleTogglePause = () => {
    const newStatus = isPaused ? "APPROVED" : "PAUSED";
    setIsPaused(!isPaused);

    onTokenUpdate({
      ...tokenDetails,
      status: newStatus,
    });

    toast({
      title: isPaused ? "Token Resumed" : "Token Paused",
      description: isPaused
        ? "Token operations have been resumed."
        : "Token operations have been paused.",
    });
  };

  const handleMintRequest = () => {
    if (mintAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount to mint.",
        variant: "destructive",
      });
      return;
    }

    const newApproval: PendingApproval = {
      id: `mint-${Date.now()}`,
      type: "mint",
      data: {
        amount: mintAmount,
        recipient: mintRecipient || "Issuer Wallet",
        tokenBlockId: selectedTokenBlock,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    setPendingApprovals([...pendingApprovals, newApproval]);

    toast({
      title: "Mint Request Submitted",
      description: `Request to mint ${mintAmount} tokens has been submitted for approval.`,
    });

    // Reset form
    setMintAmount(0);
    setMintRecipient("");
  };

  const handleBurnRequest = () => {
    if (burnAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount to burn.",
        variant: "destructive",
      });
      return;
    }

    const newApproval: PendingApproval = {
      id: `burn-${Date.now()}`,
      type: "burn",
      data: {
        amount: burnAmount,
        source: burnSource || "Issuer Wallet",
        tokenBlockId: selectedTokenBlock,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    setPendingApprovals([...pendingApprovals, newApproval]);

    toast({
      title: "Burn Request Submitted",
      description: `Request to burn ${burnAmount} tokens has been submitted for approval.`,
    });

    // Reset form
    setBurnAmount(0);
    setBurnSource("");
  };

  const handleLockWallet = (address: string) => {
    const newApproval: PendingApproval = {
      id: `lock-${Date.now()}`,
      type: "lock",
      data: {
        address,
        reason: "Administrative action",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    setPendingApprovals([...pendingApprovals, newApproval]);

    toast({
      title: "Lock Request Submitted",
      description: `Request to lock wallet ${address} has been submitted for approval.`,
    });
  };

  const handleBlockWallet = (address: string) => {
    const newApproval: PendingApproval = {
      id: `block-${Date.now()}`,
      type: "block",
      data: {
        address,
        reason: "Regulatory compliance",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    setPendingApprovals([...pendingApprovals, newApproval]);

    toast({
      title: "Block Request Submitted",
      description: `Request to block wallet ${address} has been submitted for approval.`,
    });
  };

  const handleUnblockWallet = (address: string) => {
    const newApproval: PendingApproval = {
      id: `unblock-${Date.now()}`,
      type: "unblock",
      data: {
        address,
        reason: "Compliance requirements satisfied",
      },
      status: "pending",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    setPendingApprovals([...pendingApprovals, newApproval]);

    toast({
      title: "Unblock Request Submitted",
      description: `Request to unblock wallet ${address} has been submitted for approval.`,
    });
  };

  const handleApproveAction = (approvalId: string) => {
    // Find the approval and process it
    const approval = pendingApprovals.find((a) => a.id === approvalId);
    if (!approval) return;

    // Process the approval based on type
    switch (approval.type) {
      case "redemption":
        // Redemption handling removed
        toast({
          title: "Redemption Approved",
          description: "Redemption functionality has been removed.",
        });
        break;

      case "mint":
        const mintData = approval.data;
        const mintBlock = tokenDetails.blocks.find(
          (block) => block.id === mintData.tokenBlockId,
        );
        if (mintBlock) {
          const updatedBlocks = tokenDetails.blocks.map((block) => {
            if (block.id === mintData.tokenBlockId) {
              return {
                ...block,
                totalSupply: block.totalSupply + mintData.amount,
              };
            }
            return block;
          });

          onTokenUpdate({
            ...tokenDetails,
            blocks: updatedBlocks,
          });

          toast({
            title: "Mint Approved",
            description: `Successfully minted ${mintData.amount} tokens.`,
          });
        }
        break;

      case "burn":
        const burnData = approval.data;
        const burnBlock = tokenDetails.blocks.find(
          (block) => block.id === burnData.tokenBlockId,
        );
        if (burnBlock) {
          const updatedBlocks = tokenDetails.blocks.map((block) => {
            if (block.id === burnData.tokenBlockId) {
              return {
                ...block,
                totalSupply: Math.max(0, block.totalSupply - burnData.amount),
              };
            }
            return block;
          });

          onTokenUpdate({
            ...tokenDetails,
            blocks: updatedBlocks,
          });

          toast({
            title: "Burn Approved",
            description: `Successfully burned ${burnData.amount} tokens.`,
          });
        }
        break;

      case "lock":
        const lockData = approval.data;
        // Update the token holder status
        setTokenHolders(
          tokenHolders.map((holder) => {
            if (holder.address === lockData.address) {
              return { ...holder, status: "locked" };
            }
            return holder;
          }),
        );

        toast({
          title: "Lock Approved",
          description: `Successfully locked wallet ${lockData.address}.`,
        });
        break;

      case "block":
        const blockData = approval.data;
        // Update the token holder status
        setTokenHolders(
          tokenHolders.map((holder) => {
            if (holder.address === blockData.address) {
              return { ...holder, status: "blocked" };
            }
            return holder;
          }),
        );

        toast({
          title: "Block Approved",
          description: `Successfully blocked wallet ${blockData.address}.`,
        });
        break;

      case "unblock":
        const unblockData = approval.data;
        // Update the token holder status
        setTokenHolders(
          tokenHolders.map((holder) => {
            if (holder.address === unblockData.address) {
              return { ...holder, status: "active" };
            }
            return holder;
          }),
        );

        toast({
          title: "Unblock Approved",
          description: `Successfully unblocked wallet ${unblockData.address}.`,
        });
        break;
    }

    // Remove from pending approvals
    setPendingApprovals(pendingApprovals.filter((a) => a.id !== approvalId));
  };

  // Filter token holders based on search
  const filteredHolders = tokenHolders.filter(
    (holder) =>
      holder.address.toLowerCase().includes(searchWallet.toLowerCase()) ||
      holder.name.toLowerCase().includes(searchWallet.toLowerCase()),
  );

  // Get blocked holders for unblock tab
  const blockedHolders = tokenHolders.filter(
    (holder) => holder.status === "blocked",
  );

  return (
    <Card className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Token Administration</h2>
          <p className="text-muted-foreground">
            Manage token operations, redemptions, and security settings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Total Supply:</span>
              <span className="font-mono">{totalSupply.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Holders:</span>
              <span className="font-mono">{holderCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPaused ? "destructive" : "success"}>
              {isPaused ? "Paused" : "Active"}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {isPaused ? (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isPaused
                      ? "Resume Token Operations?"
                      : "Pause Token Operations?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isPaused
                      ? "This will resume all token operations including transfers, minting, and burning."
                      : "This will temporarily halt all token operations including transfers, minting, and burning."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTogglePause}>
                    {isPaused ? "Resume" : "Pause"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {pendingApprovals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium capitalize">
                    {approval.type}
                  </TableCell>
                  <TableCell>
                    {approval.requestedBy || "Current User"}
                  </TableCell>
                  <TableCell>
                    {new Date(approval.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {approval.type === "redemption" &&
                      `${approval.data.redemptionAmount} tokens`}
                    {approval.type === "mint" &&
                      `${approval.data.amount} tokens to ${approval.data.recipient}`}
                    {approval.type === "burn" &&
                      `${approval.data.amount} tokens from ${approval.data.source}`}
                    {approval.type === "lock" &&
                      `Wallet ${approval.data.address}`}
                    {approval.type === "block" &&
                      `Wallet ${approval.data.address}`}
                    {approval.type === "unblock" &&
                      `Wallet ${approval.data.address}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleApproveAction(approval.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="redemption">
            <Coins className="h-4 w-4 mr-2" />
            Redemption
          </TabsTrigger>
          <TabsTrigger value="mint-burn">
            <Flame className="h-4 w-4 mr-2" />
            Mint & Burn
          </TabsTrigger>
          <TabsTrigger value="lock">
            <Lock className="h-4 w-4 mr-2" />
            Lock & Block
          </TabsTrigger>
          <TabsTrigger value="unblock">
            <Unlock className="h-4 w-4 mr-2" />
            Unblock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="redemption" className="space-y-4">
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">
              Redemption Functionality
            </h3>
            <p className="text-muted-foreground mb-4">
              This section allows you to redeem tokens from investors, either
              for a payout (fixed income, structured credit) or as a capital
              return (equity).
            </p>
            <p className="text-sm bg-muted p-4 rounded-md inline-block">
              Redemption form has been removed as requested. The functionality
              will be implemented in a future update.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="mint-burn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mint Section */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-500" />
                Mint Tokens
              </h3>
              <p className="text-muted-foreground mb-4">
                Create new tokens for initial or secondary issuance. Minted
                tokens will be recorded on the blockchain after approval.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token-block">Token Block</Label>
                  <Select
                    value={selectedTokenBlock}
                    onValueChange={setSelectedTokenBlock}
                  >
                    <SelectTrigger id="token-block">
                      <SelectValue placeholder="Select token block" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenDetails.blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {block.name} ({block.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint-amount">Amount to Mint</Label>
                  <Input
                    id="mint-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={mintAmount || ""}
                    onChange={(e) => setMintAmount(Number(e.target.value))}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint-recipient">
                    Recipient Wallet (Optional)
                  </Label>
                  <Input
                    id="mint-recipient"
                    placeholder="Enter wallet address or leave blank for issuer wallet"
                    value={mintRecipient}
                    onChange={(e) => setMintRecipient(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleMintRequest}
                  disabled={mintAmount <= 0}
                >
                  Submit Mint Request
                </Button>
              </div>
            </Card>

            {/* Burn Section */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Minus className="h-5 w-5 mr-2 text-red-500" />
                Burn Tokens
              </h3>
              <p className="text-muted-foreground mb-4">
                Reduce token supply by burning tokens. This permanently removes
                tokens from circulation with blockchain confirmation.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="burn-token-block">Token Block</Label>
                  <Select
                    value={selectedTokenBlock}
                    onValueChange={setSelectedTokenBlock}
                  >
                    <SelectTrigger id="burn-token-block">
                      <SelectValue placeholder="Select token block" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenDetails.blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {block.name} ({block.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="burn-amount">Amount to Burn</Label>
                  <Input
                    id="burn-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={burnAmount || ""}
                    onChange={(e) => setBurnAmount(Number(e.target.value))}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="burn-source">Source Wallet (Optional)</Label>
                  <Input
                    id="burn-source"
                    placeholder="Enter wallet address or leave blank for issuer wallet"
                    value={burnSource}
                    onChange={(e) => setBurnSource(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleBurnRequest}
                  disabled={burnAmount <= 0}
                  variant="outline"
                >
                  Submit Burn Request
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lock">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lock & Block Wallets</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by wallet or name"
                  className="pl-8"
                  value={searchWallet}
                  onChange={(e) => setSearchWallet(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Lock Wallet</h4>
                  <p className="text-sm text-muted-foreground ml-2">
                    Temporarily prevent a wallet from transferring tokens
                  </p>
                </div>

                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet Address</TableHead>
                        <TableHead>Investor Name</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHolders.map((holder) => (
                        <TableRow key={holder.address}>
                          <TableCell className="font-mono">
                            {holder.address}
                          </TableCell>
                          <TableCell>{holder.name}</TableCell>
                          <TableCell>
                            {holder.balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                holder.status === "active"
                                  ? "success"
                                  : holder.status === "locked"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {holder.status.charAt(0).toUpperCase() +
                                holder.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={holder.status !== "active"}
                              onClick={() => handleLockWallet(holder.address)}
                            >
                              <Lock className="h-4 w-4 mr-1" /> Lock
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium">Block Investor</h4>
                  <p className="text-sm text-muted-foreground ml-2">
                    Block an investor from selling or receiving tokens due to
                    regulatory reasons
                  </p>
                </div>

                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet Address</TableHead>
                        <TableHead>Investor Name</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHolders.map((holder) => (
                        <TableRow key={holder.address}>
                          <TableCell className="font-mono">
                            {holder.address}
                          </TableCell>
                          <TableCell>{holder.name}</TableCell>
                          <TableCell>
                            {holder.balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                holder.status === "active"
                                  ? "success"
                                  : holder.status === "locked"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {holder.status.charAt(0).toUpperCase() +
                                holder.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={holder.status === "blocked"}
                              onClick={() => handleBlockWallet(holder.address)}
                            >
                              <Shield className="h-4 w-4 mr-1" /> Block
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="unblock">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Unblock Investors</h3>
              <p className="text-sm text-muted-foreground ml-2">
                Re-enable transactions for previously blocked investors after
                compliance approval
              </p>
            </div>

            {blockedHolders.length > 0 ? (
              <Card className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Investor Name</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedHolders.map((holder) => (
                      <TableRow key={holder.address}>
                        <TableCell className="font-mono">
                          {holder.address}
                        </TableCell>
                        <TableCell>{holder.name}</TableCell>
                        <TableCell>{holder.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Blocked</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleUnblockWallet(holder.address)}
                          >
                            <Unlock className="h-4 w-4 mr-1" /> Unblock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">
                  No blocked investors found
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TokenAdministration;
