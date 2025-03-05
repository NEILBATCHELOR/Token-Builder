import React from "react";
import TokenAdministration from "./TokenAdministration";
import { TokenFormData } from "@/types/token";

const TokenAdminScreen = () => {
  // Example token data - in a real app, this would come from your API or state management
  const tokenData: TokenFormData = {
    name: "Chain Capital Security Token",
    symbol: "CCST",
    decimals: 18,
    standard: "ERC1400",
    blocks: [
      {
        id: "0-abc123",
        name: "Chain Capital Security Token",
        symbol: "CCST",
        standard: "ERC1400",
        decimals: 18,
        totalSupply: 1000000,
        metadata: {
          mintable: true,
          burnable: true,
          pausable: true,
          transferRestrictions: true,
          description: "A security token for real estate investments",
          issuerName: "Chain Capital LLC",
          securityType: "equity",
          complianceRequirements: "KYC/AML verification required",
        },
      },
      {
        id: "1-def456",
        name: "Preferred Shares",
        symbol: "CCSTP",
        standard: "ERC1400",
        decimals: 18,
        totalSupply: 500000,
        ratioToFirstBlock: 2,
        metadata: {
          mintable: true,
          burnable: true,
          pausable: true,
          transferRestrictions: true,
          description: "Preferred shares with priority dividend rights",
          issuerName: "Chain Capital LLC",
          securityType: "preferred equity",
          complianceRequirements: "Accredited investors only",
        },
      },
    ],
    metadata: {
      description: "A security token for real estate investments",
      external_url: "https://chaincapital.example.com",
      is_transferable: true,
      max_supply: 1000000,
    },
    status: "APPROVED",
  };

  const handleTokenUpdate = (updatedToken: TokenFormData) => {
    // In a real app, you would update your state or call an API
    console.log("Token updated:", updatedToken);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Token Administration</h1>
      <TokenAdministration
        tokenDetails={tokenData}
        onTokenUpdate={handleTokenUpdate}
      />
    </div>
  );
};

export default TokenAdminScreen;
