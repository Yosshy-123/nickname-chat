# Modern Nickname Chat

リアルタイムメッセージングを備えたモダンなroom制ニックネームチャットアプリケーション

## 機能

- **ルーム管理**: チャットルームの作成と一覧表示
- **リアルタイムチャット**: Supabaseのリアルタイム機能による即座のメッセージ配信
- **ニックネームシステム**: 認証不要のニックネームベースのチャット
- **ニックネーム変更**: チャット中にニックネームを変更可能（リアルタイム通知付き）
- **モダンUI**: Tailwind CSS v4とshadcn/uiによる洗練されたデザイン
- **レスポンシブ**: モバイルからデスクトップまで対応

## 技術スタック

- **フレームワーク**: [Next.js 16](https://nextjs.org/) (App Router)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **データベース**: [Supabase](https://supabase.com/) (PostgreSQL + リアルタイム機能)
- **状態管理**: React Hooks
- **アイコン**: [Lucide React](https://lucide.dev/)

## 前提条件

- Node.js 18.x以上
- npm、yarn、pnpm、またはbunのいずれか
- Supabaseアカウント（無料プランで可）

## インストール手順

### 1. リポジトリのクローン

\`\`\`bash
git clone https://github.com/yourusername/nickname-chat.git
cd nickname-chat
\`\`\`

### 2. 依存関係のインストール

\`\`\`bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
\`\`\`

### 3. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com/)でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

### 4. 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成し、以下の環境変数を設定します：

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. データベースのセットアップ

Supabaseのダッシュボードで、SQL Editorを開き、以下のスクリプトを順番に実行します：

#### `scripts/001_create_tables.sql`

\`\`\`sql
-- roomsテーブルの作成
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- messagesテーブルの作成
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade not null,
  nickname text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- インデックスの作成
create index if not exists messages_room_id_idx on messages(room_id);
create index if not exists messages_created_at_idx on messages(created_at);

-- リアルタイム機能の有効化
alter publication supabase_realtime add table messages;
\`\`\`

#### `scripts/002_add_message_type.sql`

\`\`\`sql
-- メッセージタイプ列の追加
alter table messages 
add column if not exists type text default 'message' check (type in ('message', 'nickname_change'));

-- 既存のメッセージにデフォルト値を設定
update messages set type = 'message' where type is null;
\`\`\`

### 6. 開発サーバーの起動

\`\`\`bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## ビルドとデプロイ

### プロダクションビルド

\`\`\`bash
npm run build
npm run start
\`\`\`

### Vercelへのデプロイ

このアプリケーションはVercelへのデプロイに最適化されています：

1. [Vercel](https://vercel.com/)でアカウントを作成
2. GitHubリポジトリをインポート
3. 環境変数を設定
4. デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 使い方

1. **ルームの作成**: トップページでルーム名を入力して「ルームを作成」をクリック
2. **ルームへの参加**: ルーム一覧から参加したいルームをクリック
3. **ニックネームの設定**: 初回参加時にニックネームを入力
4. **メッセージの送信**: メッセージを入力してEnterキーまたは送信ボタンをクリック
5. **ニックネームの変更**: ヘッダーの設定アイコンをクリックして新しいニックネームを入力

## プロジェクト構造

\`\`\`
nickname-chat/
├── app/
│   ├── room/[id]/
│   │   └── page.tsx          # チャットルームページ
│   ├── globals.css            # グローバルスタイル
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # ルーム一覧ページ
├── components/
│   ├── ui/                    # shadcn/ui コンポーネント
│   ├── chat-room.tsx          # チャットルームコンポーネント
│   ├── create-room-form.tsx   # ルーム作成フォーム
│   └── room-list.tsx          # ルーム一覧コンポーネント
├── lib/
│   └── supabase/
│       ├── client.ts          # クライアントサイドSupabaseクライアント
│       └── server.ts          # サーバーサイドSupabaseクライアント
├── scripts/
│   ├── 001_create_tables.sql  # 初期テーブル作成
│   └── 002_add_message_type.sql # メッセージタイプ追加
└── package.json
\`\`\`

## 主要な依存関係

- `next@16.0.0` - Reactフレームワーク
- `react@19.2.0` - UIライブラリ
- `@supabase/supabase-js` - Supabaseクライアント
- `@supabase/ssr` - Next.js用Supabase SSR
- `tailwindcss@4.1.9` - CSSフレームワーク
- `lucide-react` - アイコンライブラリ
- `@radix-ui/*` - UIプリミティブ

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

MIT

## 謝辞

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
