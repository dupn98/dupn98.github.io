---
title: "My First Post"
date: 2025-07-09T14:30:00-05:00
categories:
  - Technology
  - Web Development
tags:
  - Jekyll
  - Blogging
layout: single
toc: true
toc_label: "Contents"
toc_icon: "cog"
toc_sticky: true
header:
  image: /_asset/java.png
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
  teaser: /_asset/java.png
sidebar:
  - title: "Role"
    image: /_asset/java.png
    image_alt: "logo"
    text: "Designer, Front-End Developer"
  - title: "Responsibilities"
    text: "Design and development"
---

# Welcome to My Showcase Blog Post!

This blog post demonstrates all the amazing things you can do with a blog powered by Jekyll and the Minimal Mistakes theme.

## Text Formatting

You can write **bold text**, *italic text*, or even ***bold and italic text***. You can also create lists:

- Item one
- Item two
  - Sub-item two

## Code Blocks

Here's an example of Python code:

```python
# Print a greeting message
print("Hello, Jekyll!")
```

And here's some JavaScript:

```javascript
// Log a message to the console
console.log("Hello, Minimal Mistakes!");
```

## Inline Code

You can include inline code snippets like `print("Hello, World!")` in your text.

## Horizontal Rules

Use horizontal rules to separate sections:

---

## Nested Lists

Create complex nested lists:

1. First item
   - Sub-item 1
   - Sub-item 2
2. Second item
   - Sub-item 1
     - Sub-sub-item 1

## Math Equations

You can display math equations using LaTeX:

$$
E = mc^2
$$

And inline math: $e^{i\pi} + 1 = 0$

Or more complex equations:

$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$

## Images

You can include images from your `assets` folder. Here's an example:

![Java Logo](/_asset/java.png)

## Blockquotes

> "The only way to do great work is to love what you do." - Steve Jobs

You can also nest blockquotes:

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

## Tables

You can also create tables:

| Feature       | Description                |
|---------------|----------------------------|
| Markdown      | Write posts in Markdown   |
| Code Highlight| Syntax highlighting for code|

## Links

[Visit Jekyll's official website](https://jekyllrb.com)

## Embedded Videos

You can embed videos too! Here's an example of embedding a YouTube video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

## Custom HTML

You can add custom HTML elements:

<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <p>This is a custom HTML block!</p>
</div>

## Audio Embeds

Embed audio files:

<audio controls>
  <source src="/assets/sample-audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

## Interactive Elements

Add interactive elements like buttons:

<button onclick="alert('Hello, Jekyll!')">Click Me</button>

## Notice Blocks

Minimal Mistakes includes several types of notice blocks that can be used to highlight important information:

**Default Notice:**
{: .notice}
This is a default notice box.

**Primary Notice:**
{: .notice--primary}
This is a primary notice box.

**Info Notice:**
{: .notice--info}
This is an info notice box.

**Warning Notice:**
{: .notice--warning}
This is a warning notice box.

**Success Notice:**
{: .notice--success}
This is a success notice box.

**Danger Notice:**
{: .notice--danger}
This is a danger notice box.

## Feature Row

You can create a "feature row" to showcase multiple items side by side:

{% capture row_text %}
[
  {
    "image_path": "/_asset/java.png",
    "alt": "placeholder image 1",
    "title": "Feature 1",
    "excerpt": "This is a description for the first feature."
  },
  {
    "image_path": "/_asset/java.png",
    "alt": "placeholder image 2",
    "title": "Feature 2",
    "excerpt": "This is a description for the second feature.",
    "url": "https://example.com",
    "btn_label": "Learn More",
    "btn_class": "btn--primary"
  },
  {
    "image_path": "/_asset/java.png",
    "alt": "placeholder image 3",
    "title": "Feature 3",
    "excerpt": "This is a description for the third feature."
  }
]
{% endcapture %}
{% assign feature_row = row_text | jsonify %}

{% include feature_row %}

## Gallery

Create an image gallery:

{% capture gallery_items %}
- url: /_asset/java.png
  image_path: /_asset/java.png
  alt: "Gallery image 1"
  title: "Image 1 Title"
- url: /_asset/java.png
  image_path: /_asset/java.png
  alt: "Gallery image 2"
  title: "Image 2 Title"
- url: /_asset/java.png
  image_path: /_asset/java.png
  alt: "Gallery image 3"
  title: "Image 3 Title"
{% endcapture %}

{% include gallery caption="This is a sample gallery with **Markdown support**." %}

## Responsive Video Embed

Make your video embeds responsive with the `responsive-video-container` class:

<div class="responsive-video-container">
  <iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
</div>

## Buttons

Add buttons with various styles:

[Default Button](#){: .btn}
[Primary Button](#){: .btn .btn--primary}
[Success Button](#){: .btn .btn--success}
[Warning Button](#){: .btn .btn--warning}
[Danger Button](#){: .btn .btn--danger}
[Info Button](#){: .btn .btn--info}
[Inverse Button](#){: .btn .btn--inverse}
[Light Outline Button](#){: .btn .btn--light-outline}

## Conclusion

This post now includes even more features to demonstrate the power of Jekyll and the Minimal Mistakes theme. Explore and customize your blog to make it truly unique!