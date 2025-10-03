// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuestToken
 * @dev ERC20 token for QuestBridge with quest completion tracking
 * Gas optimized with efficient event emission on transfers
 */
contract QuestToken is ERC20, Ownable {
    /// @dev Custom event emitted when tokens are transferred (quest completion)
    event QuestCompleted(address indexed player, uint256 amount);

    /// @dev Total supply cap for gas efficiency
    uint256 private constant MAX_SUPPLY = 1_000_000 * 10**18; // 1M tokens
    uint256 private constant INITIAL_MINT = 1000 * 10**18; // 1000 tokens

    /// @dev Mapping to track quest completions (one-time only)
    mapping(address => bool) public questCompleted;

    /**
     * @dev Constructor initializes the token with name and symbol
     * Mints initial supply to deployer for quest rewards
     */
    constructor()
        ERC20("QuestToken", "QUEST")
        Ownable(msg.sender)
    {
        // Mint initial supply to deployer for quest rewards
        _mint(msg.sender, INITIAL_MINT);
    }

    /**
     * @dev Override transfer to emit QuestCompleted event
     * @param to Address receiving tokens
     * @param value Amount of tokens to transfer
     * @return bool Success status
     */
    function transfer(address to, uint256 value)
        public
        override
        returns (bool)
    {
        bool success = super.transfer(to, value);

        if (success && value > 0) {
            emit QuestCompleted(to, value);
        }

        return success;
    }

    /**
     * @dev Override transferFrom to emit QuestCompleted event
     * @param from Address sending tokens
     * @param to Address receiving tokens
     * @param value Amount of tokens to transfer
     * @return bool Success status
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        bool success = super.transferFrom(from, to, value);

        if (success && value > 0) {
            emit QuestCompleted(to, value);
        }

        return success;
    }

    /**
      * @dev Mint new tokens (owner only)
      * @param to Address to mint tokens to
      * @param amount Amount of tokens to mint
      */
     function mint(address to, uint256 amount) external onlyOwner {
         require(to != address(0), "QuestToken: cannot mint to zero address");
         require(
             totalSupply() + amount <= MAX_SUPPLY,
             "QuestToken: max supply exceeded"
         );

         _mint(to, amount);
     }

     /**
      * @dev Claim tokens from faucet (public function)
      * @param amount Amount of tokens to claim (50, 100, or 200)
      */
     function claimFaucet(uint256 amount) external {
         require(amount == 50 * 10**18 || amount == 100 * 10**18 || amount == 200 * 10**18,
                 "QuestToken: invalid faucet amount");
         require(totalSupply() + amount <= MAX_SUPPLY, "QuestToken: max supply exceeded");
         require(balanceOf(msg.sender) == 0, "QuestToken: can only claim once");

         _mint(msg.sender, amount);
     }

     /**
      * @dev Complete quest and earn tokens (one-time only)
      * @param answer The answer to the quest riddle
      */
     function completeQuest(string calldata answer) external {
         require(!questCompleted[msg.sender], "QuestToken: quest already completed");
         require(totalSupply() + (50 * 10**18) <= MAX_SUPPLY, "QuestToken: max supply exceeded");

         // Simple quest validation - can be made more sophisticated
         require(keccak256(bytes(answer)) == keccak256(bytes("questbridge")),
                 "QuestToken: wrong answer");

         questCompleted[msg.sender] = true;
         _mint(msg.sender, 50 * 10**18); // Reward 50 tokens
     }

     /**
      * @dev Check if address has completed the quest
      * @param account Address to check
      * @return bool Quest completion status
      */
     function hasCompletedQuest(address account) external view returns (bool) {
         return questCompleted[account];
     }

    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Get maximum supply cap
     * @return uint256 Maximum token supply
     */
    function getMaxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }
}