import React from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Check, X, HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FeatureItem {
  name: string;
  description: string;
  supported: boolean | "partial";
}

interface TokenStandardInfo {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  features: FeatureItem[];
  example: string;
  pros: string[];
  cons: string[];
}

const tokenStandards: TokenStandardInfo[] = [
  {
    id: "ERC20",
    name: "ERC20 - Fungible Token",
    description:
      "The most common token standard for fungible assets, where each token is identical and has the same value.",
    useCases: [
      "Cryptocurrencies",
      "Utility tokens",
      "Governance tokens",
      "Stablecoins",
      "Reward points",
    ],
    features: [
      {
        name: "Fungibility",
        description: "All tokens are identical and interchangeable",
        supported: true,
      },
      {
        name: "Divisibility",
        description: "Can be divided into smaller units (e.g., 0.01 tokens)",
        supported: true,
      },
      {
        name: "Metadata",
        description: "Support for rich metadata and attributes",
        supported: false,
      },
      {
        name: "Batch Transfers",
        description: "Transfer multiple tokens in a single transaction",
        supported: false,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
}`,
    pros: [
      "Widely adopted and supported by most wallets and exchanges",
      "Simple implementation with low gas costs",
      "Well-suited for financial applications",
    ],
    cons: [
      "Limited metadata capabilities",
      "No built-in support for batch operations",
      "Cannot represent unique items",
    ],
  },
  {
    id: "ERC721",
    name: "ERC721 - Non-Fungible Token",
    description:
      "The standard for non-fungible tokens (NFTs), where each token is unique and has distinct properties.",
    useCases: [
      "Digital art and collectibles",
      "Virtual real estate",
      "Gaming items",
      "Certificates and licenses",
      "Identity verification",
    ],
    features: [
      {
        name: "Uniqueness",
        description: "Each token has a unique ID and properties",
        supported: true,
      },
      {
        name: "Metadata",
        description: "Rich metadata support via tokenURI",
        supported: true,
      },
      {
        name: "Ownership",
        description: "Clear ownership tracking per token ID",
        supported: true,
      },
      {
        name: "Divisibility",
        description: "Can be divided into smaller units",
        supported: false,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyNFT {
    string public name = "My NFT Collection";
    string public symbol = "MNFT";
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;
    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;
    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }
}`,
    pros: [
      "Perfect for representing unique digital assets",
      "Rich metadata support for detailed asset information",
      "Growing ecosystem support in marketplaces",
    ],
    cons: [
      "Higher gas costs than ERC20",
      "Not suitable for fungible assets",
      "Limited batch operation support in the base standard",
    ],
  },
  {
    id: "ERC1155",
    name: "ERC1155 - Multi Token",
    description:
      "A versatile standard that supports both fungible and non-fungible tokens in a single contract, with batch operations.",
    useCases: [
      "Gaming (items, currencies, characters)",
      "Mixed asset marketplaces",
      "Complex token ecosystems",
      "Efficient NFT collections",
      "Token bundles",
    ],
    features: [
      {
        name: "Multi-token Support",
        description: "Can represent both fungible and non-fungible tokens",
        supported: true,
      },
      {
        name: "Batch Operations",
        description: "Transfer multiple tokens in a single transaction",
        supported: true,
      },
      {
        name: "Gas Efficiency",
        description: "More efficient than separate ERC20/ERC721 contracts",
        supported: true,
      },
      {
        name: "Metadata",
        description: "Support for rich metadata and attributes",
        supported: true,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiToken {
    // Mapping from token ID to account balances
    mapping(uint256 => mapping(address => uint256)) private _balances;
    // Mapping for token URIs
    mapping(uint256 => string) private _uris;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);

    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[id][account];
    }

    function uri(uint256 id) public view returns (string memory) {
        return _uris[id];
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "ERC1155: caller is not owner nor approved");
        _balances[id][from] -= amount;
        _balances[id][to] += amount;
        emit TransferSingle(msg.sender, from, to, id, amount);
    }

    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "ERC1155: caller is not owner nor approved");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        
        for(uint256 i = 0; i < ids.length; ++i) {
            _balances[ids[i]][from] -= amounts[i];
            _balances[ids[i]][to] += amounts[i];
        }
        
        emit TransferBatch(msg.sender, from, to, ids, amounts);
    }

    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return false; // Simplified for example
    }
}`,
    pros: [
      "Highly versatile for complex token ecosystems",
      "Gas efficient with batch operations",
      "Simplifies management of multiple token types",
    ],
    cons: [
      "More complex implementation than ERC20 or ERC721",
      "Less specialized than dedicated standards",
      "Newer standard with evolving ecosystem support",
    ],
  },
  {
    id: "ERC1400",
    name: "ERC1400 - Security Token",
    description:
      "A comprehensive standard for security tokens with built-in compliance and regulatory features.",
    useCases: [
      "Security tokens",
      "Regulated financial instruments",
      "Equity tokens",
      "Debt tokens",
      "Real estate tokens",
    ],
    features: [
      {
        name: "Compliance Controls",
        description: "Built-in KYC/AML and regulatory compliance",
        supported: true,
      },
      {
        name: "Transfer Restrictions",
        description: "Ability to restrict transfers based on rules",
        supported: true,
      },
      {
        name: "Partitioned Balances",
        description: "Support for different classes of tokens",
        supported: true,
      },
      {
        name: "Document Management",
        description: "Link legal documents to token issuance",
        supported: true,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecurityToken {
    string public name = "Security Token";
    string public symbol = "STKN";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // Mapping from investor to balance
    mapping(address => uint256) private _balances;
    // Mapping from investor to KYC status
    mapping(address => bool) private _kyc;
    // Mapping from investor to jurisdiction
    mapping(address => string) private _jurisdictions;
    // Mapping from jurisdiction to restriction status
    mapping(string => bool) private _restrictedJurisdictions;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event KYCUpdated(address indexed investor, bool status);
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        require(_kyc[msg.sender] && _kyc[to], "KYC verification required");
        require(!isJurisdictionRestricted(_jurisdictions[to]), "Recipient in restricted jurisdiction");
        
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function isJurisdictionRestricted(string memory jurisdiction) public view returns (bool) {
        return _restrictedJurisdictions[jurisdiction];
    }
    
    function setKYC(address investor, bool status) public {
        // Admin check would be here
        _kyc[investor] = status;
        emit KYCUpdated(investor, status);
    }
}`,
    pros: [
      "Comprehensive compliance features for regulated assets",
      "Supports complex financial instruments",
      "Built-in regulatory controls",
    ],
    cons: [
      "Complex implementation with higher gas costs",
      "Specialized use cases with less general adoption",
      "Requires ongoing compliance management",
    ],
  },
  {
    id: "ERC3525",
    name: "ERC3525 - Semi-Fungible Token",
    description:
      "A hybrid standard for semi-fungible tokens that combines aspects of both ERC20 and ERC721, with value and slot concepts.",
    useCases: [
      "Time-bound assets (tickets, reservations)",
      "Partially fungible collectibles",
      "Tokenized credit and loans",
      "Fractionalized real assets",
      "Graduated ownership rights",
    ],
    features: [
      {
        name: "Slot Categorization",
        description: "Group tokens by shared attributes (slots)",
        supported: true,
      },
      {
        name: "Value Quantification",
        description: "Assign numerical values to tokens",
        supported: true,
      },
      {
        name: "Value Transfer",
        description: "Transfer value between tokens in the same slot",
        supported: true,
      },
      {
        name: "Approval Delegation",
        description: "Delegate approval for specific values",
        supported: true,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SemiFungibleToken {
    string public name = "Semi-Fungible Token";
    string public symbol = "SFT";
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping from token ID to slot
    mapping(uint256 => uint256) private _slots;
    // Mapping from token ID to value
    mapping(uint256 => uint256) private _values;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event TransferValue(uint256 indexed fromTokenId, uint256 indexed toTokenId, uint256 value);
    event SlotChanged(uint256 indexed tokenId, uint256 indexed oldSlot, uint256 indexed newSlot);
    
    function slotOf(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC3525: slot query for nonexistent token");
        return _slots[tokenId];
    }
    
    function valueOf(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC3525: value query for nonexistent token");
        return _values[tokenId];
    }
    
    function transferValueFrom(uint256 fromTokenId, uint256 toTokenId, uint256 value) public {
        require(_slots[fromTokenId] == _slots[toTokenId], "ERC3525: transfer between different slots");
        require(_values[fromTokenId] >= value, "ERC3525: insufficient value");
        
        _values[fromTokenId] -= value;
        _values[toTokenId] += value;
        
        emit TransferValue(fromTokenId, toTokenId, value);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }
}`,
    pros: [
      "Flexible for assets with both unique and fungible properties",
      "Efficient value transfers within categories",
      "Good for representing complex real-world assets",
    ],
    cons: [
      "Newer standard with limited ecosystem support",
      "More complex than pure ERC20 or ERC721",
      "Specialized use cases",
    ],
  },
  {
    id: "ERC4626",
    name: "ERC4626 - Tokenized Vault Standard",
    description:
      "A standard for yield-bearing vaults that tokenize strategies for lending, staking, and other DeFi applications.",
    useCases: [
      "Yield-bearing tokens",
      "Automated investment strategies",
      "Lending protocols",
      "Staking pools",
      "Treasury management",
    ],
    features: [
      {
        name: "Standardized Vault API",
        description: "Consistent interface for deposit/withdrawal",
        supported: true,
      },
      {
        name: "Asset/Share Accounting",
        description: "Automatic conversion between assets and shares",
        supported: true,
      },
      {
        name: "Yield Distribution",
        description: "Built-in mechanism for yield accrual",
        supported: true,
      },
      {
        name: "Composability",
        description: "Easy integration with other DeFi protocols",
        supported: true,
      },
    ],
    example: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenizedVault {
    string public name = "Tokenized Vault";
    string public symbol = "vTKN";
    address public asset; // The underlying asset (e.g., DAI)
    
    // Mapping of user address to their share balance
    mapping(address => uint256) private _shares;
    // Total shares issued
    uint256 private _totalShares;
    // Total assets managed by vault
    uint256 private _totalAssets;
    
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
    
    function totalAssets() public view returns (uint256) {
        return _totalAssets;
    }
    
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = _totalShares;
        return supply == 0 ? assets : (assets * supply) / _totalAssets;
    }
    
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = _totalShares;
        return supply == 0 ? shares : (shares * _totalAssets) / supply;
    }
    
    function deposit(uint256 assets, address receiver) public returns (uint256 shares) {
        shares = convertToShares(assets);
        
        _shares[receiver] += shares;
        _totalShares += shares;
        _totalAssets += assets;
        
        emit Deposit(msg.sender, receiver, assets, shares);
        return shares;
    }
    
    function withdraw(uint256 assets, address receiver, address owner) public returns (uint256 shares) {
        shares = convertToShares(assets);
        
        _shares[owner] -= shares;
        _totalShares -= shares;
        _totalAssets -= assets;
        
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }
}`,
    pros: [
      "Standardized interface for yield-bearing tokens",
      "Improves interoperability between DeFi protocols",
      "Simplifies integration of yield strategies",
    ],
    cons: [
      "Specialized for yield-bearing applications",
      "Newer standard with growing ecosystem support",
      "More complex than basic token standards",
    ],
  },
];

const FeatureSupport = ({ supported }: { supported: boolean | "partial" }) => {
  if (supported === true) {
    return <Check className="h-5 w-5 text-green-500" />;
  } else if (supported === "partial") {
    return <HelpCircle className="h-5 w-5 text-amber-500" />;
  } else {
    return <X className="h-5 w-5 text-red-500" />;
  }
};

const TokenStandardGuide = () => {
  return (
    <Card className="p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-6">
        Token Standard Selection Guide
      </h2>
      <p className="text-muted-foreground mb-6">
        Choose the right token standard for your project based on your specific
        requirements and use case.
      </p>

      <Tabs defaultValue="ERC20">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
          {tokenStandards.map((standard) => (
            <TabsTrigger key={standard.id} value={standard.id}>
              {standard.id}
            </TabsTrigger>
          ))}
        </TabsList>

        {tokenStandards.map((standard) => (
          <TabsContent
            key={standard.id}
            value={standard.id}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{standard.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p>{standard.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-muted-foreground">{standard.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Ideal Use Cases</h4>
              <div className="flex flex-wrap gap-2">
                {standard.useCases.map((useCase, index) => (
                  <Badge key={index} variant="outline">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standard.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 border rounded-md"
                  >
                    <div className="mt-0.5">
                      <FeatureSupport supported={feature.supported} />
                    </div>
                    <div>
                      <h5 className="font-medium">{feature.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Pros</h4>
                <ul className="space-y-2">
                  {standard.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Cons</h4>
                <ul className="space-y-2">
                  {standard.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">
                Example Implementation
              </h4>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="text-sm font-mono">{standard.example}</pre>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default TokenStandardGuide;
