<script setup>
defineProps({
  game: Object
})
</script>

<template>
  <article class="game-card">
    <img
      :src="game.thumb"
      :alt="game.title"
    >

    <div class="game-card-content">
      <h2>{{ game.title }}</h2>

      <p>Normale prijs: €{{ game.normalPrice }}</p>
      <p>Sale prijs: €{{ game.salePrice }}</p>
      <p>Korting: {{ Math.round(game.savings) }}%</p>

      <a
        :href="`https://www.cheapshark.com/redirect?dealID=${game.dealID}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bekijk deal
      </a>
    </div>
  </article>
</template>