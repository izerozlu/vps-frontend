<template>
  <PatientList is-search />
</template>

<script lang="ts" setup>
import ERoutes from '~~/enums/routes';
import PatientList from '@/pages/patient-list.vue';

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
  alias: ERoutes.SEARCH,
});
</script>
