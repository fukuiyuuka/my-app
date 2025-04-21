<script setup lang="ts">
import { ref } from "vue";
import { api, logout } from "./common";
import { useCommonData, useLogoutStore } from "../store/pinia";
import Home from "./HomeContents/Todo.vue";

const HomeRef = ref<InstanceType<typeof Home> | null>(null);

const commonData = useCommonData();
const logoutStore = useLogoutStore();

const userInfo = ref(`ユーザ: ${commonData.user?.name}`);

async function clickLogout() {
  try {
    const ok = await logoutStore.requestLogout();
    if (!ok) {
      throw new Error("ログアウト準備失敗");
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
    alert(e.message || "ログアウト失敗");
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
