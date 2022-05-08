<template>
  <div class="dashboard">
    <Card>
      <template #title>
        <h2 class="font-bold text-lg dashboard__title">VPS</h2>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import DashboardSvg from '@/assets/icons/dashboard.svg?component';

import ERoutes from '@/enums/routes';
import useSidenavStore from '@/store/sidenav-items';

const sidenavStore = useSidenavStore();

definePageMeta({
  title: 'VPS Dashboard',
  alias: [ERoutes.DASHBOARD, ERoutes.INDEX],
  middleware: ['redirect-to-dashboard'],
  layout: 'with-sidenav',
});

onMounted(() => {
  sidenavStore.items = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: ERoutes.DASHBOARD,
    },
  ];
});
</script>
