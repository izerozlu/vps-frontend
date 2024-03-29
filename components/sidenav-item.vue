<template>
  <NuxtLink
    class="rounded-lg cursor-pointer flex font-bold text-base w-full p-5 sidenav-item items-center hover:opacity-75 active:opacity-90"
    :to="item.route"
  >
    <!-- Icon importing resolution is taken from https://github.com/jpkleemans/vite-svg-loader/issues/19#issuecomment-902575584 via https://github.com/MuzafferDede -->
    <component
      class="h-6 mr-8 w-6 sidenav-item__icon stroke-glossy-grape"
      :is="icon"
    />
    <span class="font-semibold mr-6 sidenav-item__label text-glossy-gray">
      {{ item.label }}
    </span>
    <RightArrowSvg
      class="h-3 fill-white w-6 sidenav-item__active-indicator"
      v-if="isActive"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import RightArrowSvg from '@/assets/icons/right-arrow.svg?component';
import ISidenavItem from '@/interfaces/sidenav-item';
import useSidenavStore from '@/store/sidenav';
import ERoutes from '@/enums/routes';

const sidenavStore = useSidenavStore();

const route = useRoute();

const props = defineProps<{ item: ISidenavItem }>();

// Icon importing resolution is taken from https://github.com/jpkleemans/vite-svg-loader/issues/19#issuecomment-902575584 via https://github.com/MuzafferDede
const icon = computed(() => {
  return defineAsyncComponent(
    () => import(`../assets/icons/${props.item.icon}.svg?component`)
  );
});

const isActive = computed(() => {
  return (
    route.path === props.item.route ||
    sidenavStore.routesToActivateAdminItem.includes(route.path as ERoutes)
  );
});
</script>

<style lang="scss">
.router-link-active {
  @apply bg-american-purple;

  .sidenav-item__icon {
    @apply stroke-white;
  }
  .sidenav-item__label {
    @apply text-white;
  }
}
</style>
