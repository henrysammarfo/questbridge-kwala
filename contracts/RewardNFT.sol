// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RewardNFT
 * @dev ERC721 token for QuestBridge rewards with dynamic URI support
 * Minting is open for Kwala integration
 */
contract RewardNFT is ERC721, Ownable {
    using Strings for uint256;

    /// @dev Custom event emitted when reward NFT is minted
    event RewardMinted(address indexed player, uint256 indexed tokenId);

    /// @dev Base URI for token metadata
    string private _baseTokenURI;

    /// @dev Token ID counter for gas-efficient minting
    uint256 private _nextTokenId;

    /// @dev Mapping to store custom token URIs for dynamic metadata
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Constructor initializes the NFT with name and symbol
     */
    constructor()
        ERC721("QuestBridge Reward", "QBR")
        Ownable(msg.sender)
    {
        _nextTokenId = 1;
        _baseTokenURI = "https://api.questbridge.com/metadata/";
    }

    /**
     * @dev Mint reward NFT to player (open minting for Kwala)
     * @param to Address to mint NFT to
     * @return tokenId The ID of the minted token
     */
    function mintReward(address to) external returns (uint256 tokenId) {
        require(to != address(0), "RewardNFT: cannot mint to zero address");

        tokenId = _nextTokenId;
        _nextTokenId++;

        _mint(to, tokenId);
        emit RewardMinted(to, tokenId);

        return tokenId;
    }

    /**
     * @dev Set custom URI for specific token (owner only)
     * @param tokenId Token ID to set URI for
     * @param customURI Custom URI for the token
     */
    function setTokenURI(uint256 tokenId, string calldata customURI) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "RewardNFT: token does not exist");
        _tokenURIs[tokenId] = customURI;
    }

    /**
     * @dev Set base URI for all tokens (owner only)
     * @param baseURI New base URI
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Get token URI for metadata
     * @param tokenId Token ID to get URI for
     * @return string Token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "RewardNFT: token does not exist");

        // Return custom URI if set, otherwise use base URI
        string memory customURI = _tokenURIs[tokenId];
        if (bytes(customURI).length > 0) {
            return customURI;
        }

        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    /**
     * @dev Batch mint rewards (owner only for efficiency)
     * @param recipients Array of addresses to mint to
     * @return tokenIds Array of minted token IDs
     */
    function batchMintRewards(address[] calldata recipients)
        external
        onlyOwner
        returns (uint256[] memory tokenIds)
    {
        require(recipients.length > 0, "RewardNFT: no recipients");
        require(recipients.length <= 100, "RewardNFT: batch too large");

        tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; ) {
            address recipient = recipients[i];
            require(recipient != address(0), "RewardNFT: cannot mint to zero address");

            uint256 tokenId = _nextTokenId;
            _nextTokenId++;

            _mint(recipient, tokenId);
            emit RewardMinted(recipient, tokenId);

            tokenIds[i] = tokenId;

            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev Get next token ID (for external tracking)
     * @return uint256 Next token ID to be minted
     */
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get base token URI
     * @return string Base URI for tokens
     */
    function getBaseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Check if token has custom URI
     * @param tokenId Token ID to check
     * @return bool Whether token has custom URI
     */
    function hasCustomURI(uint256 tokenId) external view returns (bool) {
        return bytes(_tokenURIs[tokenId]).length > 0;
    }
}