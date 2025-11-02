# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it responsibly by emailing me directly at:

**[me@cemal.online](mailto:me@cemal.online)**

Please **do not** create public GitHub issues for security vulnerabilities.

## What to Include in Your Report

When reporting a security issue, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if applicable)
- Your contact information for follow-up

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity (critical issues prioritized)

## Security Measures

This project implements several security measures:

### Backend Security

- **Environment Variables**: All sensitive credentials (API keys, Redis URLs, passwords) are stored in environment variables, never in code
- **Rate Limiting**: IP-based rate limiting for AI features using Redis Cloud
- **CORS Protection**: Properly configured CORS headers on serverless functions
- **Input Validation**: Server-side validation for all API endpoints

### Frontend Security

- **Client-Side Processing**: Sensitive operations (encryption, hashing) run client-side only
- **No Data Persistence**: Most tools don't send data to external servers
- **GDPR Compliance**: Cookie consent and privacy-focused design
- **Secure Authentication**: Password-protected sections for Zero Density tools

### API Security

- **HTTPS Only**: All production traffic uses HTTPS
- **JWT Validation**: Proper JWT token validation
- **XSS Protection**: React's built-in XSS protection
- **Content Security**: Sanitized user inputs

## Secure Deployment Checklist

When deploying this project:

1. ✅ Set all required environment variables in your hosting provider
2. ✅ Never commit `.env` files to version control
3. ✅ Use strong, unique passwords for admin panels
4. ✅ Rotate API keys and secrets regularly
5. ✅ Keep dependencies updated (`npm audit` and `npm update`)
6. ✅ Enable HTTPS/SSL on your domain
7. ✅ Configure proper CORS settings for your domain
8. ✅ Review and update rate limiting thresholds based on your usage

## Environment Variables Security

**Never expose these variables:**

- `REDIS_URL` - Contains Redis authentication credentials
- `VITE_GEMINI_API_KEY` - Google Gemini API access key
- `AI_UNLIMITED_KEY` - Secret key for unlimited AI access
- `VITE_ADMIN_PASSWORD` - Admin panel password
- `VITE_PRIVATE_SECTION_PASSWORD` - Private section password

**Best Practices:**

1. Use different keys/passwords for development and production
2. Store production secrets in your hosting provider's environment variable dashboard
3. Use `.env.example` as a template (contains no real credentials)
4. Add `.env*` to `.gitignore` (already configured)

## Dependencies

This project uses automated dependency scanning. To check for vulnerabilities:

```bash
npm audit
```

To fix vulnerabilities:

```bash
npm audit fix
```

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Updates

Security patches will be released as soon as possible after a vulnerability is confirmed. Users should:

1. Watch this repository for updates
2. Update dependencies regularly
3. Review CHANGELOG for security-related updates

## Third-Party Services

This project uses the following third-party services:

- **Google Gemini AI** - AI chatbot functionality
- **Redis Cloud** - Rate limiting and message storage
- **Vercel** - Hosting and serverless functions

Each service has its own security policies and terms of service. Please review:

- [Google Cloud Security](https://cloud.google.com/security)
- [Redis Cloud Security](https://redis.com/trust/)
- [Vercel Security](https://vercel.com/security)

## Known Security Considerations

### Client-Side Processing
Many tools (encryption, hashing, password generation) run entirely in the browser for privacy. However, this means:

- The code is visible to users
- Browser security is crucial
- Users should keep their browsers updated

### Rate Limiting
AI features are rate-limited per IP address:

- Default: 15 requests per 24 hours
- Stored in Redis Cloud (Frankfurt)
- Can be bypassed with unlimited key (admin only)

### Password Protection
Private tools section is protected by a password. This is a basic protection layer and should not be considered enterprise-grade security.

## License

This security policy is part of the MIT-licensed project. See [LICENSE](LICENSE) for details.

---

**Last Updated**: November 2024

For questions about this security policy, contact [me@cemal.online](mailto:me@cemal.online).
