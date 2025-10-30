# Nickname Chat

## 概要

このリポジトリは、Supabaseのリアルタイムを用いた認証不要のニックネーム制チャットアプリケーションです。ローカルで動作させる手順、Supabaseへのセットアップ、主要ファイル構成、運用・デプロイ上の注意点を明確化してあります。

主な特徴：

* ルーム作成・一覧表示
* Supabase Realtimeによる即時配信
* 認証不要・ニックネームベース（参加時にニックネーム入力）
* Tailwind CSS v4 と shadcn/ui によるモダンなUI
* モバイル〜デスクトップ対応のレスポンシブ設計

## 技術スタック

* フレームワーク: Next.js 16（App Router）
* 言語: TypeScript
* スタイリング: Tailwind CSS v4
* UI: shadcn/ui
* DB/Realtime: Supabase（PostgreSQL）
* 状態管理: React Hooks
* アイコン: lucide-react

## 前提条件

* Node.js 18.x 以上
* パッケージマネージャ: npm / yarn / pnpm / bun のいずれか
* Supabase プロジェクト（無料枠で可）

---

## インストールと起動（ローカル）

1. リポジトリをクローン

```bash
git clone https://github.com/Yosshy-123/nickname-chat.git
cd nickname-chat
```

2. 依存関係をインストール

```bash
npm install
# または
# yarn install
# pnpm install
# bun install
```

3. 環境変数を用意

プロジェクトルートに `.env.local` を作成し、以下を設定する。**公開キー（anon key）はクライアント配信用であるため第三者に渡さないこと**。

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
# 任意（サーバーサイドで使う場合は別に管理）
# SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>  # 絶対にクライアントに公開しないこと
```

4. Supabase のセットアップ（SQL実行）

Supabase のダッシュボード → SQL Editor で、`scripts/001_create_tables.sql`と`scripts/002_add_message_type.sql`を実行する：

5. 開発サーバー起動

```bash
npm run dev
# または
# yarn dev
# pnpm dev
# bun dev
```

ブラウザで `http://localhost:3000` を開く。

---

## 主要ファイルと役割

```
nickname-chat/
├── app/
│   ├── room/[id]/page.tsx       # チャットルームページ（Client component）
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ルーム一覧ページ
├── components/
│   ├── ui/                      # shadcn/ui 用コンポーネント
│   ├── chat-room.tsx            # チャットルームロジックとUI
│   ├── create-room-form.tsx     # ルーム作成フォーム
│   └── room-list.tsx            # ルーム一覧表示
├── lib/supabase/
│   ├── client.ts                # クライアント側 Supabase クライアント
│   └── server.ts                # サーバー側 Supabase クライアント（必要時）
├── scripts/                     # DB 初期化 SQL
└── package.json
```

---

## 実装のポイントと注意点

* **ニックネーム管理**: 認証を使わないため、クライアントでニックネームをローカルに保持する。ニックネーム変更は `messages` テーブルに `type = 'nickname_change'` として保存するとクライアント側で扱いやすい。

* **セキュリティ**: 公開クライアントキー（anon key）はクライアントで使うため存在するが、書き込み制御や不正利用対策として Supabase の RLS（Row Level Security）や Function を設定することを推奨する。サービスロールキーは**サーバー側でのみ**使用する。

* **パフォーマンス**: messages の取得は `room_id` と `created_at` によるページング（limit / offset ではなく cursor ベース）を推奨。

* **デプロイ**: Vercel でのデプロイを想定。環境変数（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）を Vercel のプロジェクト設定に登録すること。

---

## package.json の推奨スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## トラブルシューティング

* **Realtime が来ない**: Supabase のリアルタイム設定と publication を確認。`lib/supabase/client.ts` の `realtime` 初期化を確認。
* **テーブルスキーマが違う**: `scripts` 内の SQL を再実行し、既存の不一致がないか確認する。
* **匿名キーの漏洩**: anon key は公開キーだが、サービスロールキーが漏れていないか確認する。

---

## 謝辞

Next.js, Supabase, shadcn/ui, Tailwind CSS, lucide-react
