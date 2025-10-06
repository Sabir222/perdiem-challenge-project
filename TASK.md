# 🧠 Per Diem — Full Stack Engineer Take-Home Challenge

**About us**
Per Diem helps local merchants launch their own mobile apps and loyalty programs.
We integrate deeply with POS systems and believe in fast, high-quality software built by small, empowered teams.

---

## 🎯 Goal

Build a **multi-tenant Next.js app** that connects to a **TypeScript / Node.js backend** with a database.
The app should support **subdomain-based store isolation** and **store-specific authentication**.

---

## 🧩 Requirements

### 1. Multi-tenant logic

- When visiting `a.localhost:3000`, the app should load **Store A** data from the database.
- When visiting `b.localhost:3000`, it should load **Store B**.
- Store data should include at least:
  - Store name
  - Store ID or slug
  - Optional “welcome” message

### 2. Authentication

- Users should be able to **sign up** and **log in** for a specific store (e.g., only `a.domain.com`).
- Authentication must be **isolated per store** (a user from Store A can’t access Store B).
- You can use cookies, JWT, or any secure method you prefer.

### 3. Backend

- A small **Node.js + TypeScript API** that connects to a database.
- We use **PostgreSQL and Redis**, but feel free to use what you’re most comfortable with.
- Keep things organized, typed, and easy to read.

### 4. Frontend

- Use **Next.js (with TypeScript)** for the web UI.
- Include basic pages:
  - `/` – loads the current store info
  - `/login` and `/signup` – handle authentication against your API
- Each store should have a title, description, css theme (colors, fonts).

---

## 💡 Bonus Points

- ✅ Include **unit or integration tests**
- 🐳 Include a simple **Docker setup** for local development
- 🔒 Use good security practices (no hardcoded secrets, input validation)
- 🧱 Organize the repo like a small production project (clear structure, scripts, README)
- The more store customization you'll have the better!

---

## 📦 Deliverables

A public GitHub repository containing:

- Source code
- Setup instructions in `README.md`
- (Optional) short demo video or screenshots

---

## 🕐 Time Expectation

This task should take roughly **3–4 hours**.
We don’t expect a pixel-perfect UI — we care about **code quality, structure, and clarity of thought**.
If you have any question don't hesitate to reach out

---

## 💬 Evaluation Criteria

- Code structure and readability
- Correct use of TypeScript
- Understanding of authentication and multi-tenancy
- Developer experience (setup, documentation)
- (Bonus) Tests and Dockerization

---

## Submission

- Create a repo (public or private your call)
- Invite doron2402 and SaadFarooq-Dev to your repo
- email us: doron@tryperdiem.com, saad@tryperdiem.com

---

**Good luck, and have fun! 🚀**
_The Per Diem Engineering Team_
