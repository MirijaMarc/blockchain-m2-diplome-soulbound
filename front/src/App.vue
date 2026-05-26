<template>
  <div class="app">
    <WalletBar />

    <main class="main">
      <div v-if="!isConnected" class="hero">
        <div class="hero-icon">🎓</div>
        <h1 class="hero-title">Soulbound Diploma</h1>
        <p class="hero-sub">
          Non-transferable academic credentials on Ethereum Sepolia.<br />
          Powered by EIP-5114 and OpenZeppelin.
        </p>
        <button class="btn btn--primary btn--lg" @click="connect">Connect MetaMask to Get Started</button>
        <p v-if="walletError" class="error-hint">{{ walletError }}</p>
      </div>

      <template v-else>
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">Diplomas Issued</span>
          </div>
          <div class="stat">
            <span class="stat-value" :class="isOwner ? 'stat--owner' : 'stat--student'">
              {{ isOwner ? "University Admin" : "Graduate" }}
            </span>
            <span class="stat-label">Your Role</span>
          </div>
        </div>

        <p v-if="configError" class="config-error">{{ configError }}</p>

        <div class="layout">
          <IssueForm v-if="isOwner" />
          <p v-else-if="contractOwner" class="role-hint">
            Only the university wallet
            <code>{{ shortOwner }}</code>
            can issue diplomas. Switch account in MetaMask if you are the admin.
          </p>
          <DiplomaGallery />
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import WalletBar from "./components/WalletBar.vue";
import IssueForm from "./components/IssueForm.vue";
import DiplomaGallery from "./components/DiplomaGallery.vue";
import { useWallet } from "./composables/useWallet.js";
import { useContract } from "./composables/useContract.js";

const { isConnected, address, provider, error: walletError, connect } = useWallet();
const { totalIssued, getOwner } = useContract();

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

const totalCount = ref(0);
const isOwner = ref(false);
const contractOwner = ref("");
const configError = ref("");

const shortOwner = computed(() => {
  const o = contractOwner.value;
  return o ? `${o.slice(0, 6)}…${o.slice(-4)}` : "";
});

async function loadStats() {
  configError.value = "";
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    configError.value =
      "Contract address missing. Set VITE_CONTRACT_ADDRESS in .env and restart: npm run front:dev";
    return;
  }
  if (!address.value) return;

  try {
    const [count, owner] = await Promise.all([totalIssued(), getOwner()]);
    totalCount.value = count;
    contractOwner.value = owner;
    isOwner.value = owner.toLowerCase() === address.value.toLowerCase();
  } catch (err) {
    configError.value = err.message || "Could not read contract on Sepolia.";
  }
}

watch([address, provider], () => {
  if (address.value && provider.value) loadStats();
});
</script>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }

.main { flex: 1; max-width: 960px; width: 100%; margin: 0 auto; padding: 32px 24px; }

.hero { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.hero-icon { font-size: 4rem; }
.hero-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; }
.hero-sub { color: var(--color-text-muted); max-width: 480px; line-height: 1.7; }
.error-hint { color: var(--color-danger); font-size: 0.875rem; }

.stats-bar { display: flex; gap: 24px; margin-bottom: 28px; }
.stat { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 16px 24px; flex: 1; }
.stat-value { font-size: 1.5rem; font-weight: 800; display: block; }
.stat--owner { color: var(--color-primary); }
.stat--student { color: var(--color-success); }
.stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); }

.layout { display: flex; flex-direction: column; gap: 24px; }

.btn { padding: 12px 28px; border-radius: var(--radius-sm); font-size: 0.95rem; font-weight: 600; }
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover { background: var(--color-primary-hover); }
.btn--lg { padding: 14px 36px; font-size: 1rem; }

.config-error {
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: var(--radius-sm);
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.875rem;
}

.role-hint {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.role-hint code {
  color: var(--color-primary);
  font-family: monospace;
}
</style>
