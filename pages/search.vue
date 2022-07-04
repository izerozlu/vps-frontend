<template>
  <PatientList is-search />
</template>

<script lang="ts" setup>
import ERoutes from '@/enums/routes';
import PatientList from '@/pages/patient-list.vue';
import usePatientStore from '~~/store/patient';

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
  alias: ERoutes.SEARCH,
});

const patientStore = usePatientStore();

onMounted(() => {
  patientStore.resetList();
});
</script>
