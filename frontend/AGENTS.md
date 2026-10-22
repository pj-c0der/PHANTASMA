Frontend Agent Rules
Stack: Next.js (App Router), React, TypeScript, Tailwind CSS.

Architecture:

Default to Server Components for SEO and performance.

Only use the "use client" directive at the top of files that require interactivity (useState, useEffect, onClick).

Styling: Use Tailwind CSS utility classes exclusively. Avoid custom CSS unless absolutely necessary.

Data: Do not hardcode repeated UI elements. Use TypeScript arrays/objects to map data (like services or portfolio items) into reusable components so they can be easily replaced by an API later.

UI Accuracy: Strictly follow the layout, spacing, and hierarchy of the provided visual mockups.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
