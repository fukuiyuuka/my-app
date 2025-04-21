<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { InputDate } from "./InputDate";
import { onBeforeRouteLeave } from "vue-router";
import * as t from "@yukafukui/shared-type";
import { api, logout } from "../common";
import { useCommonData, useLogoutStore } from "../../store/pinia";
const commonData = useCommonData();
const logoutStore = useLogoutStore();

/**
 * ============================================
 * 型
 * ============================================
 */
interface Task {
  taskId: number;
  name: string;
  details: string;
  due: string;
  done: boolean;
}

interface TaskGroup extends Task {
  subTaskList: Task[];
}

type EditTaskDialog = {
  show: boolean;
  errMsgList: string[];
  title: string;
  due: InputDate;
  name: string;
  done: boolean;
  currentTask: Task | null;
  parent: TaskGroup | null;
  actionName: string;
  action: Function | null;
};

/**
 * ============================================
 * ref変数
 * ============================================
 */

const loading = ref(false);

const taskList = ref<TaskGroup[]>([]);
const expanded = ref<number[]>([]);
const expandAll = ref(false);
const headers = [
  { title: "", key: "data-table-expand", width: "7%", sortable: false },
  { title: "", key: "check", width: "10%", sortable: false },
  { title: "日時", key: "due", width: "22%", sortable: true },
  { title: "タスク", key: "name", width: "40%", sortable: true },
  { title: "", key: "subTaskAdd", width: "7%", sortable: false },
  { title: "", key: "taskEdit", width: "7%", sortable: false },
  { title: "", key: "taskDelete", width: "7%", sortable: false },
];

const subtaskHeaders = [
  { title: "", key: "dummy", width: "7%" },
  { title: "", key: "check", width: "10%" },
  { title: "", key: "due", width: "22%" },
  { title: "", key: "name", width: "40%" },
  { title: "", key: "dummy", width: "7%" },
  { title: "", key: "subTaskEdit", width: "7%" },
  { title: "", key: "subTaskDelete", width: "7%" },
];

const editTaskDialog = ref<EditTaskDialog>({
  show: false,
  errMsgList: [],
  title: "",
  due: new InputDate(),
  name: "",
  done: false,
  currentTask: null,
  parent: null,
  actionName: "",
  action: null,
});

const taskDetail = ref<{
  title: string;
  content: string;
  currentTask?: Task;
  isEdit: boolean;
  editContent: string;
}>({
  title: "",
  content: "",
  isEdit: false,
  editContent: "",
});

/**
 * ============================================
 * event関数
 * ============================================
 */

//ダイアログ表示（追加/編集、タスク/サブタスク 全対応）
function openTaskDialog(
  title: string,
  action: Function,
  currentTask: Task | null,
  parent: TaskGroup | null
) {
  const dueDate = new InputDate(currentTask?.due);
  editTaskDialog.value = {
    show: false,
    errMsgList: [],
    title: title,
    due: dueDate,
    name: currentTask ? currentTask.name : "",
    done: currentTask ? currentTask.done : false,
    currentTask: currentTask,
    parent: parent,
    actionName: !currentTask ? "追加" : "保存",
    action: action,
  };

  editTaskDialog.value.show = true;
}

//ダイアログ入力チェック
function checkDialogInput(): boolean {
  editTaskDialog.value.errMsgList = [];
  if (!editTaskDialog.value.due.checkFormat()) {
    editTaskDialog.value.errMsgList.push("日時不正");
  }
  if (!editTaskDialog.value.name) {
    editTaskDialog.value.errMsgList.push("タスク内容必須");
  }
  return !editTaskDialog.value.errMsgList.length;
}

//タスク追加
function addTaskGroup() {
  if (!checkDialogInput()) return;
  const maxId = Math.max(0, ...taskList.value.map((task) => task.taskId));
  const task: TaskGroup = {
    name: editTaskDialog.value.name,
    due: editTaskDialog.value.due.toString(),
    details: "",
    done: false,
    taskId: maxId + 1,
    subTaskList: [],
  };
  taskList.value.push(task);
  editTaskDialog.value.show = false;
}

//サブタスク追加
function addSubtask() {
  //入力チェック
  if (!checkDialogInput()) return;

  const parent = editTaskDialog.value.parent;
  if (!parent) return; //あり得ないケース

  //リストにサブタスク追加
  const maxId = Math.max(0, ...parent.subTaskList.map((sub) => sub.taskId));
  const subTask: Task = {
    name: editTaskDialog.value.name,
    due: editTaskDialog.value.due.toString(),
    details: "",
    done: false,
    taskId: maxId + 1,
  };
  parent.subTaskList.push(subTask);
  editTaskDialog.value.show = false;

  //アコーディオンが開いていない場合は開く。
  if (!expanded.value.includes(parent.taskId)) {
    expanded.value = [...expanded.value, parent.taskId];
  }
}

//タスク編集（タスク/サブタスク 両方対応）
function editTask() {
  if (!checkDialogInput()) return;
  if (!editTaskDialog.value.currentTask) return; //あり得ないケース
  editTaskDialog.value.currentTask.name = editTaskDialog.value.name;
  editTaskDialog.value.currentTask.due = editTaskDialog.value.due.toString();
  editTaskDialog.value.show = false;
}

//タスク削除
function deleteTask(task: Task) {
  if (!confirm("削除しますか？")) return;
  taskList.value = taskList.value.filter((t) => t.taskId !== task.taskId);
}

//サブタスク削除
function deleteSubtask(task: TaskGroup, subTask: Task) {
  if (!confirm("削除しますか？")) return;
  task.subTaskList = task.subTaskList.filter(
    (st) => st.taskId !== subTask.taskId
  );
}

//タスク詳細表示(行クリック)
function onTaskClick(_event: MouseEvent, row: any) {
  compEditTaskDetail(); //もし編集途中の場合は保存する。
  taskDetail.value.isEdit = false;
  taskDetail.value.title = row.item.name;
  taskDetail.value.content = row.item.details;
  taskDetail.value.currentTask = row.item;
}

//タスク詳細編集（開始）
function beginEditTaskDetail() {
  if (!taskDetail.value.currentTask) return;
  taskDetail.value.editContent = taskDetail.value.currentTask.details;
  taskDetail.value.isEdit = true;
}

//タスク詳細編集（完了）
function compEditTaskDetail() {
  if (!taskDetail.value.currentTask || !taskDetail.value.isEdit) return;
  taskDetail.value.currentTask.details = taskDetail.value.editContent;
  taskDetail.value.content = taskDetail.value.currentTask.details;
  taskDetail.value.isEdit = false;
}

//サブタスク全表示・非表示
function toggleAll() {
  expandAll.value = !expandAll.value;
  expanded.value = expandAll.value
    ? taskList.value.map((task) => task.taskId)
    : [];
}

/**
 * ============================================
 * サーバ送受信関数
 * ============================================
 */

let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

let savedData: string = "";
//データ受信
const getData = async () => {
  const user = commonData.getUser();
  if (!user) {
    throw new Error("getData: ユーザ情報なし。取得失敗");
  }
  const req: t.GetTaskReq = {
    userId: user.id,
  };
  const res = await api.get("/task", {
    params: req,
    withCredentials: true,
  });

  const resBody: t.GetTaskRes = res.data;

  //セッション切れの場合はログイン画面に遷移
  if (res.status === 401) {
    logout();
    throw new Error("要ログイン");
  }

  if (res.status !== 200 || resBody.code !== 0 || !resBody.data) {
    throw new Error("getData: 通信エラー。取得失敗");
  }
  taskList.value = resBody.data.taskList.map((task) => {
    return {
      taskId: task.taskId,
      name: task.name,
      details: task.details,
      due: task.due,
      done: task.done,
      subTaskList: task.subTaskList.map((sub) => {
        return {
          taskId: sub.subTaskId,
          name: sub.name,
          details: sub.details,
          due: sub.due,
          done: sub.done,
        };
      }),
    };
  });
  savedData = JSON.stringify(taskList.value);
};

//セーブ
const saveData = async () => {
  if (savedData === JSON.stringify(taskList.value)) {
    console.log("saveData: 変更なし");
    return;
  }
  const userId = commonData.getUser()?.id;
  if (!userId) {
    console.error("saveData: ユーザ情報なし。データ保存失敗。");
    return;
  }
  const req: t.PostTaskReq = {
    userId: userId,
    taskList: taskList.value.map((task) => {
      return {
        userId: userId,
        taskId: task.taskId,
        name: task.name,
        details: task.details,
        due: task.due,
        done: task.done,
        subTaskList: task.subTaskList.map((sub) => {
          return {
            userId: userId,
            taskId: task.taskId,
            subTaskId: sub.taskId,
            name: sub.name,
            details: sub.details,
            due: sub.due,
            done: sub.done,
          };
        }),
      };
    }),
  };
  try {
    const res = await api.post("/task", req, {
      withCredentials: true,
    });

    //セッション切れの場合はログイン画面に遷移
    if (res.status === 401) {
      logout();
      throw new Error("要ログイン");
    }
    const resBody: t.CommonRes = res.data;

    if (res.status !== 200 || resBody.code !== 0) {
      throw new Error("saveData: APIエラー。データ保存失敗。");
    }
    savedData = JSON.stringify(taskList.value);
  } catch (e: any) {
    console.error(e.message || "saveData: 予期しないエラー。データ保存失敗。");
    throw e;
  }
};

//ウィンドウorタブが閉じる時自動セーブ
window.addEventListener("beforeunload", (_event) => {
  saveData(); //非同期
});

///ページ遷移前自動セーブ
onBeforeRouteLeave((_to, _from, next) => {
  //ログアウト（commonData.user=null）時は、beforeLogoutでセーブ
  if (commonData.user) saveData(); //非同期
  next(); //ページを離れる
});

//ログアウト時処理
const beforeLogout = async () => {
  await saveData();
  return true;
};

//ページ表示時
//データ取得 & 定期自動保存処理開始
onMounted(async () => {
  logoutStore.registerListener(beforeLogout); //ログアウト時処理の設定
  loading.value = true;
  try {
    await getData();
    autoSaveTimer = setInterval(() => {
      saveData();
    }, 30000);
  } catch (e: any) {
    console.error(e);
    console.error(`onMounted failed: ${e.message || ""}`);
  } finally {
    loading.value = false;
  }
});

//ページ離脱時
onBeforeUnmount(() => {
  logoutStore.unregisterListener(beforeLogout); //ログアウト時処理の解除
  if (autoSaveTimer) clearInterval(autoSaveTimer); //定期自動保存処理終了
});
</script>

<template>
  <v-container fluid>
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
      contained
      persistent
    >
      <v-progress-circular
        color="success"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <!-- タスク追加ボタン -->
    <v-btn
      variant="outlined"
      rounded="lg"
      @click="openTaskDialog('新規タスク', addTaskGroup, null, null)"
      class="ma-2"
    >
      タスク追加
    </v-btn>

    <!-- タスク追加・編集ダイアログ -->
    <v-dialog v-model="editTaskDialog.show" max-width="600">
      <v-card>
        <v-card-title class="pa-3">{{ editTaskDialog.title }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <!-- 日付 -->
          <v-row dense>
            <v-col cols="3" v-if="editTaskDialog.due.needDate">
              <v-text-field
                variant="outlined"
                label="年"
                v-model="editTaskDialog.due.year"
                max-length="4"
              ></v-text-field
            ></v-col>
            <v-col cols="3" v-if="editTaskDialog.due.needDate">
              <v-text-field
                variant="outlined"
                label="月"
                v-model="editTaskDialog.due.month"
                max-length="2"
              ></v-text-field>
            </v-col>
            <v-col cols="3" v-if="editTaskDialog.due.needDate">
              <v-text-field
                variant="outlined"
                label="日"
                v-model="editTaskDialog.due.day"
                max-length="2"
              ></v-text-field>
            </v-col>

            <!--日付ON/OFF-->
            <v-col cols="3">
              <v-switch
                @change="editTaskDialog.due.changeNeedDate"
                v-model="editTaskDialog.due.needDate"
                label="日付指定"
                color="success"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <!--時刻-->
            <v-col
              cols="3"
              v-if="editTaskDialog.due.needDate && editTaskDialog.due.needTime"
            >
              <v-text-field
                variant="outlined"
                label="時"
                v-model="editTaskDialog.due.hour"
                max-length="2"
              ></v-text-field
            ></v-col>
            <v-col
              cols="3"
              v-if="editTaskDialog.due.needDate && editTaskDialog.due.needTime"
            >
              <v-text-field
                variant="outlined"
                label="分"
                v-model="editTaskDialog.due.minute"
                max-length="2"
              ></v-text-field>
            </v-col>

            <!--時刻ON/OFF-->
            <v-col cols="3" v-if="editTaskDialog.due.needDate">
              <v-switch
                @change="editTaskDialog.due.changeNeedTime"
                v-model="editTaskDialog.due.needTime"
                label="終日"
                color="success"
            /></v-col>
          </v-row>
          <v-row dense>
            <v-text-field
              variant="outlined"
              label="タスク名"
              v-model="editTaskDialog.name"
            ></v-text-field>
          </v-row>
          <!-- ダイアログ エラーメッセージ -->
          <v-row v-if="!!editTaskDialog.errMsgList.length">
            <div v-for="(msg, i) in editTaskDialog.errMsgList" :key="i">
              <v-col cols="12" align="center">
                <div class="text-red">{{ msg }}</div>
              </v-col>
            </div>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="editTaskDialog.action">{{
            editTaskDialog.actionName
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="8">
        <!-- タスクテーブル -->
        <v-sheet border rounded>
          <v-data-table
            :headers="headers"
            :items="taskList"
            :items-per-page="-1"
            hide-default-footer
            class="bordered-table"
            @click:row="onTaskClick"
            item-value="taskId"
            show-expand
            :expanded.sync="expanded as any"
          >
            <!-- 展開ボタン列のヘッダー -->
            <template v-slot:header.data-table-expand>
              <!-- 展開ボタンと同じ見た目で全体トグル -->
              <v-icon @click="toggleAll" class="cursor-pointer">
                {{ expandAll ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </template>

            <!-- タスク名 -->
            <template v-slot:item.name="{ item }">
              <span class="text-h6">{{ item.name }}</span>
            </template>

            <!-- 日時 -->
            <template v-slot:item.due="{ item }">
              {{ new InputDate(item.due).showString() }}
            </template>

            <!-- タスク チェックボックス -->
            <template v-slot:item.check="{ item }">
              <v-checkbox v-model="item.done" hide-details color="success" />
            </template>

            <!-- サブタスク追加 -->
            <template v-slot:item.subTaskAdd="{ item }">
              <div class="text-end">
                <v-btn
                  icon
                  @click.stop="
                    openTaskDialog('新規サブタスク', addSubtask, null, item)
                  "
                  variant="plain"
                  elevation="0"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </div>
            </template>

            <!-- タスク 編集 -->
            <template v-slot:item.taskEdit="{ item }">
              <div class="text-end">
                <v-btn
                  icon
                  @click="openTaskDialog('タスク編集', editTask, item, null)"
                  variant="plain"
                  elevation="0"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </div>
            </template>

            <!-- タスク削除 -->
            <template v-slot:item.taskDelete="{ item }">
              <div class="text-end">
                <v-btn
                  icon
                  @click="deleteTask(item)"
                  variant="plain"
                  elevation="0"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </div>
            </template>

            <!-- サブタスクテーブル（展開部分） -->
            <template v-slot:expanded-row="{ columns, item }">
              <td :colspan="columns.length" v-if="item.subTaskList.length">
                <v-data-table
                  :headers="subtaskHeaders"
                  :items="item.subTaskList"
                  hide-default-footer
                  class="bordered-table thin-header"
                  @click:row="onTaskClick"
                  :items-per-page="-1"
                >
                  <!-- サブタスク名 -->
                  <template v-slot:item.name="{ item }">
                    <span class="text-subtitle-1"> {{ "・" + item.name }}</span>
                  </template>

                  <!-- 日時 -->
                  <template v-slot:item.due="{ item }">
                    {{ new InputDate(item.due).showString() }}
                  </template>

                  <!-- サブタスク チェックボックス -->
                  <template v-slot:item.check="{ item: sub }">
                    <v-checkbox
                      v-model="sub.done"
                      hide-details
                      color="success"
                    />
                  </template>

                  <!-- サブタスク 編集 -->
                  <template v-slot:item.subTaskEdit="{ item: sub }">
                    <div class="text-end">
                      <v-btn
                        icon
                        @click="
                          openTaskDialog('サブタスク編集', editTask, sub, item)
                        "
                        variant="plain"
                        elevation="0"
                        ><v-icon>mdi-pencil</v-icon></v-btn
                      >
                    </div>
                  </template>

                  <!-- サブタスク 削除 -->
                  <template v-slot:item.subTaskDelete="{ item: sub }">
                    <div class="text-end">
                      <v-btn
                        icon
                        @click="deleteSubtask(item, sub)"
                        variant="plain"
                        elevation="0"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </div>
                  </template>
                </v-data-table>
                <v-divider></v-divider>
              </td>
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>

      <!-- タスク詳細 -->
      <v-col cols="4">
        <v-sheet border rounded height="600px">
          <v-row class="pa-3 font-weight-bold">
            <div class="pa-3">{{ taskDetail.title }}</div>
            <v-spacer></v-spacer>
            <div v-if="taskDetail.isEdit">
              <v-btn
                icon
                @click.stop="compEditTaskDetail"
                variant="plain"
                elevation="0"
                ><v-icon>mdi-check</v-icon></v-btn
              >
            </div>
            <div v-else>
              <v-btn
                icon
                @click.stop="beginEditTaskDetail"
                variant="plain"
                elevation="0"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
            </div>
          </v-row>
          <v-divider></v-divider>
          <div v-if="taskDetail.isEdit" class="pa-4">
            <v-textarea
              v-model="taskDetail.editContent"
              variant="outlined"
              rows="20"
            ></v-textarea>
          </div>
          <div v-else>
            <div class="pa-6">{{ taskDetail.content }}</div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.bordered-table table {
  width: 100%;
  table-layout: fixed;
}

.bordered-table table,
.bordered-table th,
.bordered-table td {
  /* border: 1px solid #ccc;
  border-collapse: collapse; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: none;
}

.thin-header thead th,
.thin-header thead th > * {
  height: 0 !important;
  min-height: 0 !important;
  line-height: 1 !important;
  border-bottom: none !important;
}
</style>
