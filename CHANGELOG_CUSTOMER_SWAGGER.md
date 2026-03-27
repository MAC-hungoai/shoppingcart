# Customer Admin + Swagger Changes

Date: 2026-03-27

## Files changed

- `server/models/CustomerDAO.js`
- `server/api/admin.js`
- `server/swagger.yaml`
- `client-admin/src/components/CustomerComponent.js`
- `client-admin/src/components/MainComponent.js`
- `client-admin/src/components/MenuComponent.js`

## 1.1.1 Admin - List Customer

- Added admin API `GET /api/admin/customers` to list all customers.
- Added admin API `GET /api/admin/orders/customer/:cid` to list orders by customer id.
- Added admin customer screen in `client-admin`.
- Added Swagger documentation for the admin customer list and customer order lookup endpoints.

## 1.1.2 Admin - deactive

- Added admin API `PUT /api/admin/customers/deactive/:id` to deactivate a customer.
- Updated `client-admin/src/components/CustomerComponent.js` so active customers show the `DEACTIVE` action.
- Added Swagger request body schema for customer deactivation using the customer token.

## 1.1.3 Admin - sendmail

- Added `CustomerDAO.selectByID()` to load a customer by id before resending email.
- Added admin API `GET /api/admin/customers/sendmail/:id` to resend the signup verification email.
- Updated `client-admin/src/components/CustomerComponent.js` so inactive customers show the `EMAIL` action and alert the API response message.
- Added Swagger documentation for the resend-email endpoint.
- In local/dev, if email credentials are not configured, the endpoint now returns `success: true` with a preview payload so the flow can still be tested.

## Swagger test flow

1. Call `POST /api/admin/login` to get `token`.
2. In Swagger, pass the token in header `x-access-token`.
3. Test `GET /api/admin/customers`.
4. Copy a customer `_id` from the response.
5. Test `GET /api/admin/orders/customer/{cid}` with that `_id`.
6. Copy the customer's `token` from the same response.
7. Test `PUT /api/admin/customers/deactive/{id}` with body `{ "token": "<customer-token>" }`.
8. Test `GET /api/admin/customers/sendmail/{id}` with an inactive customer id.

## Notes

- `GET /api/admin/customers` returns the customer `token`, so Swagger can call the deactive endpoint directly.
- The deactive action in the admin UI stops row click propagation before calling the API.
- The sendmail endpoint can return an email configuration error if `EMAIL_SERVICE`, `EMAIL_USER`, or `EMAIL_PASS` are not configured.
- For local testing, resend email now simulates success when mail is not configured and includes preview data in the response.
