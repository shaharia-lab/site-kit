---
title: Page actions
description: Copy page, View as Markdown, Open in ChatGPT, Open in Claude and Edit on GitHub.
---

Every docs page gets a row of actions under its title:

- **Copy page** copies the page as Markdown, ready to paste into a chat.
- **Open** is a menu with **Open in ChatGPT**, **Open in Claude** and
  **View as Markdown**.
- **Edit on GitHub** opens the page's source file for editing.

The Markdown comes from a twin of each page, generated at build time at the
same URL plus `.md`. For this page that is
[page-actions.md](/site-kit/docs/guides/page-actions.md).

The chat apps are opened with a prompt that points at the page. Change it with
`pageActions.prompt`, where `{url}` is replaced by the page URL:

```js
siteKit({
  theme,
  pageActions: { prompt: 'Read {url} and help me set this up.' },
});
```

Turn single entries off with `chatgpt: false`, `claude: false` or
`markdown: false`, or the whole row with `pageActions: false`. Edit on GitHub
is controlled by `editLink` instead.
