
<script setup>
defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="game-card">
    <img
      v-if="game.image"
      :src="game.image"
      :alt="game.title"
      class="game-image"
    />

    <div v-else class="image-placeholder">
      Geen afbeelding beschikbaar
    </div>

    <div class="game-content">
      <h3>{{ game.title }}</h3>

      <p v-if="game.steamRatingText" class="rating">
        {{ game.steamRatingText }}
      </p>

      <div class="prices">
        <span class="current-price">
          €{{ Number(game.Price).toFixed(2) }}
        </span>

        <span
          v-if="Number(game.originalPrice) > Number(game.Price)"
          class="original-price"
        >
          €{{ Number(game.originalPrice).toFixed(2) }}
        </span>
      </div>

      <p v-if="Number(game.discount) > 0" class="discount">
        {{ game.discount }}% korting
      </p>
    </div>
  </div>
</template>
