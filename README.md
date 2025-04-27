#### アプリ URL: https://my-app-frontend-4ylb.onrender.com

- サーバは 15 分アクセスがない場合、スリープしてしまいます。連絡いただければ起動します。
- 適当なユーザを作成し、ログインしてください。
- デバッグ途中です。
- データは永続化されていません。

#### アプリケーション構成

- バックエンド
  - サーバ：Render 上の Web Service
  - 言語：TypeScript
  - HTTP 通信：express
  - 認証：jsonwebtoken（JWT）
  - DB 構築：postgreSQL と prisma
    - Render 上の postgreSQL サーバ
    - zod-prisma-types を使って TypeScript の型とそのバリデーション機能を自動生成。
- フロントエンド
  - サーバ：Render 上の Static Site
  - Vue.js による SPA
  - 言語：TypeScript
  - デザイン：Vuetify
  - ページ遷移：vue-router
  - HTTP 通信：axios
  - 状態管理：pinia

#### フォルダ構成

- app：アプリケーションのコード
  - backend：バックエンド側のコード
    - prisma
      - schema.prisma：データ定義
    - src
      - server.ts：サーバ
      - api：DB 操作するバックエンド API
      - shared-type：フロントとの型共有用パッケージ
  - frontend
    - src
      - components：vue ページ
      - plugins：汎用的な ts スクリプト
        - inputDate.ts：日付入力用スクリプト
        - common.ts：Axios の設定などの汎用処理
- memo：開発時のメモ
  - システム検討：システム構築時の検討メモ
  - ツール導入手順：使用したツールやパッケージの導入手順
  - 学んだこと：寄り道して得た知識
