<script setup lang="ts">
import { ref } from "vue";
import * as t from "@yukafukui/shared-type";
import router from "../plugins/router";
import { api } from "../plugins/common";

const userName = ref("");
const passWord = ref("");
const errMsg = ref("");
const infoMsg = ref("");

async function clickLogin() {
  errMsg.value = "";
  infoMsg.value = "";

  try {
    const reqBody: t.PostLoginReq = {
      name: userName.value,
      password: passWord.value,
    };
    const res = await api.post("/login", reqBody, {
      withCredentials: true,
    });

    //レスポンス処理
    const resBody: t.PostLoginRes = res.data;
    if (res.status !== 200 || resBody.code !== 0) {
      throw new Error("ログイン失敗");
    }

    if (
      resBody.data?.successLogin &&
      resBody.data?.user &&
      resBody.data?.token
    ) {
      //ログイン完了

      //認証情報をlocakStorageに保存
      localStorage.setItem("token", resBody.data.token);
      localStorage.setItem("user", JSON.stringify(resBody.data.user));

      router.push("/home/todo");
    } else {
      //ログイン失敗
      throw new Error("ユーザが存在しないか、パスワードが不一致です");
    }
  } catch (e: any) {
    console.error(e);
    errMsg.value = e.message || "ログイン失敗";
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
          <v-btn variant="outlined" @click="clickLogin">ログイン</v-btn>
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
          <router-link to="/register">アカウント作成</router-link>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
<style scoped></style>
