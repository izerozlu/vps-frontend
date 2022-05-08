import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        'primary-purple': '#4F0E67',
        awesome: '#FF2C53',
        'american-purple': '#450B5A',
        'jungle-green': '#209F84',
        'glossy-grape': '#AA97B0',
        'glossy-gray': '#7F7184',
        lotion: '#FBFBFB',
      },
      fontSize: {
        label: ['20px', '32px'],
        logo: ['30px', '45px'],
      },
    },
  },
});
