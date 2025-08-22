---
layout: single
title: "Setup Instructions for Authentication"
permalink: /setup-instructions/
toc: true
---

# Setup Instructions for GitHub OAuth Authentication

To enable authentication for private posts on your Jekyll site, follow these steps:

## 1. Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the details:
   - **Application name**: Your Blog Name Authentication
   - **Homepage URL**: https://dupn98.github.io
   - **Authorization callback URL**: https://dupn98.github.io/auth-callback/
4. Click "Register application"
5. You'll receive a **Client ID** and can generate a **Client Secret**

## 2. Update Your Authentication Code

1. Open `assets/js/auth.js`
2. Replace `YOUR_GITHUB_OAUTH_CLIENT_ID` with your actual Client ID
3. Ensure the `AUTHORIZED_USER` is set to your GitHub username: `dupn98`

## 3. Set Up an Authentication Proxy

Since GitHub Pages doesn't support server-side code, you need a proxy service to exchange the OAuth code for an access token.

### Option 1: Use Netlify Functions

1. Create a Netlify account
2. Set up a simple function to handle the OAuth code exchange
3. Update the fetch URL in auth.js to point to your Netlify function

Example Netlify function:

```javascript
// netlify/functions/auth/auth.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  const code = JSON.parse(event.body).code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    })
  });
  
  const data = await response.json();
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://dupn98.github.io',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
};
```

### Option 2: Use Cloudflare Workers

1. Create a Cloudflare account
2. Set up a Worker to handle the OAuth code exchange
3. Update the fetch URL in auth.js to point to your Worker

### Option 3: Use a Static Authentication Service

For testing purposes, you can use a third-party service, but this is not recommended for production.

## 4. Configure Private Posts

1. Add the following to the front matter of any post you want to keep private:
   ```yaml
   private: true
   classes: private-post
   ```

2. Structure your private posts with:
   ```html
   <div class="auth-required-message">
     <!-- Login message -->
   </div>

   <div class="private-content">
     <!-- Private content here -->
   </div>
   ```

## 5. Testing Locally

When running your site locally, the authentication will be bypassed automatically, allowing you to view private content without logging in.

To test the full authentication flow, deploy your site to GitHub Pages.

## 6. Security Considerations

- This client-side authentication provides basic access control but is not a full security solution
- Anyone with access to your GitHub OAuth credentials could potentially bypass the authentication
- For truly sensitive information, consider a more robust solution with server-side authentication
