
<script setup>
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import GameCard from '@/components/GameCard.vue'

// Deze refs bevatten de data en status die Vue aan de template koppelt.
const games = ref([])
const loading = ref(true)
const error = ref('')

// Bewaar de volledige API-lijst, zodat iedere filter opnieuw op alle games werkt.
let allItems = []

// De template wijzigt deze waarden via v-model; updateResults gebruikt ze als keuzes.
const search = ref('')
const maxPrice = ref('all')
const ratingFilter = ref('all')
const sorting = ref('default')
const priceCategory = ref('all')
// Favoriete game-ID's en de keuze om alleen favorieten te tonen.
const favorites = ref([])
const showFavoritesOnly = ref(false)

// Vraag de featured-games op bij n8n en zet de response klaar voor weergave.
function loadGames() {
  // Toon de laadstatus en wis een eventuele fout van een vorige aanvraag.
  loading.value = true
  error.value = ''

  $.ajax({
    // De GET-aanvraag start de lokale n8n-webhook voor de featured-games.
    url: 'http://localhost:5678/webhook/games-featured',
    method: 'GET',
    dataType: 'json',

    success: function(data) {
      console.log('API response:', data)

      // Ondersteun zowel een directe lijst als een object met een games-lijst.
      // Een onverwachte response wordt als fout getoond in plaats van als lege lijst.
      if (Array.isArray(data)) {
        allItems = data
      } else if (Array.isArray(data.games)) {
        allItems = data.games
      } else {
        error.value = 'De API heeft geen geldige lijst met games teruggestuurd.'
        loading.value = false
        return
      }

      // Werk de zichtbare lijst bij met de huidige zoek- en filterinstellingen.
      updateResults()

      // Geef de template toestemming om de resultaten of de lege melding te tonen.
      loading.value = false
    },

    error: function(xhr, status, message) {
      console.error('API error:', status, message)

      // De foutmelding wordt in de template getoond; de console bevat de technische details.
      error.value = 'Er ging iets mis bij het ophalen van de games.'
      loading.value = false
    }
    
  })
}


// Maak de lijst voor de pagina opnieuw op basis van de opgehaalde data en huidige keuzes.
function updateResults() {
  // Filter een kopie, zodat sorteren de originele API-volgorde niet blijvend aanpast.
  let items = [...allItems]

  // Zoek hoofdletterongevoelig naar de ingevoerde tekst in de gametitel.
  const searchTerm = search.value.toLowerCase().trim()

  if (searchTerm !== '') {
    items = items.filter(game =>
      String(game.title || '')
        .toLowerCase()
        .includes(searchTerm)
    )
  }

  // Beperk de lijst tot games die niet duurder zijn dan het gekozen maximum.
  if (maxPrice.value !== 'all') {
    const priceLimit = Number(maxPrice.value)

    items = items.filter(game =>
      Number(game.Price) <= priceLimit
    )
  }

  // Vergelijk de rating met de gekozen Steam-rating.
  if (ratingFilter.value !== 'all') {
    items = items.filter(game =>
      game.steamRatingText === ratingFilter.value
    )
  }

  // Behoud alleen de gekozen prijscategorie, tenzij alle categorieën zijn geselecteerd.
if (priceCategory.value !== 'all') {
  items = items.filter(game =>
    game.priceCategory === priceCategory.value
  )
}
// Wanneer dit vinkje aanstaat, blijven alleen games met een favoriet-ID over.
if (showFavoritesOnly.value) {
  items = items.filter(game =>
    favorites.value.includes(game.dealID)
  )
}

  // Sorteer de gefilterde lijst; standaard blijft de volgorde van de API behouden.
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

  // Deze ref voedt de teller, de lege melding en de kaarten in de template.
  games.value = items
}
// Voeg een ID toe aan favorieten of verwijder het als het al favoriet is.
function toggleFavorite(id) {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter(
      favoriteId => favoriteId !== id
    )
  } else {
    favorites.value.push(id)
  }

  updateResults()
}
// Herstel alle zoek- en filterkeuzes en bereken daarna de volledige resultatenlijst opnieuw.
function resetFilters() {
  search.value = ''
  maxPrice.value = 'all'
  ratingFilter.value = 'all'
  priceCategory.value = 'all'
  sorting.value = 'default'

  updateResults()
}

// Start de eerste aanvraag zodra Vue deze pagina heeft gemonteerd.
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
        <!-- Filter prijscategorie -->
        <div class="filter-group">
          <label for="priceCategory">Prijscategorie</label>

          <select
            id="priceCategory"
            v-model="priceCategory"
            @change="updateResults"
          >
            <option value="all">Alle categorieën</option>
            <option value="Budget">Budget</option>
            <option value="Expensive">Expensive</option>
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
        <!-- Alleen favorieten weergeven -->
        <div class="filter-group favorites-filter">
          <label for="favoritesOnly" class="favorites-label">
            <input
              id="favoritesOnly"
              type="checkbox"
              v-model="showFavoritesOnly"
              @change="updateResults"
            />
            <span>★ Alleen favorieten</span>
          </label>
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

      <!-- Maak voor elke zichtbare game een kaart en geef favorietstatus en events mee. -->
      <div v-else class="games-grid">

        <GameCard
          v-for="(game, index) in games"
          :key="game.dealID || game.id || index"
          :game="game"
          :is-favorite="favorites.includes(game.dealID)"
          :show-favorite="true"
          @toggle-favorite="toggleFavorite"
        />

      </div>

    </section>

    <!-- Haal de games opnieuw op; tijdens het laden is de knop uitgeschakeld. -->
    <button
      type="button"
      class="refresh-button"
      @click="loadGames"
      :disabled="loading"
    >
      {{ loading ? 'Laden...' : 'Vernieuwen' }}
    </button>
    <!-- Zet zoekterm, filters en sortering terug naar hun beginwaarden. -->
    <button
      type="button"
      class="reset-button"
      @click="resetFilters"
    >
      Reset filters
    </button>

  </main>
</template>
