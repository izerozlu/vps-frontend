import ERoutes from '@/enums/routes';
import useSidenavStore from '@/store/sidenav';
import { useI18n } from 'vue-i18n';
import useAuthenticationStore from '@/store/authentication';
import ERole from '@/enums/role';


const setupSidenavStore = (
  pageTitle?: string,
  routesToActivateSidenavItem?: ERoutes[] | ERoutes
) => {
  const authenticationStore = useAuthenticationStore();
  const sidenavStore = useSidenavStore();
  const { t } = useI18n();

  const adminSidenavItem = {
    label: t('admin'),
    icon: 'dashboard',
    route: ERoutes.ADMIN_BOARD
  };

  const searchSidenavItem = {
    label: t('search'),
    icon: 'search',
    route: ERoutes.SEARCH
  };

  sidenavStore.pageTitle = pageTitle;
  sidenavStore.items = [];
  sidenavStore.routesToActivateAdminItem = [routesToActivateSidenavItem].flat();

  if (authenticationStore.role === ERole.EXPERT) {
    sidenavStore.items.push(adminSidenavItem);
  }

  sidenavStore.items.push(searchSidenavItem);
};

export default setupSidenavStore;
