# IPJBU deployment

Deploy the frontend and backend as separate services. Do not reuse Afaco
deployment URLs, MongoDB databases, or credentials.

## Vercel frontend

- Import this repository and set the project root to `Frontend`.
- Use `npm install` for installation and `npm run build` for the build.
- Set the output directory to `dist`.
- Add `VITE_API_BASE_URL` to the Vercel environment variables for every
  environment that you deploy. Its value is the HTTPS URL of the new IPJBU
  Render service, without a trailing slash (for example,
  `https://ipjbu-api.onrender.com`).
- The production build fails if this variable is missing or is not HTTPS. This
  avoids silently shipping a frontend that sends API requests to Vercel itself.
- `Frontend/vercel.json` provides the SPA rewrite for client-side routes.

## Render backend

- Create a new Web Service from this repository and set the root directory to
  `Backend`.
- Use `npm install` as the build command and `npm start` as the start command.
- Set `NODE_ENV=production`.
- Add the variables listed in `Backend/.env.example` in the Render service
  settings. Use the new IPJBU Atlas connection string and credentials, not the
  local ignored `.env` file. Set `CLIENT_ORIGIN` to the exact Vercel production
  URL. Additional allowed origins, such as a custom domain, can be comma
  separated. Do not include a trailing slash.
- Generate a new long random `JWT_SECRET`. Do not reuse an Afaco secret.
- Configure a verified sender/domain for Resend before relying on contact form
  email delivery.
- Uploaded images are stored in ImageKit; do not rely on Render's local
  filesystem for persistent uploads.

The API health endpoint is `/api/health`.

## MongoDB Atlas

- Use an IPJBU-specific database and database user. The application will create
  collections as it writes records.
- Allow Render to connect to the cluster in the Atlas network access settings.
- Keep the connection string only in Render's `MONGO_URI` environment variable;
  never commit credentials.

## ImageKit and admin setup

- Create or select the IPJBU ImageKit account and set its public key, private
  key, and URL endpoint in Render. Keep the private key secret.
- After the backend is deployed and connected to the new Atlas database, create
  the initial admin and default site records by running `npm run seed` from the
  `Backend` directory with `ADMIN_USERNAME` and `ADMIN_PASSWORD` supplied only
  for that one-off command. Use a unique strong password and do not commit or
  leave these values in source control.

## Local production build check

Set `VITE_API_BASE_URL` to the new HTTPS Render URL, then run
`npm run build` from `Frontend`. The API URL is intentionally not stored in a
tracked production environment file.
