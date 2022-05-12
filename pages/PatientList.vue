<template>
  <div class="flex flex-col h-min-[200px] w-full patient-list basis-full">
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
        class="bg-jungle-green rounded-xl flex font-semibold ml-auto text-white mr-6 py-4 px-3 patient-list__change-button items-center"
      >
        <i class="mr-3 pi pi-check-circle !text-[20px]" />
        <span class="w-full">{{ t('add') }}</span>
      </button>
      <button
        class="bg-awesome rounded-xl flex font-semibold text-white py-4 px-3 patient-list__change-button items-center"
      >
        <i class="mr-3 pi pi-times-circle !text-[20px]" />
        <span class="w-full">{{ t('change') }}</span>
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
import IPatient from '@/interfaces/patient';
import ERoutes from '~~/enums/routes';

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_LIST,
});

const { t } = useI18n();

const patientStore = usePatientStore();

const searchQuery = ref('');

const { data } = await useFetch<IPatient[]>('/api/patients');
patientStore.list = data.value;

// prettier-ignore
const columns = [
  { field: 'name', header: t('patient-name'), icCompact: true },
  { field: 'lastName', header: t('patient-last-name'), isCompact: true },
  { field: 'tckn', header: t('id-no') },
  { field: 'birthDate', header: t('birth-date') },
  { field: 'age', header: t('age'),isCompact: true },
  { field: 'gender', header: t('gender') ,isCompact: true},
  { field: 'martialStatus', header: t('martial-status') },
  { field: 'education', header: t('education') },
  { field: 'profession', header: t('profession') },
  { field: 'salaryRange', header: t('salary-range') },
  { field: 'medicinesCurrentlyUsed', header: t('medicines-currently-used'),isCompact: true },
  { field: 'alcoholUsage', header: t('alcohol-usage') },
  { field: 'useDrugs', header: t('use-drugs'),isCompact: true },
  { field: 'isPsychiatryInChildhood', header: t('is-psychiatry-in-childhood') },
  { field: 'psychiatryTime', header: t('psychiatry-time') },
  { field: 'isDiagnosisOfHyperactivityInChildhood', header: t('is-diagnosis-of-hyperactivity-in-childhood') ,isCompact: true},
  { field: 'hyperactivityMedicineName', header: t('hyperactivity-medicine-name') },
  { field: 'hyperactivityMedicineTime', header: t('hyperactivity-medicine-time') },
  { field: 'motherEducation', header: t('mother-education') },
  { field: 'fatherEducation', header: t('father-education') },
  { field: 'parentingAttitude', header: t('parenting-attitude') },
  { field: 'savedDate', header: t('saved-date') },
  { field: 'previousDiagnosis', header: t('previous-diagnosis') },
];

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
// Life Cycle Hooks

onMounted(() => setupSidenavStore(t('patient-records')));
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
  martial-status: Medeni Durum
  education: Eğitim
  profession: Meslek
  salary-range: Maaş Aralığı
  medicines-currently-used: Şu Anda Kullanılan İlaçlar
  alcohol-usage: Alkol Kullanımı
  use-drugs: Uyuşturucu Kullanımı
  is-psychiatry-in-childhood: Çocuklukta Psikiatri Tedavisi
  psychiatry-time: Psikiatri Zamanı
  is-diagnosis-of-hyperactivity-in-childhood: Çocuklukta Hyperaktiflik Tanısı
  hyperactivity-medicine-name: Hyperaktiflik İlaç Adı
  hyperactivity-medicine-time: Hyperaktiflik İlaç Zamanı
  mother-education: Anne Eğitimi
  father-education: Baba Eğitimi
  parenting-attitude: Ebeveynlik Davranışı
  saved-date: Kaydedilme Tarihi
  previous-diagnosis: Önceki Tanı
  search: Arama
  change: Değiştir
  add: Ekle
  patient-records: Hasta Kayıtları
</i18n>
