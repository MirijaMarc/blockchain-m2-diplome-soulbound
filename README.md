# Soulbound Diploma — EIP-5114

> Non-transferable NFT representing academic diplomas on Ethereum Sepolia.
> M2 Blockchain Mini-Project — IT University Madagascar 2025/2026

## Overview

A **Soulbound Token (SBT)** is a non-transferable NFT permanently bound to a wallet.
This project implements an academic diploma registry where:

- The **university** (contract owner) mints diplomas to graduate wallets.
- Diplomas are **non-transferable** — approve, setApprovalForAll, and transferFrom all revert.
- Anyone can **verify** diplomas for any wallet address.

**Contract address (Sepolia):** _To be filled after deployment_
**Demo:** _To be filled_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity 0.8.28, OpenZeppelin 5, EIP-5114 pattern |
| Dev tooling | Hardhat 2, ethers.js v6 |
| Frontend | Vue 3 + Vite, ethers.js v6 |
| Network | Ethereum Sepolia testnet |

---

## Project Structure

```
blockchain-m2-diplome-soulbound/
├── contracts/
│   └── SoulboundDiploma.sol    # Main smart contract
├── test/
│   └── SoulboundDiploma.test.js
├── scripts/
│   └── deploy.js
├── front/                      # Vue 3 DApp
│   ├── src/
│   │   ├── App.vue
│   │   ├── components/
│   │   │   ├── WalletBar.vue
│   │   │   ├── IssueForm.vue
│   │   │   ├── DiplomaGallery.vue
│   │   │   └── DiplomaCard.vue
│   │   ├── composables/
│   │   │   ├── useWallet.js
│   │   │   └── useContract.js
│   │   └── abi/
│   │       └── SoulboundDiploma.json
│   └── package.json
├── screenshots/
├── hardhat.config.js
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Sepolia ETH (from a faucet)

### 1 — Install dependencies

```bash
# Smart contract tooling
npm install

# Frontend
cd front && npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
# Edit .env with your PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY
```

### 3 — Compile & test the contract

```bash
npm run compile
npm run test:contract
```

### 4 — Deploy to Sepolia

```bash
npm run deploy:sepolia
# Copy the deployed address into .env → VITE_CONTRACT_ADDRESS
```

### 5 — Run the frontend

```bash
npm run front:dev
# open http://localhost:5173
```

---

## Contract Features

| Function | Access | Description |
|---|---|---|
| `issueDiploma(...)` | Owner only | Mint a soulbound diploma NFT |
| `getDiploma(tokenId)` | Public | Read diploma metadata |
| `diplomasOf(address)` | Public | List all diplomas for a holder |
| `totalIssued()` | Public | Total number of diplomas minted |
| `transferFrom / approve / ...` | Disabled | Soulbound — always reverts |

---

## Running Tests

Run each test suite independently to avoid blocking:

```bash
# All tests
npx hardhat test test/SoulboundDiploma.test.js

# Specific describe block
npx hardhat test test/SoulboundDiploma.test.js --grep "Soulbound transfers"
```

---

## Screenshots

_Add screenshots to `screenshots/` after deployment._

---

## License

MIT
# blockchain-m2-diplome-soulbound
