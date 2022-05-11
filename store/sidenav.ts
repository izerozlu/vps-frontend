import { defineStore } from 'pinia';

import ISidenavItem from '@/interfaces/sidenav-item';

const useSidenavStore = defineStore('sidenav', {
  state: () => {
    return {
      items: [] as ISidenavItem[],
      pageTitle: '',
    };
  },
});

export default useSidenavStore;
