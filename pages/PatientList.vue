<template>
  <div class="flex flex-col h-min-[200px] patient-list basis-full">
    <div class="flex mb-6 patient-list__search-and-actions">
      <div class="bg-white p-input-icon-right patient-list__input-wrapper">
        <InputText
          class="h-14 w-full patient-list__search !border-none !rounded-xl !py-0 !pl-10"
          :placeholder="t('search')"
          v-model="searchQuery"
        />
        <i class="pi pi-search !right-10" />
      </div>
      <button
        class="patient-list__button"
        @click="navigateToPatientForm('add')"
      >
        <i class="mr-2 pi pi-check-circle !text-[20px]" />
        <span class="w-full">{{ t('add') }}</span>
      </button>
    </div>
    <Table
      class="patient-list__table"
      :data="filteredPatients"
      :columns="columns"
      :is-compact="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import usePatientStore from '@/store/patient';
import useSidenavStore from '@/store/sidenav';

import ERoutes from '@/enums/routes';

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_LIST,
});

const { t } = useI18n();
const router = useRouter();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();

const searchQuery = ref('');

// Computed

// This bad boi is creating performance issues because of deeply nested loops. Instead of full text search find some other fix.
const filteredPatients = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return query
    ? patientStore.list.filter(({ name, lastName }) => {
        return (
          name.toLowerCase().includes(query) ||
          lastName.toLowerCase().includes(query)
        );
      })
    : patientStore.list;
});

// Methods

const navigateToPatientForm = (type: 'add' | 'edit', patientId?: number) => {
  router.push({ path: ERoutes.PATIENT_FORM, query: { type, patientId } });
};

const processEnumKey = (key: string | boolean) => {
  return key.toString().toLowerCase().replace(/[_]/g, '-');
};

const generateColumnProcessorFunction = (parentKey: string) => {
  return (value: string) => t(`${parentKey}.${processEnumKey(value)}`);
};

// Life Cycle Hooks

onMounted(async () => {
  setupSidenavStore(t('patient-records'), ERoutes.PATIENT_LIST);
  sidenavStore.isLoading = true;
  const response = await $fetch('/api/patient/list');
  console.log(response);

  if (response.status === 'success') {
    patientStore.list = response.list;
  }
  sidenavStore.isLoading = false;
});

const columns = [
  { field: 'name', header: t('patient.name'), icCompact: true },
  { field: 'lastName', header: t('patient.last-name'), isCompact: true },
  { field: 'tckn', header: t('patient.tckn') },
  { field: 'birthDate', header: t('patient.birth-date') },
  { field: 'age', header: t('patient.age'), isCompact: true },
  {
    field: 'gender',
    header: t('patient.gender'),
    isCompact: true,
    processor: generateColumnProcessorFunction('gender'),
  },
  {
    field: 'maritalStatus',
    header: t('patient.marital-status'),
    processor: generateColumnProcessorFunction('marital-status'),
  },
  {
    field: 'education',
    header: t('patient.education'),
    processor: generateColumnProcessorFunction('education'),
  },
  { field: 'profession', header: t('patient.profession') },
  {
    field: 'salaryRange',
    header: t('patient.salary-range'),
    processor: generateColumnProcessorFunction('salary-range'),
  },
  {
    field: 'medicinesCurrentlyUsed',
    header: t('patient.medicines-currently-used'),
    isCompact: true,
  },
  {
    field: 'alcoholUsage',
    header: t('patient.alcohol-usage'),
    processor: generateColumnProcessorFunction('alcohol-usage'),
  },
  {
    field: 'useDrugs',
    header: t('patient.use-drugs'),
    isCompact: true,
    processor: generateColumnProcessorFunction('boolean'),
  },
  {
    field: 'isPsychiatryInChildhood',
    header: t('patient.is-psychiatry-in-childhood'),
    processor: generateColumnProcessorFunction('boolean'),
  },
  { field: 'psychiatryTime', header: t('patient.psychiatry-time') },
  {
    field: 'isDiagnosisOfHyperactivityInChildhood',
    header: t('patient.is-diagnosis-of-hyperactivity-in-childhood'),
    isCompact: true,
    processor: generateColumnProcessorFunction('boolean'),
  },
  {
    field: 'hyperactivityMedicineName',
    header: t('patient.hyperactivity-medicine-name'),
  },
  {
    field: 'hyperactivityMedicineTime',
    header: t('patient.hyperactivity-medicine-time'),
  },
  {
    field: 'motherEducation',
    header: t('patient.mother-education'),
    processor: generateColumnProcessorFunction('education'),
  },
  {
    field: 'fatherEducation',
    header: t('patient.father-education'),
    processor: generateColumnProcessorFunction('education'),
  },
  {
    field: 'parentingAttitude',
    header: t('patient.parenting-attitude'),
    processor: generateColumnProcessorFunction('parenting-attitude'),
  },
  { field: 'savedDate', header: t('patient.saved-date') },
  { field: 'previousDiagnosis', header: t('patient.previous-diagnosis') },
];
</script>

<style scoped lang="scss">
.patient-list__button {
  @apply bg-primary-purple ml-auto rounded-xl flex font-semibold text-white text-lg py-4 px-6 items-center;
}
</style>

<i18n lang="yaml">
tr:
  search: Arama
  change: Değiştir
  add: Ekle
  patient-records: Hasta Kayıtları
</i18n>
