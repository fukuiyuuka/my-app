<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  document.title = "My App";
});
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped></style>
