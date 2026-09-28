---
title: Introduction
description: What site-kit is, and what it deliberately is not.
---

site-kit is the layer every Shaharia Lab project site shares on top of
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build).
It is not a framework. Starlight already does routing, search, the sidebar,
Markdown and dark mode; site-kit adds the parts that are specific to our sites:

- **Themes.** The whole look, light and dark, is a theme. Sites pick one in
  config, and a new design is a new theme with no component changes.
- **Page actions.** Copy page, View as Markdown, Open in ChatGPT, Open in
  Claude and Edit on GitHub under every docs title.
- **Markdown twins.** Every docs page is also served as Markdown at the same
  URL plus `.md`.
- **llms.txt.** `/llms.txt`, `/llms-full.txt` and `/llms-small.txt`.

Where a reliable community plugin already exists it is used rather than
rewritten: page actions come from
[starlight-page-actions](https://github.com/dlcastillop/starlight-page-actions)
and the llms.txt files from
[starlight-llms-txt](https://github.com/delucis/starlight-llms-txt).

This site is the kit's own demo. Every page on it is built with the kit.
