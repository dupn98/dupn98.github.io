---
title: "Splash Page Demo"
layout: splash
permalink: /splash/
date: 2025-08-21T11:48:41-04:00
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /_asset/java.png
  actions:
    - label: "Learn More"
      url: "https://github.com/mmistakes/minimal-mistakes/"
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
excerpt: "This is a splash page demo showing how you can create a dramatic landing page with Minimal Mistakes."
intro: 
  - excerpt: 'Welcome to this showcase of the splash page layout. The splash page is perfect for landing pages and dramatic introductions to your content.'
feature_row:
  - image_path: /_asset/java.png
    alt: "placeholder image 1"
    title: "Feature 1"
    excerpt: "This is a sample feature with some information."
  - image_path: /_asset/java.png
    alt: "placeholder image 2"
    title: "Feature 2"
    excerpt: "This is a sample feature with a button."
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /_asset/java.png
    alt: "placeholder image 3"
    title: "Feature 3"
    excerpt: "Another feature with a button."
    url: "#test-link"
    btn_label: "Learn More"
    btn_class: "btn--primary"
---

{% include feature_row id="intro" type="center" %}

# Main Content Area

This is where your main content would go on a splash page. You can add as much content as you want here.

{% include feature_row %}

## More Sections

You can continue adding more content and feature rows throughout the page.

{% include feature_row id="feature_row" type="left" %}

{% include feature_row id="feature_row" type="right" %}

{% include feature_row id="feature_row" type="center" %}
