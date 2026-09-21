<script setup>
import { ref } from 'vue'

const props = defineProps({
  naam: String
})

const emit = defineEmits(['favorite'])

const getal = ref(0)

function plusEen() {
  getal.value++
}

function minEen() {
  if (getal.value > 0) {
    getal.value--
  }
}

function favoriet() {
  emit('favorite', props.naam)
}
</script>

<template>
  <div class="toevoeging">
    <h2>{{ props.naam }}</h2>

    <h3>Getal: {{ getal }}</h3>

    <button @click="plusEen">+1</button>
    <button @click="minEen">-1</button>
    <button @click="favoriet">Favoriet</button>
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

.toevoeging h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.toevoeging button {
  margin-right: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>