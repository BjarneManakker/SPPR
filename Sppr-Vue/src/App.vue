<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Counter from './components/Counter.vue'
import Footer from './components/Footer.vue'

const melding = ref('')

function toonMelding(naam) {
  melding.value = naam + ' is favoriet!'
}
</script>

<template>
  <div class="app">
    <Header />

    <main class="counters">
      <h3>Counter 1</h3>
      <Counter naam="Eerste counter" @favorite="toonMelding" />

      <h3>Counter 2</h3>
      <Counter naam="Tweede counter" @favorite="toonMelding" />

      <h3>Counter 3</h3>
      <Counter naam="Derde counter" @favorite="toonMelding" />

      <p v-if="melding" class="melding">
        {{ melding }}
      </p>
    </main>

    <Footer />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.counters {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.melding {
  margin-top: 20px;
  font-weight: bold;
}
</style>