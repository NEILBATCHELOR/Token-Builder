import { TokenBlock, TokenStandard } from "@/types/token";

const erc20Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    string public name = "${block.name}";
    string public symbol = "${block.symbol}";
    uint8 public decimals = ${block.decimals};
    uint256 public totalSupply = ${block.totalSupply};
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
}`;

const erc721Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    string public name = "${block.name}";
    string public symbol = "${block.symbol}";
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;
    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;
    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in an account
     */
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    /**
     * @dev Returns the owner of the token
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    /**
     * @dev Returns the token URI
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Transfers ownership of a token
     */
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    /**
     * @dev Gives permission to transfer a token
     */
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not token owner or approved for all"
        );
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev Approve or remove operator for all tokens
     */
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "ERC721: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev Returns the approved address for a token
     */
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Returns if an address is an approved operator
     */
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Internal function to check if a token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Internal function to check if an address is the owner or approved
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    /**
     * @dev Internal function to transfer token
     */
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}

    /**
     * @dev Hook that is called after any token transfer
     */
    function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
}`;

const erc1155Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    // Mapping from token ID to account balances
    mapping(uint256 => mapping(address => uint256)) private _balances;
    // Mapping from account to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    // Mapping for token URIs
    mapping(uint256 => string) private _uris;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);

    /**
     * @dev Returns the URI for token type `id`.
     */
    function uri(uint256 id) public view returns (string memory) {
        return _uris[id];
    }

    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     */
    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[id][account];
    }

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not token owner or approved"
        );
        require(to != address(0), "ERC1155: transfer to the zero address");

        _beforeTokenTransfer(from, to, id, amount);

        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
        _balances[id][from] = fromBalance - amount;
        _balances[id][to] += amount;

        emit TransferSingle(msg.sender, from, to, id, amount);
    }

    /**
     * @dev Batched version of safeTransferFrom.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not token owner or approved"
        );
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");

        for(uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            _beforeTokenTransfer(from, to, id, amount);

            uint256 fromBalance = _balances[id][from];
            require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
            _balances[id][from] = fromBalance - amount;
            _balances[id][to] += amount;
        }

        emit TransferBatch(msg.sender, from, to, ids, amounts);
    }

    /**
     * @dev Grants or revokes permission to `operator` to transfer the caller's tokens.
     */
    function setApprovalForAll(address operator, bool approved) public {
        require(msg.sender != operator, "ERC1155: setting approval status for self");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
     */
    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    /**
     * @dev Hook that is called before any token transfer.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) internal virtual {}
}`;

const erc4626Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    string public name = "${block.name}";
    string public symbol = "${block.symbol}";
    address public asset;
    uint256 public totalAssets;
    
    // Mapping of user address to their share balance
    mapping(address => uint256) private _shares;
    // Total shares issued
    uint256 private _totalShares;
    
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
    
    constructor(address _asset) {
        asset = _asset;
    }
    
    /**
     * @dev Returns the total amount of the underlying asset managed by this vault.
     */
    function totalAssets() public view returns (uint256) {
        return totalAssets;
    }
    
    /**
     * @dev Returns the amount of shares owned by an account.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _shares[account];
    }
    
    /**
     * @dev Returns the total amount of shares issued by this vault.
     */
    function totalSupply() public view returns (uint256) {
        return _totalShares;
    }
    
    /**
     * @dev Deposits assets into the vault and receives shares in return.
     */
    function deposit(uint256 assets, address receiver) public returns (uint256 shares) {
        // Calculate shares to mint based on assets deposited
        shares = convertToShares(assets);
        
        // Update state
        _shares[receiver] += shares;
        _totalShares += shares;
        totalAssets += assets;
        
        emit Deposit(msg.sender, receiver, assets, shares);
        return shares;
    }
    
    /**
     * @dev Withdraws assets from the vault by burning shares.
     */
    function withdraw(uint256 assets, address receiver, address owner) public returns (uint256 shares) {
        // Calculate shares to burn based on assets withdrawn
        shares = convertToShares(assets);
        
        require(_shares[owner] >= shares, "ERC4626: insufficient shares");
        
        // Update state
        _shares[owner] -= shares;
        _totalShares -= shares;
        totalAssets -= assets;
        
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }
    
    /**
     * @dev Converts an amount of assets to an equivalent amount of shares.
     */
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }
    
    /**
     * @dev Converts an amount of shares to an equivalent amount of assets.
     */
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : (shares * totalAssets()) / supply;
    }
    
    /**
     * @dev Returns the maximum amount of assets that can be withdrawn.
     */
    function maxWithdraw(address owner) public view returns (uint256) {
        return convertToAssets(_shares[owner]);
    }
}`;

const erc3525Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    string public name = "${block.name}";
    string public symbol = "${block.symbol}";
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping from token ID to slot
    mapping(uint256 => uint256) private _slots;
    // Mapping from token ID to value
    mapping(uint256 => uint256) private _values;
    // Mapping from owner to token count
    mapping(address => uint256) private _balances;
    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;
    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event TransferValue(uint256 indexed fromTokenId, uint256 indexed toTokenId, uint256 value);
    event ApprovalValue(uint256 indexed tokenId, address indexed operator, uint256 value);
    event SlotChanged(uint256 indexed tokenId, uint256 indexed oldSlot, uint256 indexed newSlot);
    
    /**
     * @dev Returns the slot of a token
     */
    function slotOf(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC3525: slot query for nonexistent token");
        return _slots[tokenId];
    }
    
    /**
     * @dev Returns the value of a token
     */
    function valueOf(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC3525: value query for nonexistent token");
        return _values[tokenId];
    }
    
    /**
     * @dev Transfers value from one token to another
     */
    function transferValueFrom(
        uint256 fromTokenId,
        uint256 toTokenId,
        uint256 value
    ) public {
        require(_exists(fromTokenId), "ERC3525: transfer from nonexistent token");
        require(_exists(toTokenId), "ERC3525: transfer to nonexistent token");
        require(_slots[fromTokenId] == _slots[toTokenId], "ERC3525: transfer between different slots");
        require(_values[fromTokenId] >= value, "ERC3525: insufficient value");
        
        _values[fromTokenId] -= value;
        _values[toTokenId] += value;
        
        emit TransferValue(fromTokenId, toTokenId, value);
    }
    
    /**
     * @dev Creates a new token with a specific slot and value
     */
    function _mint(
        address to,
        uint256 tokenId,
        uint256 slot,
        uint256 value
    ) internal {
        require(to != address(0), "ERC3525: mint to the zero address");
        require(!_exists(tokenId), "ERC3525: token already minted");
        
        _owners[tokenId] = to;
        _slots[tokenId] = slot;
        _values[tokenId] = value;
        _balances[to] += 1;
        
        emit Transfer(address(0), to, tokenId);
        emit SlotChanged(tokenId, 0, slot);
    }
    
    /**
     * @dev Internal function to check if a token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }
    
    /**
     * @dev Splits a token into two by creating a new token with part of the value
     */
    function _splitValue(
        uint256 tokenId,
        uint256 value,
        address to
    ) internal returns (uint256 newTokenId) {
        require(_exists(tokenId), "ERC3525: split from nonexistent token");
        require(_values[tokenId] >= value, "ERC3525: insufficient value");
        
        // Create new token ID
        newTokenId = tokenId + 1; // Simplified for example
        while (_exists(newTokenId)) {
            newTokenId++;
        }
        
        // Mint new token with same slot but split value
        _mint(to, newTokenId, _slots[tokenId], value);
        
        // Reduce value from original token
        _values[tokenId] -= value;
        
        return newTokenId;
    }
}`;

const erc1400Template = (block: TokenBlock) => `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${block.name.replace(/\s+/g, "")} {
    string public name = "${block.name}";
    string public symbol = "${block.symbol}";
    uint8 public decimals = ${block.decimals || 18};
    uint256 public totalSupply;
    
    // Mapping from investor to balance
    mapping(address => uint256) private _balances;
    // Mapping from investor to KYC status
    mapping(address => bool) private _kyc;
    // Mapping from investor to jurisdiction
    mapping(address => string) private _jurisdictions;
    // Mapping from jurisdiction to restriction status
    mapping(string => bool) private _restrictedJurisdictions;
    // Mapping from investor to lock-up end time
    mapping(address => uint256) private _lockupEndTime;
    
    // Issuance and maturity dates
    uint256 public issuanceDate;
    uint256 public maturityDate;
    
    // Transfer restriction flags
    bool public transferRestrictions;
    bool public lockupPeriods;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Issuance(address indexed to, uint256 value);
    event Redemption(address indexed from, uint256 value);
    event KYCUpdated(address indexed investor, bool status);
    
    constructor() {
        issuanceDate = block.timestamp;
        transferRestrictions = true;
    }
    
    /**
     * @dev Returns the balance of an investor
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Checks if an investor is KYC verified
     */
    function isKYCVerified(address investor) public view returns (bool) {
        return _kyc[investor];
    }
    
    /**
     * @dev Checks if a jurisdiction is restricted
     */
    function isJurisdictionRestricted(string memory jurisdiction) public view returns (bool) {
        return _restrictedJurisdictions[jurisdiction];
    }
    
    /**
     * @dev Transfers tokens with compliance checks
     */
    function transfer(address to, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "ERC1400: insufficient balance");
        
        // Compliance checks
        if (transferRestrictions) {
            require(_kyc[msg.sender] && _kyc[to], "ERC1400: KYC verification required");
            require(!isJurisdictionRestricted(_jurisdictions[to]), "ERC1400: recipient in restricted jurisdiction");
        }
        
        // Lock-up period check
        if (lockupPeriods) {
            require(block.timestamp >= _lockupEndTime[msg.sender], "ERC1400: tokens are locked");
        }
        
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Issues new tokens to an investor (admin only)
     */
    function issue(address to, uint256 amount) public {
        // Admin check would be here
        
        require(_kyc[to], "ERC1400: KYC verification required");
        require(!isJurisdictionRestricted(_jurisdictions[to]), "ERC1400: recipient in restricted jurisdiction");
        
        _balances[to] += amount;
        totalSupply += amount;
        
        emit Issuance(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    /**
     * @dev Redeems tokens from an investor (admin only)
     */
    function redeem(address from, uint256 amount) public {
        // Admin check would be here
        
        require(_balances[from] >= amount, "ERC1400: insufficient balance");
        
        _balances[from] -= amount;
        totalSupply -= amount;
        
        emit Redemption(from, amount);
        emit Transfer(from, address(0), amount);
    }
    
    /**
     * @dev Updates KYC status for an investor (admin only)
     */
    function setKYC(address investor, bool status) public {
        // Admin check would be here
        
        _kyc[investor] = status;
        
        emit KYCUpdated(investor, status);
    }
    
    /**
     * @dev Sets jurisdiction for an investor (admin only)
     */
    function setJurisdiction(address investor, string memory jurisdiction) public {
        // Admin check would be here
        
        _jurisdictions[investor] = jurisdiction;
    }
    
    /**
     * @dev Sets restricted jurisdiction status (admin only)
     */
    function setRestrictedJurisdiction(string memory jurisdiction, bool restricted) public {
        // Admin check would be here
        
        _restrictedJurisdictions[jurisdiction] = restricted;
    }
    
    /**
     * @dev Sets lock-up period for an investor (admin only)
     */
    function setLockup(address investor, uint256 endTime) public {
        // Admin check would be here
        
        _lockupEndTime[investor] = endTime;
    }
}`;

export const generateContract = (block: TokenBlock): string => {
  const templates: Record<TokenStandard, (block: TokenBlock) => string> = {
    ERC20: erc20Template,
    ERC721: erc721Template,
    ERC1155: erc1155Template,
    ERC1400: erc1400Template,
    ERC3525: erc3525Template,
    ERC4626: erc4626Template,
  };

  return templates[block.standard](block);
};
