import ERoutes from '@/enums/routes';

interface ISidenavItem {
  label: string;
  icon: string;
  route: ERoutes;
  subItems?: ISidenavItem[];
}

export default ISidenavItem;
