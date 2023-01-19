<template>
  <form
    class='relative diagnosis-form overflow-auto'
    :class="{ 'opacity-60 pointer-events-none': isFetching }"
    @submit.prevent
  >
    <!-- TODO [ozlui] add required field validation -->
    <div class='diagnosis-form__field h-16 flex items-center'>
      <AntTooltip
        :visible='!patientStore.selectedPatient?.id'
        placement='right'
      >
        <template #title>
          <span class='block text-center'>
            {{ t('cannot-submit-without-patient') }}
          </span>
        </template>
        <PatientSelector @patient-select='diagnosisStore.setSelectedPatient' />
      </AntTooltip>
    </div>
    <div class='diagnosis-form__field'>
      <label class='mr-16 diagnosis-form__label' for='name'>
        {{ t('diagnosis.name') }}:
      </label>
      <AntInput
        id='name'
        class='diagnosis-form__input'
        v-model:value='diagnosisStore.form.name'
      />
    </div>
    <div class='diagnosis-form__field'>
      <label class='mr-16 diagnosis-form__label' for='medicine-name'>
        {{ t('diagnosis.medicine-name') }}:
      </label>
      <AntInput
        id='medicine-name'
        class='diagnosis-form__input'
        v-model:value='diagnosisStore.form.medicineName'
      />
    </div>
    <div class='diagnosis-form__field'>
      <label class='mr-16 diagnosis-form__label' for='medicine-time'>
        {{ t('diagnosis.medicine-time') }}:
      </label>
      <AntInput
        id='medicine-time'
        class='diagnosis-form__input'
        v-model:value='diagnosisStore.form.medicineTime'
      />
    </div>
    <div class='diagnosis-form__field'>
      <label class='mr-16 diagnosis-form__label' for='diagnosis-date'>
        {{ t('patient.diagnosis-date') }}:
      </label>
      <AntDatePicker
        class='diagnosis-form__input'
        id='diagnosis-date'
        v-model:value='diagnosisDate'
        :allow-clear='false'
      />
    </div>
    <div class='diagnosis-form__field'>
      <label
        class='mr-16 diagnosis-form__label'
        for='is-medication'
        :title="t('patient.is-medication')"
      >
        {{ t('diagnosis.is-medication') }}:
      </label>
      <AntSwitch
        id='is-medication'
        v-model:checked='diagnosisStore.form.isMedication'
      />
    </div>
    <AntTooltip
      class='diagnosis-form__submit-button-wrapper'
      placement='left'
      :visible='!patientStore.selectedPatient?.id'
    >
      <template #title>
        <span class='text-center block'>
          {{ t('cannot-submit-without-patient') }}
        </span>
      </template>
      <AntButton
        class='diagnosis-form__submit-button'
        :class="{ 'diagnosis-form__submit-button--fetching': isFetching }"
        :disabled='isFetching || !patientStore.selectedPatient?.id'
        @click='submitForm'
      >
        <CheckCircleOutlined v-if='!isFetching' />
        <LoadingOutlined class='animate-spin mx-4' v-else />
        <span v-if='!isFetching'>{{ t('submit') }}</span>
      </AntButton>
    </AntTooltip>
  </form>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import dayjs, { Dayjs } from 'dayjs';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import PatientSelector from '@/components/patient-selector.vue';
import usePatientStore from '@/store/patient';
import ERoutes from '@/enums/routes';
import useSidenavStore from '@/store/sidenav';
import IServerResponse from '@/interfaces/server-response';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '@/utils/handle-response';
import useDiagnosisStore from '@/store/diagnosis';
import IDiagnosis from '@/interfaces/diagnosis';

definePageMeta({
  title: 'Diagnosis Form',
  alias: ERoutes.DIAGNOSIS_FORM,
  layout: 'with-sidenav'
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const diagnosisStore = useDiagnosisStore();
const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();

const isFetching = ref(false);

// Computed

const diagnosisDate = computed({
  get: () => {
    return diagnosisStore.form.diagnosisDate
      ? dayjs(diagnosisStore.form.diagnosisDate)
      : undefined;
  },
  set: (value: Dayjs) => {
    diagnosisStore.form.diagnosisDate = value?.format('YYYY-MM-DD HH:mm:ss');
  }
});

// Methods

const submitForm = async () => {
  const { type } = route.query;
  sidenavStore.isLoading = true;
  isFetching.value = true;

  diagnosisStore.form.patient = { id: patientStore.selectedPatient.id };

  if (type === 'update') {
    await handleResponse(
      $fetch<IServerResponse>('/api/diagnosis/update', {
        body: diagnosisStore.formForUpdate,
        method: 'PATCH',
        params: {
          id: diagnosisStore.form.id
        }
      }),
      {
        success: () => {
          diagnosisStore.resetForm();
          router.push(ERoutes.DIAGNOSIS_LIST);
        }
      }
    );
  } else {
    await handleResponse(
      $fetch<IServerResponse>('/api/diagnosis/save', {
        body: diagnosisStore.form,
        method: 'POST'
      }),
      {
        success: () => {
          diagnosisStore.resetForm();
          router.push(ERoutes.DIAGNOSIS_LIST);
        }
      }
    );
  }

  isFetching.value = false;
  sidenavStore.isLoading = false;
};

// Life Cycle Hooks

onMounted(async () => {
  const { type, diagnosisId } = route.query;

  setupSidenavStore(t('diagnosis-form'), ERoutes.DIAGNOSIS_FORM);
  diagnosisStore.resetForm();
  await patientStore.fetchPatients();

  if (type === 'update' && diagnosisId) {
    const selectedPatientId = patientStore.selectedPatient?.id;

    if (selectedPatientId) {
      diagnosisStore.form =
        diagnosisStore.diagnosisPatientMap[selectedPatientId].find(
          (diagnosis) => diagnosis.id === parseInt(diagnosisId.toString())
        ) || ({} as IDiagnosis);

      sidenavStore.pageTitle += ` | ${diagnosisStore.form.name}`;
    }

    if (!diagnosisStore.form.id) {
      router.push(ERoutes.DIAGNOSIS_LIST);
    }
  }
});

onUnmounted(() => {
  diagnosisStore.resetForm();
});
</script>

<style lang='scss' scoped>
.diagnosis-form__field {
  @apply flex mb-6 w-min min-h-[52px] relative items-center;
}

.diagnosis-form__label {
  @apply w-[160px] truncate flex-shrink-0;
}

.diagnosis-form__input {
  &:not(.diagnosis-form__input--dropdown):not(.diagnosis-form__input--checkbox) {
    @apply min-w-[420px];
    box-shadow: 0px 11px 23px 0px #00000005;
  }

  :deep(input) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0px 11px 23px 0px #00000005;
  }
}

.diagnosis-form {
  :deep(.diagnosis-form__submit-button-wrapper) {
    @apply bottom-8 float-right sticky;
  }
}

.diagnosis-form__submit-button {
  @apply bg-primary-purple flex justify-center text-white text-lg items-center;

  &[disabled] {
    @apply bg-gray-200;
  }
}
</style>

<i18n lang='yaml'>
tr:
  submit: Gönder
  cannot-submit-without-patient: Hasta seçimi olmadan tanı ekleyemezsiniz.
  diagnosis-form: Hasta Tanı Formu
</i18n>
