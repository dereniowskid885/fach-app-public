# FachApp

Web-based platform designed to manage and streamline the process of reporting, tracking, and resolving user issues. It connects regular users, who can submit support requests (“tickets”), with specialists or support agents who are responsible for resolving those requests.

## Repository Structure

The monorepo is organized into the following directories:

```
\frontend
  \web
  ...
\services
  \account-service
  ...
\shared
  \shared-types
  \shared-backend
  ...
```

## How to start selected service or whole app

Use `Ctrl+Shift+P` and select `Tasks:Run Task`

| Task | Result |
| ------ | ------ |
| Start App | Runs all services and frontend in seperated terminals |
| Start Frontend | Runs frontend web app |
| Start Account Service | Runs account service |
| Start Stripe CLI | Runs stripe CLI |
| Generate all APIs | Runs npm script, which generates all API hooks for frontend |

## First usage

1. Run `npm install` in root folder.
2. Use `Ctrl+Shift+P` and select `Tasks:Run Task`.
3. Select `Start App`.

- Frontend will be available at http://localhost:3000.
- Account service will be available at http://localhost:4000.
- Stripe CLI will be listening to http://localhost:4000/api/webhooks/stripe webhook endpoint.

## Stripe payments (Local development)

Stripe sends webhooks only to public URLs.  
To receive them locally, one must use **Stripe CLI**.

1. Install **Stripe CLI**: https://docs.stripe.com/stripe-cli
2. Login to Stripe:
```bash
stripe login
```
3. Start forwarding webhooks to your local backend:
```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```
4. Copy the generated webhook secret and add it to account-service **.env**:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```
5. Copy the secret key from stripe dashboard (https://dashboard.stripe.com/login) to account-service **.env**:
```bash
STRIPE_SECRET_KEY=sk_test_...
```

- Stripe CLI is required only for local development.
- Each developer must run Stripe CLI locally.
- Without Stripe CLI, webhook-based payments (ex. ticket payments) will not work.
