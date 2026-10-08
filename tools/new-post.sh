#!/usr/bin/env bash
#
# Create a new post in _posts/ named YYYY-MM-DD-slug.md from today's date
#
# Usage: bash tools/new-post.sh ["Post Title"]
#        (prompts for the title if not given)

set -eu

POSTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/_posts"
TZ_NAME="Asia/Ho_Chi_Minh" # keep in sync with `timezone` in _config.yml

title="${*:-}"
if [[ -z $title ]]; then
  read -r -p "Post title: " title
fi
if [[ -z $title ]]; then
  echo "Error: title is required." >&2
  exit 1
fi

# lowercase, non-alphanumerics -> '-', trim leading/trailing '-'
slug="$(echo "$title" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || echo "$title")"
slug="$(echo "$slug" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
if [[ -z $slug ]]; then
  echo "Error: could not build a filename slug from title '$title'." >&2
  exit 1
fi

day="$(TZ=$TZ_NAME date +%Y-%m-%d)"
datetime="$(TZ=$TZ_NAME date '+%Y-%m-%d %H:%M:%S %z')"
file="$POSTS_DIR/$day-$slug.md"

if [[ -e $file ]]; then
  echo "Error: $file already exists." >&2
  exit 1
fi

# escape double quotes for the YAML string
yaml_title="${title//\"/\\\"}"

cat >"$file" <<EOF
---
title: "$yaml_title"
description: # one-line summary shown in post list and SEO
date: $datetime
categories: [] # e.g. [Blogging, Tutorial] — max 2 levels
tags: [] # e.g. [jekyll, docker] — lowercase
pin: false # true to pin on the home page
toc: true # table of contents
comments: true
math: false # true to enable MathJax
mermaid: false # true to enable Mermaid diagrams
# author: <id> # needs an entry in _data/authors.yml (default: social.name)
# image:
#   path: /assets/img/posts/$day-$slug/cover.png # recommended 1200x630
#   alt: Cover image description
---

## Introduction

<!-- What is this post about and why it matters. -->

## Main Content

<!-- Body of the post. Add more "##" sections as needed. -->

## Conclusion

<!-- Key takeaways. -->

## References

-
EOF

echo "Created: ${file#"$(pwd)/"}"
