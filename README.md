# Blogify

Blogify is a server-rendered blogging application built with Node.js, Express, EJS, and MongoDB. Users can create accounts, publish posts with cover images, read posts, and leave comments. The EJS views use a responsive blue-black glass theme, Bootstrap 5, and the custom stylesheet in `views/index.css`.

## Features

- Server-rendered home feed, ordered from newest to oldest
- Account signup and signin with password hashing and JWT-based authentication
- Blog posts with uploaded cover images
- Comments associated with a post and its author
- Responsive navigation and layouts for desktop and mobile

## Requirements

- Node.js 20.19.0 or newer (required by the installed Mongoose 9 release)
- npm
- A MongoDB database, either local or hosted (for example, MongoDB Atlas)

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root. Do not commit this file:

   ```dotenv
   PORT=8000
   MONGO_URL=mongodb://127.0.0.1:27017/blogify
   ```

   Replace the MongoDB URL with your own connection string when using a hosted database. Configure the database user and network access in your MongoDB provider's dashboard.

3. Ensure the upload directory exists. It is used to store post cover images:

   ```sh
   mkdir -p public/uploads
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:8000](http://localhost:8000). If `PORT` is set to another value, use that port instead.

For a production-style local start, use:

```sh
npm start
```

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONGO_URL` | Yes | None | MongoDB connection URI used by `app.js`. |
| `PORT` | No | `8000` | HTTP port supplied by the host or local environment. |

The JWT signing key is currently hard-coded in `services/authentication.js`. Replace it with a strong secret supplied through the deployment environment before deploying to production. Never publish database credentials or signing secrets.

## Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Render the latest blog posts. |
| `GET` | `/user/signup` | Render the account creation form. |
| `POST` | `/user/signup` | Create an account. |
| `GET` | `/user/signin` | Render the signin form. |
| `POST` | `/user/signin` | Verify credentials and issue the `token` cookie. |
| `GET` | `/user/logout` | Clear the `token` cookie. |
| `GET` | `/blog/add-new` | Render the post editor. |
| `POST` | `/blog/` | Create a post and upload its `coverImage` (`multipart/form-data`). |
| `GET` | `/blog/:id` | Render a post and its comments. |
| `POST` | `/blog/comment/:blogId` | Add a comment to a post. |

The post and comment creation flows expect a signed-in user. Use the application navigation to reach the post editor after signing in.

## Project Structure

```text
.
├── app.js                      # Express entry point and middleware setup
├── connection.js               # Unused MongoDB connection stub
├── controllers/                # Currently empty
├── middlewares/
│   └── authentication.js       # Reads and validates the JWT cookie
├── models/
│   ├── blog.js                 # Blog schema
│   ├── comment.js              # Comment schema
│   └── user.js                 # User schema and password verification
├── routes/
│   ├── blog.js                 # Blog, upload, and comment routes
│   ├── static.js               # Legacy static routes; not mounted by app.js
│   └── user.js                 # Signup, signin, and logout routes
├── services/
│   └── authentication.js       # JWT creation and validation
├── public/
│   ├── avatar.jpg              # Default profile image
│   └── uploads/                # Uploaded blog cover images
├── views/
│   ├── addblog.ejs             # Post editor
│   ├── blog.ejs                # Post and comments
│   ├── home.ejs                # Blog feed
│   ├── index.css               # Shared responsive theme
│   ├── signin.ejs              # Signin form
│   ├── signup.ejs              # Signup form
│   └── partials/               # Shared head, navigation, and scripts
├── deploymentguide.md          # Initial AWS deployment notes
├── package.json
└── README.md
```

`demo.js` is a standalone scratch file and is not used by the application. `connection.js` and `routes/static.js` are also not used by the main entry point. The application currently connects to MongoDB directly from `app.js`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the app with Nodemon. |
| `npm start` | Start the app with Node.js. |
| `npm test` | Placeholder only; no automated test suite is configured yet. |

Tailwind packages are listed in `package.json`, but the current UI does not run a Tailwind build. Bootstrap CSS and JavaScript are loaded from jsDelivr, and the project theme is defined in `views/index.css`.

## Deployment Notes

The app reads its listening port from `PORT` and its MongoDB connection string from `MONGO_URL`, which suits common Node.js hosting platforms. For AWS or another provider:

1. Deploy the repository with Node.js 20.19.0 or newer.
2. Install production dependencies with `npm install` and start with `npm start` (or use the provider's equivalent build/start configuration).
3. Set `MONGO_URL` and `PORT` in the provider's environment-variable configuration. Do not upload `.env` or commit credentials.
4. Ensure the MongoDB provider allows connections from the deployed application.
5. Provide persistent storage for `public/uploads`; local instance storage may be temporary on many hosting platforms. For durable production uploads, use persistent storage or an object-storage service and update the upload flow accordingly.
6. Move the JWT signing secret into environment configuration and set appropriate secure cookie options before exposing the application publicly.

See [`deploymentguide.md`](deploymentguide.md) for the existing AWS note. Deployment has not been configured or verified for a specific AWS service.

## Current Limitations

- `npm test` is a placeholder and exits with an error until a test suite is added.
- Uploaded images are stored on the local filesystem; multi-instance or ephemeral deployments need persistent/object storage.
- The JWT secret is hard-coded and must be moved to environment configuration before production.
- Authentication and cookie handling are an initial implementation and should receive a security review before public deployment.
