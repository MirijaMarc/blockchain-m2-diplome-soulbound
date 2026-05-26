# Architecture — Soulbound Diploma

## Project Overview

Non-transferable NFT (EIP-5114 pattern) representing academic diplomas.
Built for the M2 Blockchain Mini-Project at IT University Madagascar.

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Smart contract | Solidity | 0.8.28 |
| Standards | ERC-721 (OpenZeppelin 5), EIP-5114 soulbound | - |
| Dev tooling | Hardhat | 2.x |
| Contract library | ethers.js | 6.x |
| Frontend framework | Vue 3 + Composition API | 3.5.x |
| Frontend build | Vite | 6.x |
| Network | Ethereum Sepolia testnet | - |

---

## Repository Structure

```
blockchain-m2-diplome-soulbound/
├── contracts/                   # Solidity sources
│   └── SoulboundDiploma.sol
├── test/                        # Hardhat/Mocha unit tests
│   └── SoulboundDiploma.test.js
├── scripts/                     # Deployment scripts
│   └── deploy.js
├── artifacts/                   # Compiler output (gitignored)
├── front/                       # Vue 3 DApp
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── assets/
│       │   └── main.css          # Global CSS variables & reset
│       ├── components/
│       │   ├── WalletBar.vue     # Header: MetaMask connect/disconnect
│       │   ├── IssueForm.vue     # Admin: mint diploma form
│       │   ├── DiplomaGallery.vue # Public: lookup diplomas by address
│       │   └── DiplomaCard.vue   # Display single diploma
│       ├── composables/
│       │   ├── useWallet.js      # Wallet state (address, signer, chainId)
│       │   └── useContract.js    # Contract read/write helpers
│       └── abi/
│           └── SoulboundDiploma.json  # ABI (extracted from artifacts)
├── screenshots/
├── hardhat.config.js
├── package.json                 # Root: Hardhat scripts
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── JOURNAL.md
└── README.md
```

---

## Smart Contract Design

### `SoulboundDiploma.sol`

Inherits: `ERC721`, `Ownable` (OpenZeppelin 5)

**Soulbound enforcement:** `transferFrom`, `safeTransferFrom`, `approve`, and
`setApprovalForAll` are all overridden to revert with a custom error
`SoulboundTransferForbidden`. The token can only be minted, never moved.

**Storage:**
- `mapping(uint256 => Diploma)` — on-chain diploma metadata per token
- `mapping(address => uint256[])` — reverse index: holder → token IDs
- `uint256 _nextTokenId` — sequential token ID counter

**Key functions:**

| Function | Modifier | Description |
|---|---|---|
| `issueDiploma(...)` | `onlyOwner` | Mint and record a diploma |
| `getDiploma(tokenId)` | view | Return diploma struct |
| `diplomasOf(address)` | view | Return all token IDs for a holder |
| `totalIssued()` | view | Counter of minted diplomas |
| `tokenURI(tokenId)` | view | Returns the IPFS metadata URI |

---

## Frontend Architecture

### State Management

No global store (Pinia not needed). Two singleton composables hold shared state:

- **`useWallet`** — `address`, `provider`, `signer`, `chainId`, `isConnected`
- **`useContract`** — stateless read/write helpers wrapping ethers `Contract`

### Component Hierarchy

```
App.vue
├── WalletBar.vue          (sticky header)
└── [when connected]
    ├── IssueForm.vue      (shown to owner only)
    └── DiplomaGallery.vue
        └── DiplomaCard.vue × N
```

### Role Detection

`App.vue` calls `contract.owner()` on connect and compares with `address.value`
to conditionally show the `IssueForm` (admin panel).

---

## Data Flow

```
MetaMask → useWallet → BrowserProvider / Signer
                         ↓
                    useContract → ethers.Contract(ABI, address, signer)
                         ↓
                  SoulboundDiploma.sol (on-chain)
```

---

## Environment Variables

| Variable | Used by | Description |
|---|---|---|
| `PRIVATE_KEY` | Hardhat | Deployer wallet |
| `SEPOLIA_RPC_URL` | Hardhat | RPC endpoint |
| `ETHERSCAN_API_KEY` | Hardhat verify | Contract verification |
| `VITE_CONTRACT_ADDRESS` | Frontend (Vite) | Deployed contract address |

---

## Dependencies

### Root (Hardhat)
- `hardhat` 2.x
- `@nomicfoundation/hardhat-toolbox` (hh2 tag)
- `@openzeppelin/contracts` 5.x
- `ethers` 6.x
- `dotenv`

### Frontend (`front/`)
- `vue` 3.x
- `ethers` 6.x
- `vite` 6.x
- `@vitejs/plugin-vue`
