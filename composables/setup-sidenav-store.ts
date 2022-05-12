import ERoutes from '@/enums/routes';
import { useI18n } from 'vue-i18n';
import useSidenavStore from '@/store/sidenav';

const setupSidenavStore = (pageTitle?: string) => {
  const sidenavStore = useSidenavStore();
  const { t } = useI18n();

  sidenavStore.pageTitle = pageTitle;
  sidenavStore.items = [
    {
      label: t('admin'),
      icon: 'dashboard',
      route: ERoutes.ADMIN_BOARD,
    },
  ];
};

export default setupSidenavStore;
