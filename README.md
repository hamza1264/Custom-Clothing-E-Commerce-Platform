This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## MongoDB store backend

The store uses MongoDB for its product catalog, accounts, and orders. Product
catalog requests seed the existing six products the first time the collection
is used. Checkout stores orders with server-verified prices and shipping;
customers can track an order using its number and the checkout phone number.
The existing login/register flow stores password hashes and uses an HTTP-only
session cookie. Registered accounts are stored in the `users` collection;
unexpired, non-logged-out sessions are stored separately in `login_sessions`.
Admin accounts can review store activity at `/admin`, manage all orders at
`/admin/orders`, view registered accounts at `/admin/customers`, and see active
login sessions at `/admin/users`. Admins can also manage the catalog at
`/admin/products`, where products can be created, updated, archived, or restored.

1. Start a local MongoDB server or create a MongoDB Atlas cluster.
2. Copy `.env.example` to `.env.local`.
3. Set `MONGODB_URI` to your MongoDB connection string and `MONGODB_DB_NAME`
   to your database name.
4. Set `AUTH_SECRET` to a private random value with at least 32 characters.
   Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
5. Set `ADMIN_EMAILS` to one or more comma-separated admin email addresses and
   set `ADMIN_PASSWORD` to a private password with at least 12 characters.
   Admins sign in directly at `/admin`; that page does not offer sign-up.
   Customer registration does not grant admin access. Admins can open `/admin`
   to review store metrics and `/admin/orders` to search orders and update their
   statuses.
6. Restart the Next.js development server.

Keep `.env.local` private and never commit database credentials, admin
passwords, or session secrets.

### Store API

- `GET /api/products` — list active products.
- `GET /api/products/:id` — get a product.
- `POST /api/products` — create a product (admin).
- `PATCH /api/products/:id` and `DELETE /api/products/:id` — update or remove a
  product (admin).
- `POST /api/orders` — place a Cash on Delivery order.
- `GET /api/orders` — list the signed-in customer's orders.
- `GET /api/orders/track?orderNumber=...&phone=...` — check order status.
- `POST /api/contact` — save a contact form message in the `contact_messages` collection.
- `GET /api/admin/orders` — list orders (admin).
- `PATCH /api/admin/orders/:orderNumber` — update status to `confirmed`,
  `processing`, `shipped`, `delivered`, or `cancelled` (admin).
- `/admin` — admin dashboard with store metrics.
- `/admin/orders` — search orders and update order statuses (admin).
- `/admin/customers` — registered accounts (admin).
- `/admin/users` — active login sessions (admin).
- `/admin/products` — create, edit, archive, and restore catalog products (admin).

Payments currently support Cash on Delivery only; no card processor is
configured.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
