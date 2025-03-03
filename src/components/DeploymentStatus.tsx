import { Badge } from "./ui/badge";
import { TokenStatus } from "@/types/token";

interface DeploymentStatusProps {
  status: TokenStatus;
}

const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING_REVIEW: { label: "Pending Review", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  PAUSED: { label: "Paused", variant: "destructive" },
} as const;

export const DeploymentStatus = ({
  status = "DRAFT",
}: DeploymentStatusProps) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant as any}>{config.label}</Badge>;
};
