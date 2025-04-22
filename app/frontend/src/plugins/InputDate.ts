import { ref } from "vue";

//日時入力フォーム
//イベントに使用するためメソッドはアロー関数で宣言すること（thisをbind）
export class InputDate {
  year = ref("");
  month = ref("");
  day = ref("");
  hour = ref("");
  minute = ref("");
  needDate = ref(false);
  needTime = ref(false);

  //日時のDB格納形式を入力フォーム用に分割する。
  //dateString: yyyymmddhhmm or yyyymmdd
  constructor(dateString?: string | null) {
    if (!dateString) {
      return;
    }
    this.needDate.value = true;
    this.needTime.value = !!(dateString.length === 12);

    this.year.value = dateString.slice(0, 4);
    this.month.value = dateString.slice(4, 6); // JSの月は0〜11
    this.day.value = dateString.slice(6, 8);
    if (this.needTime) {
      this.hour.value = dateString.slice(8, 10);
      this.minute.value = dateString.slice(10, 12);
    }
  }

  //入力された日時をチェック
  checkFormat = () => {
    if (!this.needDate.value) {
      return true;
    }

    try {
      const date = new Date(
        Number(this.year.value),
        Number(this.month.value) - 1,
        Number(this.day.value),
        Number(this.hour.value || "00"),
        Number(this.minute.value || "00")
      );

      return (
        date.getFullYear() === Number(this.year.value) &&
        date.getMonth() === Number(this.month.value) - 1 &&
        date.getDate() === Number(this.day.value) &&
        date.getHours() === Number(this.hour.value || "00") &&
        date.getMinutes() === Number(this.minute.value || "00")
      );
    } catch (e) {
      return false;
    }
  };

  //日付指定スイッチ変更イベント
  changeNeedDate = () => {
    if (this.needDate) this.setDateOn();
    else this.setDateOff();
  };

  //日付指定スイッチON
  setDateOn = () => {
    const now = new Date();
    this.year.value = String(now.getFullYear());
    this.month.value = String(now.getMonth() + 1).padStart(2, "0");
    this.day.value = String(now.getDate()).padStart(2, "0");
  };

  //日付指定スイッチOFF
  setDateOff = () => {
    console.log("setDateOff");
    this.year.value = "";
    this.month.value = "";
    this.day.value = "";
    this.hour.value = "";
    this.minute.value = "";
    this.needTime.value = false;
  };

  //時間指定スイッチ変更イベント
  changeNeedTime = () => {
    if (this.needTime) this.setTimeOn();
    else this.setTimeOff();
  };

  //時間指定スイッチON
  setTimeOn = () => {
    this.hour.value = "00";
    this.minute.value = "00";
  };

  //時間指定スイッチOFF
  setTimeOff = () => {
    this.hour.value = "";
    this.minute.value = "";
  };

  //入力フォームの内容をDBに格納可能な形式（yyyymmdd(hhmm)形式のstring）に変換
  toString = () => {
    if (!this.needDate.value) return "";
    if (!this.needTime.value)
      return `${this.year.value}${this.month.value}${this.day.value}`;
    return `${this.year.value}${this.month.value}${this.day.value}${this.hour.value}${this.minute.value}`;
  };

  //日付を画面表示形式に変換
  showString = () => {
    if (!this.needDate.value) return "";
    if (!this.needTime.value)
      return `${this.year.value}/${this.month.value}/${this.day.value}`;
    return `${this.year.value}/${this.month.value}/${this.day.value} ${this.hour.value}:${this.minute.value}`;
  };
}
