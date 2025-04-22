<script setup lang="ts">
import { ref } from "vue";
import { api, logout } from "./common";
import { useCommonData, useLogoutStore } from "../store/pinia";

const commonData = useCommonData();
const logoutStore = useLogoutStore();

const userInfo = ref(`ユーザ: ${commonData.user?.name}`);

async function clickLogout() {
  try {
    const ok = await logoutStore.requestLogout();
    if (!ok) {
      if (!confirm("データ保存に失敗しました。ログアウトしますか？")) return;
    }
    const res = await api.post("/logout");
    if (res.status === 200) {
      //ログアウト完了
      logout();
    } else {
      throw new Error("ログアウト失敗");
    }
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
        <div class="pa-2">{{ userInfo }}</div>
        <v-btn
          variant="outlined"
          size="small"
          rounded="lg"
          @click="clickLogout"
        >
          ログアウト
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Todo" to="/home/todo"></v-list-item>
    </v-navigation-drawer>
    <router-view />
  </v-container>
</template>
<style scoped></style>
