# Nickname Chat

## 概要

このリポジトリは、Supabaseのリアルタイムを用いた認証不要のニックネーム制チャットアプリケーションです。ローカルで動作させる手順、Supabaseへのセットアップ、主要ファイル構成、運用・デプロイ上の注意点を明確化してあります。

主な特徴：

* ルーム作成・一覧表示
* Supabase Realtimeによる即時配信
* 認証不要・ニックネームベース（参加時にニックネーム入力）
* Tailwind CSS v4 と shadcn/ui によるモダンなUI

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

---

## 謝辞

Next.js, Supabase, shadcn/ui, Tailwind CSS, lucide-react
