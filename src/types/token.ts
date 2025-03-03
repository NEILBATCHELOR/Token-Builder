export type TokenStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PAUSED";

export type TokenStandard =
  | "ERC20"
  | "ERC721"
  | "ERC1155"
  | "ERC1400"
  | "ERC3525"
  | "ERC4626";

export interface TokenBlock {
  id: string;
  name: string;
  symbol: string;
  standard: TokenStandard;
  decimals: number;
  totalSupply: number;
  ownerAddress?: string;
  ratioToFirstBlock?: number;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Record<string, any>;
  // ERC20 specific
  totalSupply?: number;
  contractAddress?: string;
  // ERC721 specific
  imageUrl?: string;
  rarity?: string;
  color?: string;
  // ERC1155 specific
  type?: "Fungible" | "Semi-Fungible" | "Non-Fungible";
  amount?: number;
  uri?: string;
  burnable?: boolean;
  transferable?: boolean;
  // ERC1400 specific
  complianceRules?: {
    jurisdiction: string;
    whitelist: string[];
  };
  issuanceDate?: string;
  maturityDate?: string;
  // ERC3525 specific
  tokenId?: number;
  slot?: number;
  value?: number;
  interestRate?: number;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  standard: TokenStandard;
  blocks: TokenBlock[];
  metadata: TokenMetadata;
  status: TokenStatus;
  reviewers?: string[];
  approvals?: string[];
  contractPreview?: string;
}
