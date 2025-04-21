<script setup lang="ts">
import { ref } from "vue";
import * as t from "@yukafukui/shared-type";
import { api } from "./common";

const userName = ref("");
const passWord = ref("");
const errMsg = ref("");
const infoMsg = ref("");

//ユーザ登録処理
async function clickRegister() {
  errMsg.value = "";
  infoMsg.value = "";

  try {
    //サーバ送信
    const reqBody: t.PostUserReq = {
      name: userName.value,
      password: passWord.value,
    };
    const res = await api.post("/user", reqBody);

    //レスポンス処理
    const resBody: t.PostUserRes = res.data;
    if (res.status === 200 || resBody.code === 0) {
      infoMsg.value = "登録完了";
    } else {
      //HTTPエラーorAPIエラー
      if (resBody?.code === 2) {
        throw new Error("使用済みユーザ名。登録失敗。");
      } else {
        throw new Error("予期せぬエラー。登録失敗。");
      }
    }
  } catch (e: any) {
    console.error(e);
    errMsg.value = e.message || "予期せぬエラー。登録失敗。";
  }
}
</script>

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
      <v-row>
        <v-col cols="12" align="center">
          <v-text-field
            label="ユーザ名"
            variant="outlined"
            width="80%"
            hide-details
            density="compact"
            v-model="userName"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <v-text-field
            label="パスワード"
            variant="outlined"
            width="80%"
            hide-details
            density="compact"
            v-model="passWord"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <v-btn variant="outlined" @click="clickRegister">登録</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="!!errMsg">
        <v-col cols="12" align="center">
          <div class="text-red">{{ errMsg }}</div>
        </v-col>
      </v-row>
      <v-row v-if="!!infoMsg">
        <v-col cols="12" align="center">
          {{ infoMsg }}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <router-link to="/">ログインに戻る</router-link>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
<style scoped></style>
