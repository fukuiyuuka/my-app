<script setup lang="ts">
import { ref } from "vue";
import { logout } from "../plugins/common";
import { useLogoutStore } from "../plugins/pinia";

const userName = ref("");

const userString = localStorage.getItem("user");
if (userString) {
  const user = JSON.parse(userString);
  userName.value = user.name;
}

const logoutStore = useLogoutStore();
async function clickLogout() {
  try {
    const ok = await logoutStore.requestLogout();
    if (!ok) {
      if (!confirm("データ保存に失敗しました。ログアウトしますか？")) return;
    }
    logout();
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
</script>

<template>
  <v-container fluid>
    <v-navigation-drawer :width="200">
      <v-list-item class="ma-1">
        <div class="pa-2">
          <v-btn
            variant="outlined"
            size="small"
            rounded="lg"
            @click="clickLogout"
            class="mt-2"
          >
            ログアウト
            <v-tooltip activator="parent" location="top"
              >ユーザ名：{{ userName }}</v-tooltip
            ></v-btn
          >
        </div>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Todo" to="/home/todo"></v-list-item>
    </v-navigation-drawer>
    <router-view />
  </v-container>
</template>
<style scoped></style>
