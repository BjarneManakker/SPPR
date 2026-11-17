
<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import GameCard from '@/components/GameCard.vue'

// Deze refs bevatten de gegevens en status die de template op de pagina toont.
// Als een ref verandert, werkt Vue de gekoppelde HTML automatisch bij.
const games = ref([])
const loading = ref(true)
const error = ref('')

// Bewaar de volledige API-lijst apart, zodat filters steeds op alle games werken.
let allItems = []

// De v-models in de template lezen en wijzigen deze zoek- en filterwaarden.
const search = ref('')
const maxPrice = ref('all')
const ratingFilter = ref('all')
const sorting = ref('default')

// Haal de games op uit de n8n-webhook en verwerk de response voor de pagina.
function loadGames() {
  // Toon tijdens het verzoek de laadstatus en wis een eventuele oude foutmelding.
  loading.value = true
  error.value = ''

  $.ajax({
    // De GET-aanvraag vraagt de lijst met games op bij de lokale n8n-workflow.
    url: 'http://localhost:5678/webhook/games',
    method: 'GET',
    dataType: 'json',

    success: function(data) {
      console.log('API response:', data)

      // De webhook kan direct een lijst teruggeven of een object met een games-lijst.
      // Bewaar alleen een geldige lijst; toon anders een duidelijke fout op de pagina.
      if (Array.isArray(data)) {
        allItems = data
      } else if (Array.isArray(data.games)) {
        allItems = data.games
      } else {
        error.value = 'De API heeft geen geldige lijst met games teruggestuurd.'
        loading.value = false
        return
      }

      // Pas de huidige zoek-, filter- en sorteerkeuzes toe op de opgehaalde lijst.
      updateResults()

      // Het verzoek is klaar; Vue kan nu de resultaten of een lege melding tonen.
      loading.value = false
    },

    error: function(xhr, status, message) {
      console.error('API error:', status, message)

      // Deze tekst wordt in de template getoond als het ophalen niet lukt.
      error.value = 'Er ging iets mis bij het ophalen van de games.'
      loading.value = false
    }
  })
}

// Bouw de zichtbare lijst opnieuw op wanneer ophalen of een bedieningselement verandert.
function updateResults() {
  // Werk op een kopie: filteren en sorteren mogen de oorspronkelijke API-lijst niet wijzigen.
  let items = [...allItems]

  // Zoek zonder verschil tussen hoofdletters en kleine letters in de gametitel.
  const searchTerm = search.value.toLowerCase().trim()

  if (searchTerm !== '') {
    items = items.filter(game =>
      String(game.title || '')
        .toLowerCase()
        .includes(searchTerm)
    )
  }

  // Houd games over waarvan de prijs niet hoger is dan het gekozen maximum.
  if (maxPrice.value !== 'all') {
    const priceLimit = Number(maxPrice.value)

    items = items.filter(game =>
      Number(game.Price) <= priceLimit
    )
  }

  // Behoud alleen games met de gekozen Steam-rating.
  if (ratingFilter.value !== 'all') {
    items = items.filter(game =>
      game.steamRatingText === ratingFilter.value
    )
  }

  // Sorteer de overgebleven games op prijs of titel; 'default' behoudt de API-volgorde.
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

  // De template gebruikt deze ref voor de teller, lege melding en gamekaarten.
  games.value = items
}

// Start het ophalen zodra Vue deze pagina op het scherm heeft geplaatst.
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

      <!-- Geef voor elke zichtbare game een GameCard door; de kaart toont de gamegegevens. -->
      <div v-else class="games-grid">

        <GameCard
          v-for="(game, index) in games"
          :key="game.dealID || game.id || index"
          :game="game"
        />

      </div>

    </section>

    <!-- Vraag de actuele lijst opnieuw op; voorkom dubbel klikken tijdens het laden. -->
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
