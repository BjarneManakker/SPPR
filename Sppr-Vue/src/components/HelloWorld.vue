<script setup>
import { ref } from 'vue'

defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const getal = ref(0)

function plusEen() {
  getal.value++
}

function minEen() {
  getal.value--
}
</script>

<template>
  <div class="toevoeging">
    <h1>Eerste les in Vue.js</h1>
    <h2>Getal: {{ getal }}</h2>

    <button @click="plusEen">+1</button>
    <button @click="minEen">-1</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.toevoeging {
  margin-top: 20px;
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

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>