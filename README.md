# cse340

Service project portal for CSE 340 - Web Backend Development.

## Getting Started

This project uses PostgreSQL to manage organizations, service projects, and categories.

### Setup

1. Copy `.env.example` to `.env` and update with your database credentials
2. Run the SQL in `src/setup.sql` to create the schema and seed data
3. Install dependencies: `npm install`
4. Start the server: `npm run dev` (for watch mode) or `npm start`

## Project Structure

```
src/
├── database/       Connection pool and query helper
├── models/         Database query functions
│   ├── organizations.js
│   ├── projects.js
│   └── categories.js
└── setup.sql       Database schema and seed data
```
