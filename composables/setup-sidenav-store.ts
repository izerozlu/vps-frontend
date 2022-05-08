import ERoutes from '@/enums/routes';

const setupSidenavStore = (sidenavStore, t) => {
  sidenavStore.items = [
    {
      label: t('dashboard'),
      icon: 'dashboard',
      route: ERoutes.DASHBOARD,
    },
  ];
};

export default setupSidenavStore;
