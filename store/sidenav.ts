import { defineStore } from 'pinia';

import ISidenavItem from '@/interfaces/sidenav-item';
import ERoutes from '@/enums/routes';

const useSidenavStore = defineStore('sidenav', {
  state: () => {
    return {
      items: [] as ISidenavItem[],
      pageTitle: '',
      isLoading: false,
      routesToActivateAdminItem: [] as ERoutes[],
      tableBodyHeight: '',
    };
  },
});

export default useSidenavStore;
