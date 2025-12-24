# StreamVibe

[cloudflarebutton]

A full-stack real-time chat application powered by Cloudflare Workers and Durable Objects. Features user management, chat boards, and message persistence with a modern React frontend using shadcn/ui and Tailwind CSS.

## ✨ Key Features

- **Multi-tenant Durable Objects**: Single Global Durable Object efficiently manages multiple entity types (Users, Chats, Messages) with automatic indexing and listing.
- **Real-time Chat Boards**: Create chats, send messages, and list conversations with optimistic updates.
- **Type-safe API**: Shared TypeScript types between frontend and worker ensure end-to-end type safety.
- **Responsive UI**: Built with React 18, TanStack Query, shadcn/ui components, and Tailwind CSS for a polished, mobile-first experience.
- **Production-ready**: Includes error handling, CORS, logging, client error reporting, and theming (light/dark mode).
- **Seed Data**: Mock users, chats, and messages auto-populate on first run.
- **Indexed Listing**: Efficient pagination for users and chats with cursor-based queries.

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed)
- **Frontend**: React 18, TypeScript, Vite, TanStack React Query
- **UI**: shadcn/ui, Tailwind CSS, Lucide icons, Framer Motion
- **State & Forms**: Zustand, React Hook Form, Zod
- **Utilities**: Immer, clsx, tw-merge
- **Package Manager**: Bun

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bun add -g wrangler`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

### Development

- Start the dev server (frontend + worker proxy):
  ```bash
  bun dev
  ```
- Open [http://localhost:3000](http://localhost:3000) (or `bun dev --port 8080` for custom port)

### API Endpoints

All APIs under `/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List users (?cursor=&limit=) |
| POST | `/api/users` | Create user `{name}` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Bulk delete `{ids: []}` |
| GET | `/api/chats` | List chats (?cursor=&limit=) |
| POST | `/api/chats` | Create chat `{title}` |
| GET | `/api/chats/:chatId/messages` | List messages |
| POST | `/api/chats/:chatId/messages` | Send message `{userId, text}` |
| DELETE | `/api/chats/:id` | Delete chat |
| POST | `/api/chats/deleteMany` | Bulk delete `{ids: []}` |

Example with `curl`:

```bash
# List users
curl http://localhost:3000/api/users

# Create chat
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'

# Send message
curl -X POST http://localhost:3000/api/chats/c1/messages \
  -H "Content-Type: application/json" \
  -d '{"userId": "u1", "text": "Hello!"}'
```

## 🔧 Development Workflow

- **Frontend**: Edit `src/` files. Hot-reload via Vite.
- **Backend**: Add routes to `worker/user-routes.ts`. Core utils in `worker/core-utils.ts` and entities in `worker/entities.ts` (extend `IndexedEntity` for new entities).
- **Shared Types**: Define in `shared/types.ts` and `shared/mock-data.ts`.
- **Linting**: `bun lint`
- **Build**: `bun build`
- **Preview**: `bun preview`

**Custom Entities**:
1. Extend `IndexedEntity` in `worker/entities.ts`.
2. Add statics: `entityName`, `indexName`, `initialState`, optional `seedData`.
3. Add CRUD routes in `worker/user-routes.ts` using `Entity.create()`, `Entity.list()`, etc.

## ☁️ Deployment

1. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

2. **Configure** (edit `wrangler.jsonc`):
   - Set `name` to your Worker name
   - Add `account_id` if needed

3. **Deploy**:
   ```bash
   bun run deploy
   ```
   Or use the one-click deploy:
   [cloudflarebutton]

4. **Custom Domain** (optional):
   ```bash
   wrangler deploy --var CLOUDFLARE_FRONTEND_HOST:yourdomain.com
   ```

**Notes**:
- Assets (React build) are automatically bundled and served as SPA.
- Durable Objects migrate automatically via `migrations` in `wrangler.jsonc`.
- Logs: Use Cloudflare Dashboard > Workers > Your Worker > Logs.

## 🤝 Contributing

1. Fork and create a PR
2. Use Bun for consistency
3. Follow TypeScript and ESLint rules
4. Test changes with `bun dev`

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)

Built with ❤️ for Cloudflare Workers.