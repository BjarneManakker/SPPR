
<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import GameCard from '@/components/GameCard.vue'

const games = ref([])
const loading = ref(true)
const error = ref('')

// Originele resultaten vanuit de API bewaren
let allItems = []

// Zoek- en filterinstellingen
const search = ref('')
const maxPrice = ref('all')
const ratingFilter = ref('all')
const sorting = ref('default')

// Games ophalen vanuit n8n
function loadGames() {
  loading.value = true
  error.value = ''

  $.ajax({
    url: 'http://localhost:5678/webhook/games',
    method: 'GET',
    dataType: 'json',

    success: function(data) {
      console.log('API response:', data)

      // Controleren waar de games in de response staan
      if (Array.isArray(data)) {
        allItems = data
      } else if (Array.isArray(data.games)) {
        allItems = data.games
      } else {
        error.value = 'De API heeft geen geldige lijst met games teruggestuurd.'
        loading.value = false
        return
      }

      // Alle resultaten verwerken
      updateResults()

      loading.value = false
    },

    error: function(xhr, status, message) {
      console.error('API error:', status, message)

      error.value = 'Er ging iets mis bij het ophalen van de games.'
      loading.value = false
    }
  })
}

// Zoeken, filteren en sorteren
function updateResults() {
  // Kopie maken zodat de originele resultaten behouden blijven
  let items = [...allItems]

  // 1. Zoeken op gametitel
  const searchTerm = search.value.toLowerCase().trim()

  if (searchTerm !== '') {
    items = items.filter(game =>
      String(game.title || '')
        .toLowerCase()
        .includes(searchTerm)
    )
  }

  // 2. Filteren op maximale prijs
  if (maxPrice.value !== 'all') {
    const priceLimit = Number(maxPrice.value)

    items = items.filter(game =>
      Number(game.Price) <= priceLimit
    )
  }

  // 3. Filteren op Steam-rating
  if (ratingFilter.value !== 'all') {
    items = items.filter(game =>
      game.steamRatingText === ratingFilter.value
    )
  }

  // 4. Sorteren
  if (sorting.value === 'price-low') {
    items.sort((a, b) =>
      Number(a.Price) - Number(b.Price)
    )
  } else if (sorting.value === 'price-high') {
    items.sort((a, b) =>
      Number(b.Price) - Number(a.Price)
    )
  } else if (sorting.value === 'title') {
    items.sort((a, b) =>
      String(a.title || '').localeCompare(String(b.title || ''))
    )
  }

  // Resultaten bijwerken
  games.value = items
}

// Games ophalen zodra de pagina geopend wordt
onMounted(() => {
  loadGames()
})
</script>

<template>
  <main class="nexus-page">

    <h1>Project Nexus</h1>

    <p class="nexus-description">
      Games opgehaald vanuit mijn eigen n8n API.
    </p>

    <section class="nexus-section">

      <h2>API Games ({{ games.length }})</h2>

      <!-- Zoekbalk -->
      <div class="game-controls">

        <div class="filter-group">
          <label for="search">Zoeken op game</label>

          <input
            id="search"
            type="text"
            v-model="search"
            @input="updateResults"
            placeholder="Zoek een game..."
          />
        </div>

        <!-- Filter maximale prijs -->
        <div class="filter-group">
          <label for="maxPrice">Maximale prijs</label>

          <select
            id="maxPrice"
            v-model="maxPrice"
            @change="updateResults"
          >
            <option value="all">Alle prijzen</option>
            <option value="5">Maximaal €5</option>
            <option value="10">Maximaal €10</option>
            <option value="20">Maximaal €20</option>
            <option value="30">Maximaal €30</option>
          </select>
        </div>

        <!-- Filter Steam-rating -->
        <div class="filter-group">
          <label for="ratingFilter">Steam-rating</label>

          <select
            id="ratingFilter"
            v-model="ratingFilter"
            @change="updateResults"
          >
            <option value="all">Alle ratings</option>
            <option value="Very Positive">Very Positive</option>
            <option value="Mostly Positive">Mostly Positive</option>
            <option value="Positive">Positive</option>
            <option value="Mixed">Mixed</option>
            <option value="Mostly Negative">Mostly Negative</option>
            <option value="Negative">Negative</option>
          </select>
        </div>

        <!-- Sorteren -->
        <div class="filter-group">
          <label for="sorting">Sorteren</label>

          <select
            id="sorting"
            v-model="sorting"
            @change="updateResults"
          >
            <option value="default">Standaard</option>
            <option value="price-low">Prijs: laag naar hoog</option>
            <option value="price-high">Prijs: hoog naar laag</option>
            <option value="title">Naam: A-Z</option>
          </select>
        </div>

      </div>

      <!-- Resultatenteller -->
      <p class="result-count">
        {{ games.length }} resultaten gevonden
      </p>

      <!-- Loading state -->
      <p v-if="loading" class="loading-message">
        Games laden...
      </p>

      <!-- Error state -->
      <p v-else-if="error" class="error-message" role="alert">
        {{ error }}
      </p>

      <!-- Geen resultaten -->
      <p v-else-if="games.length === 0" class="empty-message">
        Geen games gevonden. Probeer een andere zoekterm of pas je filters aan.
      </p>

      <!-- Games dynamisch weergeven -->
      <div v-else class="games-grid">

        <GameCard
          v-for="(game, index) in games"
          :key="game.dealID || game.id || index"
          :game="game"
        />

      </div>

    </section>

    <!-- Vernieuwen -->
    <button
      type="button"
      class="refresh-button"
      @click="loadGames"
      :disabled="loading"
    >
      {{ loading ? 'Laden...' : 'Vernieuwen' }}
    </button>

  </main>
</template>
