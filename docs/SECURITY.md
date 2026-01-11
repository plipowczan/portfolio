# Security Best Practices

## API Key Management

### Storage Location
API keys and sensitive credentials are stored in `.env` file at the project root, which is automatically excluded from version control via `.gitignore`.

### Files Containing Secrets (Excluded from Git)
- `.env` - Environment variables for local development
- `.nano-banana-config.json` - MCP server configuration

### Setup for New Developers

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys:**
   ```bash
   # Edit .env file and replace placeholders with actual keys
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Get API Keys:**
   - **Gemini API**: [Google AI Studio](https://aistudio.google.com/app/apikey)

### Environment Variables

| Variable | Purpose | Required | Where to Get |
|----------|---------|----------|--------------|
| `GEMINI_API_KEY` | Google Gemini image generation | Yes (for image generation) | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | Default Gemini model | No | - |
| `IMAGE_SIZE` | Default image size | No | - |

## Deployment (Vercel)

For production deployments on Vercel:

1. **Add environment variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add each variable from `.env.example`
   - Set appropriate values for production

2. **Or use Vercel CLI:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```

## Security Checklist

### ✅ Do:
- Store all secrets in `.env` file
- Keep `.env` in `.gitignore`
- Provide `.env.example` as a template
- Use environment variables in code via `process.env`
- Rotate API keys periodically
- Use different keys for development and production

### ❌ Don't:
- Never commit `.env` to git
- Never hardcode API keys in source code
- Never share API keys in public channels
- Never log API keys to console
- Never include keys in error messages
- Never commit config files with secrets (`.nano-banana-config.json`)

## Verifying Security

Check if secrets are properly excluded:

```bash
# Check git status
git status

# Search for potential secrets in tracked files
git grep -i "api_key\|apikey\|secret\|password" | grep -v ".example\|.md"

# Verify .env is ignored
git check-ignore .env
```

## Emergency: Key Exposed

If you accidentally commit a secret:

1. **Immediately revoke the compromised key** at the provider's dashboard
2. **Generate a new key**
3. **Remove the secret from git history:**
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   git filter-repo --path .env --invert-paths
   ```
4. **Force push** (coordinate with team)
5. **Update all environments** with the new key

## Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
