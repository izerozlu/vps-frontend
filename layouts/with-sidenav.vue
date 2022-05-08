<template>
  <div class="bg-lotion flex h-full w-full with-sidenav-layout">
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
    <main class="py-16 px-12 with-sidenav-layout__content basis-full">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import useSidenavStore from '@/store/sidenav-items';

const sidenavStore = useSidenavStore();
</script>

<style lang="scss" scoped>
.with-sidenav-layout :deep(.brand-name__title) {
  @apply text-logo;
}

.with-sidenav-layout__sidenav {
  box-shadow: 18px 4px 35px 0px rgba(0, 0, 0, 0.02);
}
</style>
