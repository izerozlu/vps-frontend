import { defineNuxtPlugin } from '#app';
import { compileToFunction, registerMessageCompiler } from '@intlify/core-base';

export default defineNuxtPlugin(() => {
  registerMessageCompiler(compileToFunction);
});
