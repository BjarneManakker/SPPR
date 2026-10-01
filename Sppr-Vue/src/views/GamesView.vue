<script setup>
import { ref, onMounted } from 'vue'
import GameCard from '../components/GameCard.vue'

const games = ref([])
const loading = ref(true)
const error = ref('')

async function getGames() {
  try {
    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/deals?sortBy=Deal%20Rating&pageSize=10'
    )

    if (!response.ok) {
      throw new Error('Er ging iets mis bij het ophalen van de games.')
    }

    games.value = await response.json()
  } catch (err) {
    error.value = 'De games konden niet worden opgehaald.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getGames()
})
</script>

<template>
  <main>
    <div class="page-header"><h1>Games</h1></div>

    <p v-if="loading">
      Games worden geladen...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <div v-else class="games">
      <GameCard
        v-for="game in games"
        :key="game.dealID"
        :game="game"
      />
    </div>
  </main>
</template>