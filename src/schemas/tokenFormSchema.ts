import { z } from "zod";
import { TokenStandard } from "@/types/token";

export const tokenBlockSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Token name is required"),
  symbol: z
    .string()
    .min(1, "Token symbol is required")
    .max(10, "Symbol should be 10 characters or less"),
  standard: z.enum(
    ["ERC20", "ERC721", "ERC1155", "ERC1400", "ERC3525", "ERC4626"],
    {
      required_error: "Token standard is required",
    },
  ),
  decimals: z.number().min(0).max(18),
  totalSupply: z.number().min(0, "Total supply must be a positive number"),
  ownerAddress: z.string().optional(),
  ratioToFirstBlock: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z
    .string()
    .min(1, "Token symbol is required")
    .max(10, "Symbol should be 10 characters or less"),
  decimals: z.number().min(0).max(18),
  standard: z.enum(
    ["ERC20", "ERC721", "ERC1155", "ERC1400", "ERC3525", "ERC4626"],
    {
      required_error: "Token standard is required",
    },
  ),
  blocks: z
    .array(tokenBlockSchema)
    .min(1, "At least one token block is required"),
  metadata: z.record(z.any()).optional(),
  status: z
    .enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "PAUSED"])
    .default("DRAFT"),
  reviewers: z.array(z.string()).optional(),
  approvals: z.array(z.string()).optional(),
  contractPreview: z.string().optional(),
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;
export type TokenBlockValues = z.infer<typeof tokenBlockSchema>;
