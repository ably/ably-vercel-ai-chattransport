import next from 'eslint-config-next';

// Flat config (ESLint 9+). `eslint-config-next` ships the equivalent of
// `next/core-web-vitals` + `next/typescript` and bundles the .next/out/build
// ignores. `next lint` was removed in Next.js 16, so we run ESLint directly.
const eslintConfig = [
  ...next,
  {
    // The chat app under src/app is a mirror of the upstream SDK demo
    // (ably/ably-ai-transport-js, demo/vercel/react/use-chat). We keep it
    // byte-for-byte rather than forking it to satisfy stylistic or strict
    // React-hooks rules, so these are downgraded to warnings here. Fixes for
    // them belong upstream. See CONTRIBUTING.md.
    rules: {
      'react/no-unescaped-entities': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
];

export default eslintConfig;
