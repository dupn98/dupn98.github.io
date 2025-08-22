---
layout: categories
title: "Posts by Category"
permalink: /categories/
author_profile: true
---

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const authStatus = localStorage.getItem('auth_status');
  const username = localStorage.getItem('github_username');
  const isAuthorized = authStatus === 'authenticated' && username === 'dupn98';
  
  // Get all category links
  document.querySelectorAll('.archive__item-title a').forEach(function(link) {
    // If the link contains "Private" and user is not authorized, add private-category class
    if (link.textContent.includes('Private') && !isAuthorized) {
      link.parentElement.parentElement.classList.add('private-category');
      link.parentElement.parentElement.style.display = 'none';
    }
  });
});
</script>
