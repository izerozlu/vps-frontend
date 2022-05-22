<template>
  <AntSelect
    id="patient"
    class="diagnosis-list__patient w-[240px]"
    :placeholder="t('select-patient')"
    :value="diagnosisStore.selectedPatient?.id"
    @select="diagnosisStore.setSelectedPatient"
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

const diagnosisStore = useDiagnosisStore();
const patientStore = usePatientStore();
</script>

<i18n lang="yaml">
tr:
  select-patient: Hasta Seçiniz
</i18n>
