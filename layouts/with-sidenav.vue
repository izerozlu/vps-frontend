<template>
  <AntConfigProvider :locale="trLocale">
    <div class="bg-lotion flex h-screen w-screen with-sidenav-layout">
      <aside
        class="min-w-[300px] py-10 px-5 with-sidenav-layout__sidenav sidenav"
      >
        <BrandName class="mb-16 with-sidenav-layout__brand-name" />
        <SidenavItem
          class="with-sidenav-layout__sidenav-item"
          v-for="item in sidenavStore.items"
          :key="item.route"
          :item="item"
        />
      </aside>
      <main
        class="flex flex-col w-full px-12 pb-4 with-sidenav-layout__content overflow-auto"
      >
        <header
          class="flex min-h-32 w-full top-0 with-sidenav-layout__header header items-center justify-between relative"
        >
          <h1 class="font-semibold text-3xl header__title">
            {{ sidenavStore.pageTitle }}
          </h1>
          <button
            class="border border-solid rounded-xl flex border-gray-300 shadow-pretty-one--light p-4 transition-shadow duration-200 header__logout-button items-center hover:shadow-pretty-one"
            @click="logout()"
          >
            {{ t('logout') }}
            <i class="ml-2 pi pi-sign-out" />
          </button>
          <ProgressBar mode="indeterminate" v-show="sidenavStore.isLoading" />
        </header>
        <slot />
      </main>
    </div>
  </AntConfigProvider>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// TODO [ozlui] if ever there's a new locale gets introduced, it has to be handled for AntDesign components too
import trLocale from 'ant-design-vue/es/locale/tr_TR';

import useSidenavStore from '@/store/sidenav';
import useAuthenticationStore from '@/store/authentication';
import ERoutes from '@/enums/routes';
import { throttle } from '@antfu/utils';

const sidenavStore = useSidenavStore();
const authenticationStore = useAuthenticationStore();

const { t } = useI18n();
const router = useRouter();

// Methods

const logout = async () => {
  await authenticationStore.logout();
  if (!authenticationStore.isLoggedIn) {
    router.replace(ERoutes.AUTHENTICATION);
  }
};

const calculateTableHeight = (): string => {
  const antTableBody: HTMLElement = document.querySelector('.ant-table-body');
  if (antTableBody) {
    const distanceToAntTableBody = antTableBody.getBoundingClientRect().y;
    const pageBottomPadding = 16;
    return `calc(100vh - ${distanceToAntTableBody + pageBottomPadding}px)`;
  } else {
    return '500px';
  }
};

const setTableHeight = throttle(100, () => {
  sidenavStore.tableBodyHeight = calculateTableHeight();
});

// Life Cycle Hooks

onMounted(async () => {
  router.afterEach(() => {
    sidenavStore.isLoading = false;
  });

  window.addEventListener('resize', setTableHeight);
  await nextTick();
  setTableHeight();
});

onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
</script>

<style lang="scss" scoped>
.with-sidenav-layout :deep(.brand-name__title) {
  @apply text-logo;
}

.with-sidenav-layout__sidenav {
  box-shadow: 18px 4px 35px 0px rgba(0, 0, 0, 0.02);
}
</style>

<i18n lang="yaml">
tr:
  logout: Çıkış
</i18n>
