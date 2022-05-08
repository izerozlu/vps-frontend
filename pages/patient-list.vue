<template>
  <Table :data="patientStore.list" :columns="columns" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import usePatientStore from '@/store/patient';
import IPatient from '@/interfaces/patient';
import useSidenavStore from '@/store/sidenav-items';

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
});

const { t } = useI18n();

const sidenavStore = useSidenavStore();
const patientStore = usePatientStore();
const { data } = await useFetch<IPatient[]>('/api/patients');
patientStore.list = data.value;

const columns = [
  { field: 'name', header: t('patient-name') },
  { field: 'lastName', header: t('patient-last-name') },
  { field: 'tckn', header: t('id-no') },
  { field: 'birthDate', header: t('birth-date') },
  { field: 'age', header: t('age') },
  { field: 'gender', header: t('gender') },
  // TODO [ozlui] continue
];

onMounted(() => setupSidenavStore(sidenavStore, t));
</script>

<style scoped lang="scss"></style>

<i18n lang="yaml">
tr:
  patient-name: Hasta Adı
  patient-last-name: Hasta Soyadı
  birth-date: Doğum Tarihi
  id-no: TC Kimlik No
  age: Yaş
  gender: Cinsiyet
  diagnosis: Tanı
  diagnosis-date: Tanı Tarihi
</i18n>
