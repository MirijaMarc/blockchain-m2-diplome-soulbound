// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SoulboundDiploma
/// @notice EIP-5114 compliant non-transferable NFT representing academic diplomas.
///         Only the contract owner (the university) can mint diplomas.
/// @dev Transfer and approval functions are disabled to enforce soulbound semantics.
contract SoulboundDiploma is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct Diploma {
        string studentName;
        string degree;
        string major;
        uint16 graduationYear;
        string metadataURI;
    }

    mapping(uint256 => Diploma) private _diplomas;
    mapping(address => uint256[]) private _holderTokens;

    event DiplomaIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string studentName,
        string degree,
        uint16 graduationYear
    );

    error SoulboundTransferForbidden();

    constructor() ERC721("Soulbound Diploma", "SBDIP") Ownable(msg.sender) {}

    /// @notice Issue a diploma NFT to a graduate. Only callable by the owner.
    /// @param recipient Wallet address of the graduate
    /// @param studentName Full name of the student
    /// @param degree Degree title (e.g. "Master of Science")
    /// @param major Field of study
    /// @param graduationYear Year of graduation
    /// @param metadataURI IPFS URI pointing to the diploma metadata JSON
    /// @return tokenId The newly minted token ID
    function issueDiploma(
        address recipient,
        string calldata studentName,
        string calldata degree,
        string calldata major,
        uint16 graduationYear,
        string calldata metadataURI
    ) external onlyOwner returns (uint256 tokenId) {
        require(recipient != address(0), "SoulboundDiploma: invalid recipient");
        require(bytes(studentName).length > 0, "SoulboundDiploma: name required");
        require(bytes(degree).length > 0, "SoulboundDiploma: degree required");
        require(graduationYear >= 2000 && graduationYear <= 2100, "SoulboundDiploma: invalid year");

        tokenId = _nextTokenId++;

        _diplomas[tokenId] = Diploma(studentName, degree, major, graduationYear, metadataURI);
        _holderTokens[recipient].push(tokenId);

        _mint(recipient, tokenId);

        emit DiplomaIssued(tokenId, recipient, studentName, degree, graduationYear);
    }

    /// @notice Returns the diploma data for a given token.
    /// @param tokenId The token to query
    function getDiploma(uint256 tokenId) external view returns (Diploma memory) {
        require(_ownerOf(tokenId) != address(0), "SoulboundDiploma: token does not exist");
        return _diplomas[tokenId];
    }

    /// @notice Returns all token IDs held by an address.
    /// @param holder The address to query
    function diplomasOf(address holder) external view returns (uint256[] memory) {
        return _holderTokens[holder];
    }

    /// @notice Returns the total number of diplomas issued.
    function totalIssued() external view returns (uint256) {
        return _nextTokenId;
    }

    /// @inheritdoc ERC721
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "SoulboundDiploma: token does not exist");
        return _diplomas[tokenId].metadataURI;
    }

    // ── Soulbound: disable all transfers ────────────────────────────────────

    function transferFrom(address, address, uint256) public pure override {
        revert SoulboundTransferForbidden();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert SoulboundTransferForbidden();
    }

    function approve(address, uint256) public pure override {
        revert SoulboundTransferForbidden();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert SoulboundTransferForbidden();
    }
}
