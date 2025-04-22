<script setup lang="ts"></script>

<template>
  <v-container fluid>
    <v-sheet
      rounded
      class="mx-auto pt-4 pb-4"
      width="50%"
      max-width="400px"
      border
    >
      <v-row>
        <v-col cols="12" align="center"> My Application </v-col>
      </v-row>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-row class="text-center text-red"> エラー発生 </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <router-link to="/">ログインに戻る</router-link>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
<style scoped></style>
