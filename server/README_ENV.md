# Environment variables

Create a `.env` file in the `server` directory with the following keys:

```
MONGODB_URL=mongodb://127.0.0.1:27017/sih_internal
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SENDER_EMAIL=your_verified_sender@example.com
```

These variables are used by `server/server.js` and `server/config/nodemailer.js`.
