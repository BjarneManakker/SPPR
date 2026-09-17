<script setup>
import { ref } from 'vue'

const getal = ref(0)

function plusEen() {
  getal.value++
}

function minEen() {
  if (getal.value > 0) {
    getal.value--
  }
}
</script>

<template>
  <div class="toevoeging">
    <h2>Getal: {{ getal }}</h2>

    <button @click="plusEen">+1</button>
    <button @click="minEen">-1</button>
  </div>
</template>

<style scoped>
.toevoeging {
  margin-top: 20px;
  margin-bottom: 30px;
}

.toevoeging h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.toevoeging button {
  margin-right: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>