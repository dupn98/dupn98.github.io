---
title: "Advanced Minimal Mistakes Features"
date: 2025-08-21T10:00:00-05:00
categories:
  - Tutorial
  - Jekyll
tags:
  - Minimal Mistakes
  - Advanced Features
layout: single
toc: true
toc_sticky: true
author_profile: true
read_time: true
comments: true
share: true
related: true
---

# Advanced Features in Minimal Mistakes Theme

This post demonstrates more advanced features available in the Minimal Mistakes Jekyll theme that weren't covered in the first post.

## Custom Skins

Minimal Mistakes comes with multiple skins. You can change the skin in `_config.yml`:

```yaml
minimal_mistakes_skin: "default" # "air", "aqua", "contrast", "dark", "dirt", "neon", "mint", "plum", "sunrise"
```

## Author Profiles

You can set up detailed author profiles in `_data/authors.yml`:

```yaml
john_doe:
  name: "John Doe"
  bio: "Just another developer."
  avatar: "/assets/images/bio-photo.jpg"
  links:
    - label: "Email"
      icon: "fas fa-fw fa-envelope-square"
      url: "mailto:john@example.com"
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
      url: "https://twitter.com/john"
```

## Grid View Layout

For archive pages, you can use different layouts:

```yaml
---
layout: archive
entries_layout: grid
---
```

## Wide Pages

Make your content wider:

```yaml
---
classes: wide
---
```

## Custom Sidebar Navigation

Create custom navigation for different sections in `_data/navigation.yml`:

```yaml
docs:
  - title: Getting Started
    children:
      - title: "Quick-Start Guide"
        url: /docs/quick-start-guide/
      - title: "Structure"
        url: /docs/structure/
  - title: Customization
    children:
      - title: "Configuration"
        url: /docs/configuration/
```

## Link Post Format

Create a post that links to external content:

```yaml
---
title: "Link to External Content"
link: https://example.com
---
```

## Video Post Format

Create a post with a video header:

```yaml
---
header:
  video:
    id: dQw4w9WgXcQ
    provider: youtube
---
```

## Cover/Splash Page

Create a dramatic landing page:

```yaml
---
layout: splash
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/banner.jpg
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
excerpt: "This is the excerpt text that appears in the header."
intro: 
  - excerpt: 'Welcome to my awesome site showcasing the Minimal Mistakes theme!'
feature_row:
  - image_path: assets/images/feature1.jpg
    title: "Feature 1"
    excerpt: "Description of feature 1"
---
```

## Overlays

Add overlay effects to images:

```yaml
---
header:
  overlay_image: /assets/images/banner.jpg
  overlay_filter: 0.5 # opacity level
---
```

Or use color overlays:

```yaml
---
header:
  overlay_color: "#333"
---
```

## Custom 404 Page

Create a custom 404 page at `/404.md`:

```yaml
---
layout: single
title: "Page Not Found"
excerpt: "Your page is not here."
sitemap: false
permalink: /404.html
---
```

## Conclusion

These advanced features demonstrate the versatility and power of the Minimal Mistakes theme. Experiment with these options to create a unique and engaging blog experience!
