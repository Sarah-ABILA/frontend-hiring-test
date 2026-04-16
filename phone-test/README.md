# Aircall Frontend Hiring Test

This project is a small phone application used for Aircall frontend interviews.
It uses **Vite**, **React**, **Apollo Client**, **Zustand**, and **Dayjs**.

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```bash
npm run dev
```

### Testing

Launches the Vitest runner.

```bash
npm run test
```

### Build

Builds the app for production to the `dist` folder.

```bash
npm run build
```

## Important Note on Real-time Features

If you are asked to implement real-time features (Subscriptions), please note that the test server uses the **legacy WebSocket protocol** (`subscriptions-transport-ws`), not the newer `graphql-ws` protocol.

We have pre-installed the `subscriptions-transport-ws` package for you.
You should use `WebSocketLink` from `@apollo/client/link/ws` and `SubscriptionClient` from `subscriptions-transport-ws`.

---

## 🐛 Bug Fixes

- **404 on root route** — Added a redirect from `/` to `/login` and fixed the missing index route
- **Duplicate `/calls` route** — Fixed nested route that was duplicating the path
- **`Welcome {username}!`** — Fixed broken template literal and missing user context in `useAuth`
- **Session persistence** — User persisted in localStorage, survives page reloads
- **Apollo error handling** — Added `errorLink` to handle `UNAUTHENTICATED` errors and retry with refresh token

---

## ✨ New Features

### 🗂️ Call Filters
Filter calls by type (All / Answered / Missed / Voicemail) and by direction (All / Inbound / Outbound).

### 📝 Add Notes
Add notes to any call directly from the call detail page. Saved via GraphQL mutation, displayed instantly.

### 📦 Archive / Unarchive
Archive or unarchive calls from the detail page with a single click.

---

## 🎨 UI/UX Improvements

- **Login page** — Split-screen layout with Aircall branding
- **Navbar** — Green Aircall navbar with avatar and logout
- **Calls list** — Color-coded borders, badges, hover effects
- **Call details** — Clean grid layout, inline note editor, archive button

---

## 👩‍💻 Author

Sarah Abila — [GitHub](https://github.com/Sarah-ABILA) · [LinkedIn](https://linkedin.com/in/sarah-abila-278041378)
