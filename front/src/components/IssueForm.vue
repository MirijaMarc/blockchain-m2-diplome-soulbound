<template>
  <section class="card">
    <h2 class="card-title">Issue a Diploma</h2>

    <form class="form" @submit.prevent="submit">
      <div class="form-row">
        <div class="field">
          <label>Recipient Address *</label>
          <input v-model="form.recipient" placeholder="0x…" required />
        </div>
        <div class="field">
          <label>Student Name *</label>
          <input v-model="form.studentName" placeholder="Alice Dupont" required />
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Degree *</label>
          <input v-model="form.degree" placeholder="Master of Science in Computer Engineering" required />
        </div>
        <div class="field">
          <label>Major</label>
          <input v-model="form.major" placeholder="Blockchain & Distributed Systems" />
        </div>
      </div>

      <div class="form-row">
        <div class="field field--sm">
          <label>Graduation Year *</label>
          <input v-model.number="form.graduationYear" type="number" min="2000" max="2100" required />
        </div>
        <div class="field">
          <label>Metadata URI (IPFS)</label>
          <input v-model="form.metadataURI" placeholder="ipfs://Qm…" />
        </div>
      </div>

      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <div v-if="txHash" class="alert alert--success">
        Diploma issued!
        <a :href="`https://sepolia.etherscan.io/tx/${txHash}`" target="_blank">View on Etherscan ↗</a>
      </div>

      <button type="submit" class="btn btn--primary btn--full" :disabled="loading">
        <span v-if="loading">Minting…</span>
        <span v-else>Issue Diploma</span>
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { useContract } from "../composables/useContract.js";

const { loading, txHash, error, issueDiploma } = useContract();

const form = reactive({
  recipient: "",
  studentName: "",
  degree: "",
  major: "",
  graduationYear: new Date().getFullYear(),
  metadataURI: "",
});

async function submit() {
  await issueDiploma(form);
}
</script>

<style scoped>
.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 28px; }
.card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }

.form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

.field { display: flex; flex-direction: column; gap: 6px; }
.field--sm { max-width: 180px; }

label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

input {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}
input:focus { outline: none; border-color: var(--color-primary); }

.alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.875rem; }
.alert--error { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.3); }
.alert--success { background: rgba(34, 197, 94, 0.1); color: var(--color-success); border: 1px solid rgba(34, 197, 94, 0.3); }
.alert--success a { color: var(--color-success); text-decoration: underline; }

.btn { padding: 12px 24px; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600; }
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--full { width: 100%; }
</style>
