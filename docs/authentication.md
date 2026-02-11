## When do you use jwt.verify()?

We use `jwt.verify()` inside `authentication` middleware on every protected request. When a client sends a request with a JWT in the Authorization header, the backend verifies the token’s signature and expiration. If valid, we extract the user ID from the payload and allow access. If invalid or expired, we return 401 Unauthorized.

## Why do we store user ID in JWT?

We store the user ID in the JWT payload so that after verifying the token, we can identify which user is making the request. The ID acts as a reference to fetch user data from the database if needed. Since JWT is stateless, it allows us to authenticate users without storing session data on the server.

## Why not check database every time instead of using JWT?

JWT enables stateless authentication. Instead of storing sessions in memory or a database, the server verifies the token cryptographically. This improves scalability because no session storage is required. However, in most real-world systems, we still fetch the user from the database after verification for authorization checks.

## Can someone decode a JWT?

Yes, JWT payloads are Base64 encoded, not encrypted, so anyone can decode them. However, without the secret key, they cannot generate a valid signature. That’s why we use jwt.verify() to ensure integrity and authenticity.
