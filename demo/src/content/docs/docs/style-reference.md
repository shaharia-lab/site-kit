---
title: Style reference
description: Every Markdown element, for checking a theme in light and dark.
---

A page with one of everything, for reviewing a theme. Switch between light and
dark with the toggle in the header.

## Text

Body text with **bold**, _italic_, `inline code` and [a link](/site-kit/docs/).

> A blockquote, used for a pull quote or a note from the author.

### A third-level heading

#### A fourth-level heading

- An unordered list
- with a second item
  - and a nested one

1. An ordered list
2. with a second item

## Code

```ts title="example.ts"
export function greet(name: string): string {
  return `Hello, ${name}`;
}
```

```sh
npm run build
```

## Table

| Column | Another column | A third |
| --- | --- | --- |
| One | Two | Three |
| Four | Five | Six |

## Asides

:::note
A note.
:::

:::tip
A tip.
:::

:::caution
A caution.
:::

:::danger
A danger.
:::
