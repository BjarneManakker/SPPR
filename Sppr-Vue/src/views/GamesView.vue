
<script setup>
import { ref, watch } from 'vue'
import GameCard from '@/components/GameCard.vue'

// Games ophalen uit de lokale browseropslag
function loadGames() {
  try {
    const savedGames = localStorage.getItem('my-games')
    return savedGames ? JSON.parse(savedGames) : []
  } catch {
    return []
  }
}

const games = ref(loadGames())
const feedback = ref('')
const editingId = ref(null)

const title = ref('')
const price = ref('')
const originalPrice = ref('')
const discount = ref(0)
const steamRatingText = ref('')
const image = ref('')

// Wijzigingen automatisch bewaren
watch(
  games,
  (newGames) => {
    localStorage.setItem('my-games', JSON.stringify(newGames))
  },
  { deep: true }
)

// Formulier leegmaken
function resetForm() {
  title.value = ''
  price.value = ''
  originalPrice.value = ''
  discount.value = 0
  steamRatingText.value = ''
  image.value = ''
  editingId.value = null
}

// Game toevoegen of wijzigen
function saveGame() {
  feedback.value = ''

  if (!title.value.trim()) {
    feedback.value = 'Vul een gamenaam in.'
    return
  }

  if (
    price.value === '' ||
    originalPrice.value === '' ||
    !Number.isFinite(Number(price.value)) ||
    !Number.isFinite(Number(originalPrice.value)) ||
    Number(price.value) < 0 ||
    Number(originalPrice.value) < 0
  ) {
    feedback.value = 'Vul geldige prijzen van 0 of hoger in.'
    return
  }

  if (
    discount.value === '' ||
    !Number.isFinite(Number(discount.value)) ||
    Number(discount.value) < 0 ||
    Number(discount.value) > 100
  ) {
    feedback.value = 'De korting moet tussen 0 en 100 liggen.'
    return
  }

  const gameData = {
    title: title.value.trim(),
    Price: Number(price.value),
    originalPrice: Number(originalPrice.value),
    discount: Number(discount.value),
    steamRatingText: steamRatingText.value.trim(),
    image: image.value.trim()
  }

  if (editingId.value !== null) {
    // UPDATE: bestaande game wijzigen
    const index = games.value.findIndex(
      game => game.id === editingId.value
    )

    if (index !== -1) {
      games.value[index] = {
        ...games.value[index],
        ...gameData
      }

      feedback.value = 'Game succesvol gewijzigd.'
    }
  } else {
    // CREATE: nieuwe game toevoegen
    games.value.unshift({
      id: crypto.randomUUID(),
      ...gameData
    })

    feedback.value = 'Game succesvol toegevoegd.'
  }

  resetForm()
}

// Bestaande game selecteren
function editGame(game) {
  editingId.value = game.id
  title.value = game.title
  price.value = game.Price
  originalPrice.value = game.originalPrice
  discount.value = game.discount
  steamRatingText.value = game.steamRatingText
  image.value = game.image

  feedback.value = ''
}

// Game verwijderen
function deleteGame(game) {
  const confirmed = window.confirm(
    `Weet je zeker dat je "${game.title}" wilt verwijderen?`
  )

  if (!confirmed) return

  games.value = games.value.filter(
    item => item.id !== game.id
  )

  if (editingId.value === game.id) {
    resetForm()
  }

  feedback.value = 'Game succesvol verwijderd.'
}
</script>

<template>
  <main class="games-page">
    <h1>Games</h1>

    <section class="form-section">
      <h2>
        {{ editingId !== null ? 'Game wijzigen' : 'Game toevoegen' }}
      </h2>

      <form @submit.prevent="saveGame">
        <label for="title">Gamenaam *</label>
        <input
          id="title"
          v-model="title"
          type="text"
          maxlength="100"
          placeholder="Bijvoorbeeld Rust"
          required
        />

        <div class="form-row">
          <div>
            <label for="price">Actuele prijs (€) *</label>
            <input
              id="price"
              v-model="price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label for="originalPrice">Originele prijs (€) *</label>
            <input
              id="originalPrice"
              v-model="originalPrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <label for="discount">Korting (%)</label>
        <input
          id="discount"
          v-model.number="discount"
          type="number"
          min="0"
          max="100"
          step="1"
        />

        <label for="rating">Steam-beoordeling</label>
        <input
          id="rating"
          v-model="steamRatingText"
          type="text"
          placeholder="Bijvoorbeeld Very Positive"
        />

        <label for="image">Afbeeldings-URL</label>
        <input
          id="image"
          v-model="image"
          type="url"
          placeholder="https://..."
        />

        <div class="form-actions">
          <button type="submit">
            {{ editingId !== null ? 'Wijzigingen opslaan' : 'Game toevoegen' }}
          </button>

          <button
            v-if="editingId !== null"
            type="button"
            class="cancel-button"
            @click="resetForm"
          >
            Annuleren
          </button>
        </div>
      </form>

      <p v-if="feedback" class="feedback" role="status">
        {{ feedback }}
      </p>
    </section>

    <section class="games-section">
      <h2>Mijn games ({{ games.length }})</h2>

      <p v-if="games.length === 0">
        Je hebt nog geen games toegevoegd.
      </p>

      <div v-else class="games-grid">
        <article
          v-for="game in games"
          :key="game.id"
          class="game-item"
        >
          <GameCard :game="game" />

          <div class="game-actions">
            <button type="button" @click="editGame(game)">
              Wijzigen
            </button>

            <button
              type="button"
              class="delete-button"
              @click="deleteGame(game)"
            >
              Verwijderen
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
