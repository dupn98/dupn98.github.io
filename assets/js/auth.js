// GitHub OAuth authentication for private posts
(function() {
  const GITHUB_CLIENT_ID = 'Ov23ctdxnqDz8MXpCWCV'; // You'll need to replace this with your actual Client ID
  const GITHUB_REDIRECT_URI = 'https://dupn98.github.io/auth-callback/';
  const AUTHORIZED_USER = 'dupn98'; // Your GitHub username
  
  // Check if we're running locally
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  // If running locally, automatically authenticate
  if (isLocalhost) {
    localStorage.setItem('auth_status', 'authenticated');
    localStorage.setItem('github_username', AUTHORIZED_USER);
    
    // Refresh the page if we were redirected to the auth page
    if (window.location.pathname.includes('/auth-callback/')) {
      window.location.href = '/';
    }
    
    // No need to continue with the auth flow if we're local
    return;
  }

  // Check if this is the auth callback page
  if (window.location.pathname.includes('/auth-callback/')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Use a proxy to exchange the code for an access token
      // Note: You'll need to set up this proxy separately since GitHub Pages doesn't support server-side code
      fetch('https://your-auth-proxy-service.com/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          // Get user data with the token
          return fetch('https://api.github.com/user', {
            headers: { 'Authorization': `token ${data.access_token}` }
          });
        }
      })
      .then(response => response.json())
      .then(userData => {
        if (userData && userData.login === AUTHORIZED_USER) {
          localStorage.setItem('auth_status', 'authenticated');
          localStorage.setItem('github_username', userData.login);
          // Redirect back to the site
          window.location.href = '/';
        } else {
          handleUnauthorized();
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
        handleUnauthorized();
      });
    }
  } else {
    // Check if we're already authenticated
    const authStatus = localStorage.getItem('auth_status');
    const githubUsername = localStorage.getItem('github_username');
    
    // For private posts, check auth status
    const isPrivatePage = document.body.classList.contains('private-post');
    
    if (isPrivatePage && (!authStatus || githubUsername !== AUTHORIZED_USER)) {
      handleUnauthorized();
    }
  }
  
  // Handle unauthorized access
  function handleUnauthorized() {
    // For private pages, hide content and show login button
    if (document.body.classList.contains('private-post')) {
      document.querySelectorAll('.private-content').forEach(el => {
        el.style.display = 'none';
      });
      
      document.querySelectorAll('.auth-required-message').forEach(el => {
        el.style.display = 'block';
      });
    }
  }
  
  // Initialize login button if it exists
  const loginButton = document.getElementById('github-login-btn');
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      // Redirect to GitHub OAuth
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=read:user`;
    });
  }
  
  // Initialize logout button if it exists
  const logoutButton = document.getElementById('github-logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('auth_status');
      localStorage.removeItem('github_username');
      window.location.reload();
    });
  }
  
  // Update UI based on auth status
  function updateAuthUI() {
    const authStatus = localStorage.getItem('auth_status');
    const username = localStorage.getItem('github_username');
    
    const loginContainer = document.getElementById('auth-container');
    if (loginContainer) {
      if (authStatus === 'authenticated') {
        loginContainer.innerHTML = `
          <span class="logged-in-message">Logged in as ${username}</span>
          <button id="github-logout-btn" class="btn btn--small">Logout</button>
        `;
        
        // Reinitialize the logout button
        const logoutButton = document.getElementById('github-logout-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', function() {
            localStorage.removeItem('auth_status');
            localStorage.removeItem('github_username');
            window.location.reload();
          });
        }
      } else {
        loginContainer.innerHTML = `
          <button id="github-login-btn" class="btn btn--primary btn--small">Login with GitHub</button>
        `;
        
        // Reinitialize the login button
        const loginButton = document.getElementById('github-login-btn');
        if (loginButton) {
          loginButton.addEventListener('click', function() {
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=read:user`;
          });
        }
      }
    }
    
    // Show/hide private content
    if (authStatus === 'authenticated' && username === AUTHORIZED_USER) {
      document.querySelectorAll('.private-content').forEach(el => {
        el.style.display = 'block';
      });
      
      document.querySelectorAll('.auth-required-message').forEach(el => {
        el.style.display = 'none';
      });
      
      // Show private category/tag links
      document.querySelectorAll('.private-category').forEach(el => {
        el.style.display = 'inline-block';
      });
    } else {
      // Hide private category/tag links
      document.querySelectorAll('.private-category').forEach(el => {
        el.style.display = 'none';
      });
    }
  }
  
  // Update UI when the DOM is loaded
  document.addEventListener('DOMContentLoaded', updateAuthUI);
})();
