<script setup>
import { ref } from 'vue'
import Counter from '../components/Counter.vue'

const melding = ref('')

function toonMelding(naam) {
  melding.value = naam + ' is favoriet!'
}
</script>

<template>
  <main class="page counters-page">
    <section class="page-header">
      <h1>Mijn Counters</h1>

      <p>
        Probeer de verschillende counters uit en voeg een counter toe
        aan je favorieten.
      </p>
    </section>

    <section class="counters">
      <article class="counter-card">
        <h2>Counter 1</h2>
        <Counter
          naam="Eerste counter"
          @favorite="toonMelding"
        />
      </article>

      <article class="counter-card">
        <h2>Counter 2</h2>
        <Counter
          naam="Tweede counter"
          @favorite="toonMelding"
        />
      </article>

      <article class="counter-card">
        <h2>Counter 3</h2>
        <Counter
          naam="Derde counter"
          @favorite="toonMelding"
        />
      </article>
    </section>

    <p v-if="melding" class="melding">
      {{ melding }}
    </p>
  </main>
</template>