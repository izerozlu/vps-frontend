import ERoutes from '@/enums/routes';
import useSidenavStore from '@/store/sidenav';
import { useI18n } from 'vue-i18n';

const setupSidenavStore = (
  pageTitle?: string,
  routesToActivateSidenavItem?: ERoutes[] | ERoutes
) => {
  const sidenavStore = useSidenavStore();
  const { t } = useI18n();

  sidenavStore.pageTitle = pageTitle;
  sidenavStore.items = [
    {
      label: t('admin'),
      icon: 'dashboard',
      route: ERoutes.ADMIN_BOARD,
    },
    {
      label: t('search'),
      icon: 'search',
      route: ERoutes.SEARCH,
    },
  ];
  sidenavStore.routesToActivateAdminItem = [routesToActivateSidenavItem].flat();
};

export default setupSidenavStore;
