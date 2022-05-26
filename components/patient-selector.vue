<template>
  <AntSelect
    id="patient"
    class="patient-selector w-[240px]"
    :placeholder="t('select-patient')"
    :value="patientStore.selectedPatient?.id"
    @select="(patientId) => emit('patient-select', patientId)"
  >
    <AntSelectOption :value="patient.id" v-for="patient in patientStore.list">
      {{ patient.name }} {{ patient.lastName }}
    </AntSelectOption>
  </AntSelect>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import usePatientStore from '@/store/patient';

const { t } = useI18n();

const patientStore = usePatientStore();

const emit = defineEmits<{ (e: 'patient-select', patientId: number): void }>();
</script>

<i18n lang="yaml">
tr:
  select-patient: Hasta Seçiniz
</i18n>
