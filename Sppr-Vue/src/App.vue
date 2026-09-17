```vue
<script setup>
import Header from './components/Header.vue'
import Counter from './components/Counter.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">
    <Header />

    <main class="counters">
      <h3> Counter 1 </h3>
        <Counter />
      <h3> Counter 2 </h3>
        <Counter />
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
  margin-bottom:20px;
}
</style>
