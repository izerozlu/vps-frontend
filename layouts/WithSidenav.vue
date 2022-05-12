<template>
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
      class="flex flex-col px-12 pb-4 with-sidenav-layout__content overflow-auto"
    >
      <header
        class="flex h-32 w-full top-0 with-sidenav-layout__header header items-center justify-between"
      >
        <h1 class="font-semibold text-3xl header__title">
          {{ sidenavStore.pageTitle }}
        </h1>
        <button
          class="border border-solid rounded-xl flex border-gray-300 p-4 header__logout-button items-center"
          @click="logout()"
        >
          {{ t('logout') }}
          <i class="ml-2 pi pi-sign-out" />
        </button>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import useSidenavStore from '@/store/sidenav';
import useAuthenticationStore from '@/store/authentication';
import ERoutes from '@/enums/routes';

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
</script>

<style lang="scss" scoped>
.with-sidenav-layout :deep(.brand-name__title) {
  @apply text-logo;
}

.with-sidenav-layout__sidenav {
  box-shadow: 18px 4px 35px 0px rgba(0, 0, 0, 0.02);
}

.header__logout-button {
  box-shadow: 18px -5px 35px 18px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: 18px 4px 35px 18px rgba(0, 0, 0, 0.2);
  }
}
</style>

<i18n lang="yaml">
tr:
  logout: Çıkış
</i18n>
