import { defineStore } from "pinia";

export type User = {
  id: number;
  name: string;
};

export type CommonData = {
  user: User | null;
};

export const useCommonData = defineStore("commonData", {
  //初期値が空のオブジェクトだと、persist: trueでもlocalStorageに保存されないので注意。
  state: (): CommonData => ({
    user: null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    getUser(): User | null {
      return this.user;
    },
  },
  persist: true,
});

//ログアウト用
export const useLogoutStore = defineStore("logout", {
  state: () => ({
    listeners: new Set<() => Promise<boolean>>(),
  }),
  actions: {
    //ログアウトリクエストを受け取った時の処理を設定
    registerListener(listener: () => Promise<boolean>) {
      this.listeners.add(listener);
    },
    //ログアウトリクエストを受け取った時の処理を解除
    unregisterListener(listener: () => Promise<boolean>) {
      this.listeners.delete(listener);
    },
    //ログアウトリクエストを送る。
    // awaitすれば、全て完了するまで待てる。
    async requestLogout(): Promise<boolean> {
      const results = await Promise.all(
        Array.from(this.listeners).map((listener) => listener())
      );
      return results.every((result) => result);
    },
  },
});
