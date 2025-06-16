<script setup lang="ts">
// import ''
</script>

<template>
  <a-flex class="container" justify="center" style="height: 100vh; padding: 32px">
    <router-view/>
  </a-flex>
</template>

<style scoped>
.container {
  background-image: url('../assets/identitybg.png');
  background-size: 100% 100%;
}
</style>