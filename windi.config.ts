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
      boxShadow: {
        'pretty-one--light': '18px -5px 35px 18px rgba(0, 0, 0, 0.05)',
        'pretty-one': '18px 4px 35px 18px rgba(0, 0, 0, 0.2)',
        'reversed-pretty-one--light':
          '-18px -5px 35px 18px rgba(0, 0, 0, 0.05)',
        'reversed-pretty-one': '-18px -4px 35px 18px rgba(0, 0, 0, 0.2)',
      },
      transitionProperty: {
        'box-shadow': 'box-shadow',
        width: 'width',
      },
    },
  },
});
