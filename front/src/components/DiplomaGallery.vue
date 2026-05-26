<template>
  <section class="card">
    <h2 class="card-title">Verify Diplomas</h2>

    <div class="search-row">
      <input v-model="query" placeholder="Enter wallet address (0x…)" @keyup.enter="lookup" />
      <button class="btn btn--primary" :disabled="loading" @click="lookup">
        {{ loading ? "Loading…" : "Look up" }}
      </button>
    </div>

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div v-if="diplomas.length" class="grid">
      <DiplomaCard v-for="d in diplomas" :key="d.tokenId" :diploma="d" />
    </div>

    <p v-else-if="searched && !loading" class="empty">No diplomas found for this address.</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useContract } from "../composables/useContract.js";
import DiplomaCard from "./DiplomaCard.vue";

const { loading, error, diplomasOf } = useContract();

const query = ref("");
const diplomas = ref([]);
const searched = ref(false);

async function lookup() {
  if (!query.value.trim()) return;
  diplomas.value = [];
  searched.value = false;
  diplomas.value = await diplomasOf(query.value.trim());
  searched.value = true;
}
</script>

<style scoped>
.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 28px; }
.card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }

.search-row { display: flex; gap: 12px; margin-bottom: 20px; }
.search-row input {
  flex: 1;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.9rem;
}
.search-row input:focus { outline: none; border-color: var(--color-primary); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.empty { color: var(--color-text-muted); text-align: center; padding: 32px; }

.alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.875rem; background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.3); margin-bottom: 16px; }

.btn { padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; }
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
