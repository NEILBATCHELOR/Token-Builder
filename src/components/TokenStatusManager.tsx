import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DeploymentStatus } from "./DeploymentStatus";
import { TokenStatus } from "@/types/token";
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
import { ScrollArea } from "./ui/scroll-area";

interface TokenStatusManagerProps {
  status: TokenStatus;
  onStatusChange: (newStatus: TokenStatus) => void;
  approvals?: string[];
  onApprove?: (approver: string) => void;
}

const statusTransitions: Record<TokenStatus, TokenStatus[]> = {
  DRAFT: ["PENDING_REVIEW"],
  PENDING_REVIEW: ["APPROVED", "DRAFT"],
  APPROVED: ["PAUSED"],
  PAUSED: ["APPROVED"],
};

const statusActions: Record<
  TokenStatus,
  { label: string; description: string }
> = {
  DRAFT: {
    label: "Submit for Review",
    description: "Submit this token configuration for review and approval",
  },
  PENDING_REVIEW: {
    label: "Approve",
    description: "Approve this token configuration for deployment",
  },
  APPROVED: {
    label: "Pause",
    description: "Pause this token's operations",
  },
  PAUSED: {
    label: "Resume",
    description: "Resume this token's operations",
  },
};

export default function TokenStatusManager({
  status,
  onStatusChange,
  approvals = [],
  onApprove,
}: TokenStatusManagerProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const availableTransitions = statusTransitions[status] || [];

  const handleStatusChange = (newStatus: TokenStatus) => {
    setIsTransitioning(true);
    onStatusChange(newStatus);
    setIsTransitioning(false);
  };

  const requiresApproval = status === "PENDING_REVIEW";
  const canApprove = requiresApproval && onApprove;
  const approvalCount = approvals.length;
  const requiredApprovals = 2; // 2-of-3 consensus

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Deployment Status</h3>
        <DeploymentStatus status={status} />
      </div>

      {requiresApproval && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Approvals: {approvalCount}/{requiredApprovals}
          </p>
          <ScrollArea className="h-20 rounded-md border">
            {approvals.map((approver) => (
              <div key={approver} className="p-2 text-sm">
                {approver} approved
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      <div className="space-y-2">
        {availableTransitions.map((newStatus) => (
          <AlertDialog key={newStatus}>
            <AlertDialogTrigger asChild>
              <Button
                variant={newStatus === "APPROVED" ? "default" : "secondary"}
                className="w-full"
                disabled={isTransitioning}
              >
                {statusActions[newStatus].label}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {statusActions[newStatus].label}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {statusActions[newStatus].description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusChange(newStatus)}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}

        {canApprove && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onApprove("Current User")}
            disabled={approvals.includes("Current User")}
          >
            Add Approval
          </Button>
        )}
      </div>
    </Card>
  );
}
