<template>
  <header class="wallet-bar">
    <div class="brand">
      <span class="brand-icon">🎓</span>
      <span class="brand-name">Soulbound Diploma</span>
    </div>

    <div class="wallet-section">
      <span v-if="chainId && chainId !== 11155111" class="badge badge--warn">
        Wrong network (need Sepolia)
      </span>
      <span v-if="isConnected" class="badge badge--success">{{ shortAddress }}</span>
      <button v-if="!isConnected" class="btn btn--primary" @click="connect">
        Connect MetaMask
      </button>
      <button v-else class="btn btn--ghost" @click="disconnect">Disconnect</button>
    </div>
  </header>
</template>

<script setup>
import { useWallet } from "../composables/useWallet.js";

const { isConnected, shortAddress, chainId, connect, disconnect } = useWallet();
</script>

<style scoped>
.wallet-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.brand-icon { font-size: 1.4rem; }

.wallet-section { display: flex; align-items: center; gap: 12px; }

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--success { background: rgba(34, 197, 94, 0.15); color: var(--color-success); }
.badge--warn { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.btn {
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
}

.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover { background: var(--color-primary-hover); }
.btn--ghost { background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn--ghost:hover { color: var(--color-text); }
</style>
