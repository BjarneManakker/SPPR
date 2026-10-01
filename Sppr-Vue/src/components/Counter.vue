<script setup>
import { ref } from 'vue'

const props = defineProps({
  naam: String,
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
  <div class="counter">
    <h3>{{ props.naam }}</h3>

    <p class="counter-number">
      Getal: {{ getal }}
    </p>

    <div class="counter-buttons">
      <button @click="plusEen">+1</button>

      <button @click="minEen">-1</button>

      <button @click="favoriet">
        Favoriet
      </button>
    </div>
  </div>
</template>