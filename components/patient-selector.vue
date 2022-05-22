<template>
  <AntSelect
    id="patient"
    class="diagnosis-list__patient w-[240px]"
    :placeholder="t('select-patient')"
    :value="selectedPatientId"
    @select="setSelectedPatient"
  >
    <AntSelectOption :value="patient.id" v-for="patient in patientStore.list">
      {{ patient.name }} {{ patient.lastName }}
    </AntSelectOption>
  </AntSelect>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import useDiagnosisStore from '@/store/diagnosis';
import usePatientStore from '@/store/patient';

const { t } = useI18n();

const patientStore = usePatientStore();

const props = defineProps<{
  setSelectedPatient: (patientId: number) => void;
  selectedPatientId: number | string;
}>();
</script>

<i18n lang="yaml">
tr:
  select-patient: Hasta Seçiniz
</i18n>
