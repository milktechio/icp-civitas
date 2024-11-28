// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  // Your custom configs here
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  })
  .override('nuxt/vue/rules', {
    rules: {
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': ['warn', { html: { void: 'any' } }],
    },
  });
