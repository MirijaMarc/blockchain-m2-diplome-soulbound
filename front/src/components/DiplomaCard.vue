<template>
  <article class="diploma-card">
    <div class="diploma-header">
      <span class="diploma-icon">🎓</span>
      <span class="token-id">#{{ diploma.tokenId }}</span>
    </div>
    <div class="diploma-body">
      <h3 class="student-name">{{ diploma.studentName }}</h3>
      <p class="degree">{{ diploma.degree }}</p>
      <p v-if="diploma.major" class="major">{{ diploma.major }}</p>
    </div>
    <div class="diploma-footer">
      <span class="year">Class of {{ diploma.graduationYear }}</span>
      <span class="badge-soulbound">Soulbound</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  diploma: { type: Object, required: true },
});
</script>

<style scoped>
.diploma-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
}

.diploma-card:hover { border-color: var(--color-primary); transform: translateY(-2px); }

.diploma-header { display: flex; justify-content: space-between; align-items: center; }
.diploma-icon { font-size: 1.6rem; }
.token-id { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; }

.diploma-body { flex: 1; }
.student-name { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
.degree { font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.4; }
.major { font-size: 0.8rem; color: var(--color-primary); margin-top: 4px; }

.diploma-footer { display: flex; justify-content: space-between; align-items: center; }
.year { font-size: 0.8rem; color: var(--color-text-muted); }

.badge-soulbound {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(108, 99, 255, 0.2);
  color: var(--color-primary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
