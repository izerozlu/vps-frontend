<template>
  <button
    class="rounded-lg cursor-pointer flex font-bold text-base w-full p-5 sidenav-item items-center hover:opacity-75 active:opacity-90"
    :class="{ 'sidenav-item--active bg-american-purple': isActive }"
    type="button"
  >
    <!-- Icon importing resolution is taken from https://github.com/jpkleemans/vite-svg-loader/issues/19#issuecomment-902575584 via https://github.com/MuzafferDede -->
    <component
      class="h-6 mr-8 w-6 sidenav-item__icon"
      :class="{ 'stroke-white': isActive, 'stroke-glossy-grape': !isActive }"
      :is="icon"
    />
    <span
      class="font-semibold mr-6 sidenav-item__label"
      :class="{ 'text-white': isActive, 'text-glossy-gray': !isActive }"
    >
      {{ item.label }}
    </span>
    <RightArrowSvg
      class="h-3 fill-white w-6 sidenav-item__active-indicator"
      v-if="isActive"
    />
  </button>
</template>

<script setup lang="ts">
import RightArrowSvg from '@/assets/icons/right-arrow.svg?component';
import ISidenavItem from '@/interfaces/sidenav-item';
import ERoutes from '~~/enums/routes';

const route = useRoute();

const props = defineProps<{ item: ISidenavItem }>();

// Icon importing resolution is taken from https://github.com/jpkleemans/vite-svg-loader/issues/19#issuecomment-902575584 via https://github.com/MuzafferDede
const icon = computed(() => {
  return defineAsyncComponent(
    () => import(`/assets/icons/${props.item.icon}.svg?component`)
  );
});

const isActive = computed(() => {
  return route.path === props.item.route;
});
</script>
