Frontend Agent Rules
Stack: Next.js (App Router), React, TypeScript, Tailwind CSS.

Architecture:

Default to Server Components for SEO and performance.

Only use the "use client" directive at the top of files that require interactivity (useState, useEffect, onClick).

Styling: Use Tailwind CSS utility classes exclusively. Avoid custom CSS unless absolutely necessary.

Data: Do not hardcode repeated UI elements. Use TypeScript arrays/objects to map data (like services or portfolio items) into reusable components so they can be easily replaced by an API later.

UI Accuracy: Strictly follow the layout, spacing, and hierarchy of the provided visual mockups.
