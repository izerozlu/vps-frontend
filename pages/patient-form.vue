<template>
  <form
    class="relative patient-form overflow-auto"
    :class="{ 'opacity-60 pointer-events-none': isFetching }"
    @submit.prevent
  >
    <!-- TODO [ozlui] add required field validation -->
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="name">
        {{ t('patient.name') }}:
      </label>
      <AntInput
        id="name"
        class="patient-form__input"
        v-model:value="patientStore.form.name"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="last-name">
        {{ t('patient.last-name') }}:
      </label>
      <AntInput
        id="last-name"
        class="patient-form__input"
        v-model:value="patientStore.form.lastName"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="tckn">
        {{ t('patient.tckn') }}:
      </label>
      <AntInput
        id="tckn"
        class="patient-form__input"
        v-model:value="patientStore.form.tckn"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="birth-date">
        {{ t('patient.birth-date') }}:
      </label>
      <AntDatePicker
        class="patient-form__input"
        id="birth-date"
        v-model:value="birthDate"
        :allow-clear="false"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="age">
        {{ t('patient.age') }}:
      </label>
      <AntInput id="age" class="patient-form__input" v-model:value="age" />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="gender">
        {{ t('patient.gender') }}:
      </label>
      <AntSelect
        id="gender"
        class="patient-form__input"
        v-model:value="patientStore.form.gender"
        :options="genderOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="marital-status">
        {{ t('patient.marital-status') }}:
      </label>
      <AntSelect
        id="marital-status"
        class="patient-form__input"
        v-model:value="patientStore.form.maritalStatus"
        :options="maritalStatusOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="education">
        {{ t('patient.education') }}:
      </label>
      <AntSelect
        id="education"
        class="patient-form__input"
        v-model:value="patientStore.form.education"
        :options="educationOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="profession">
        {{ t('patient.profession') }}:
      </label>
      <AntInput
        id="profession"
        class="patient-form__input"
        v-model:value="patientStore.form.profession"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="salary-range">
        {{ t('patient.salary-range') }}:
      </label>
      <AntSelect
        id="salary-range"
        class="patient-form__input"
        v-model:value="patientStore.form.salaryRange"
        :options="salaryRangeOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="alcohol-usage">
        {{ t('patient.alcohol-usage') }}:
      </label>
      <AntSelect
        id="alcohol-usage"
        class="patient-form__input"
        v-model:value="patientStore.form.alcoholUsage"
        :options="alcoholUsageOptions"
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="use-drugs"
        :title="t('patient.use-drugs')"
      >
        {{ t('patient.use-drugs') }}:
      </label>
      <AntSwitch id="use-drugs" v-model:checked="patientStore.form.useDrugs" />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="is-psychiatry-in-childhood"
        :title="t('patient.is-psychiatry-in-childhood')"
      >
        {{ t('patient.is-psychiatry-in-childhood') }}:
      </label>
      <AntSwitch
        id="is-psychiatry-in-childhood"
        v-model:checked="patientStore.form.isPsychiatryInChildhood"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="psychiatry-time">
        {{ t('patient.psychiatry-time') }}:
      </label>
      <AntInput
        id="psychiatry-time"
        class="patient-form__input"
        v-model:value="psychiatryTime"
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="is-diagnosis-of-hyperactivity-in-childhood"
        :title="t('patient.is-diagnosis-of-hyperactivity-in-childhood')"
      >
        {{ t('patient.is-diagnosis-of-hyperactivity-in-childhood') }}:
      </label>
      <AntSwitch
        id="is-diagnosis-of-hyperactivity-in-childhood"
        v-model:checked="
          patientStore.form.isDiagnosisOfHyperactivityInChildhood
        "
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="hyperactivity-medicine-name"
        :title="t('patient.hyperactivity-medicine-name')"
      >
        {{ t('patient.hyperactivity-medicine-name') }}:
      </label>
      <AntInput
        id="hyperactivity-medicine-name"
        class="patient-form__input"
        v-model:value="patientStore.form.hyperactivityMedicineName"
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="hyperactivity-medicine-time"
      >
        {{ t('patient.hyperactivity-medicine-time') }}:
      </label>
      <AntInput
        id="hyperactivity-medicine-time"
        class="patient-form__input"
        v-model:value="hyperactivityMedicineTime"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="mother-education">
        {{ t('patient.mother-education') }}:
      </label>
      <AntSelect
        id="mother-education"
        class="patient-form__input"
        v-model:value="patientStore.form.motherEducation"
        :options="educationOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="father-education">
        {{ t('patient.father-education') }}:
      </label>
      <AntSelect
        id="father-education"
        class="patient-form__input"
        v-model:value="patientStore.form.fatherEducation"
        :options="educationOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="parenting-attitude">
        {{ t('patient.parenting-attitude') }}:
      </label>
      <AntSelect
        id="parenting-attitude"
        class="patient-form__input"
        v-model:value="patientStore.form.parentingAttitude"
        :options="parentingAttitudeOptions"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="saved-date">
        {{ t('patient.saved-date') }}:
      </label>
      <AntDatePicker
        class="patient-form__input"
        id="saved-date"
        v-model:value="savedDate"
        :allow-clear="false"
      />
    </div>
    <AntButton
      class="patient-form__submit-button"
      :class="{ 'patient-form__submit-button--fetching': isFetching }"
      :disabled="isFetching"
      @click="submitForm"
    >
      <CheckCircleOutlined v-if="!isFetching" />
      <LoadingOutlined class="animate-spin mx-4" v-else />
      <span v-if="!isFetching">{{ t('submit') }}</span></AntButton
    >
  </form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import dayjs, { Dayjs } from 'dayjs';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import usePatientStore from '@/store/patient';
import ERoutes from '@/enums/routes';
import EGender from '@/enums/gender';
import EMaritalStatus from '@/enums/marital-status';
import EEducation from '@/enums/education';
import ESalaryRange from '@/enums/salary-range';
import EAlcoholUsage from '@/enums/alcohol-usage';
import EParentingAttitude from '@/enums/parenting-attitude';
import useSidenavStore from '@/store/sidenav';
import IPatient from '@/interfaces/patient';
import IServerResponse from '@/interfaces/server-response';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '@/utils/handle-response';

definePageMeta({
  title: 'Patient Form',
  alias: ERoutes.PATIENT_FORM,
  layout: 'with-sidenav',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();

const isFetching = ref(false);

const genderOptions = [
  { label: t('gender.male'), value: EGender.MALE },
  { label: t('gender.female'), value: EGender.FEMALE },
];

const maritalStatusOptions = [
  { label: t('marital-status.single'), value: EMaritalStatus.SINGLE },
  { label: t('marital-status.married'), value: EMaritalStatus.MARRIED },
  {
    label: t('marital-status.divorced'),
    value: EMaritalStatus.DIVORCED,
  },
  { label: t('marital-status.widowed'), value: EMaritalStatus.WIDOWED },
];

const educationOptions = [
  {
    label: t('education.primary-school'),
    value: EEducation.PRIMARY_SCHOOL,
  },
  {
    label: t('education.secondary-school'),
    value: EEducation.SECONDARY_SCHOOL,
  },
  { label: t('education.high-school'), value: EEducation.HIGH_SCHOOL },
  { label: t('education.university'), value: EEducation.UNIVERSITY },
  {
    label: t('education.master-of-science'),
    value: EEducation.MASTER_OF_SCIENCE,
  },
  {
    label: t('education.doctor-of-philosophy'),
    value: EEducation.DOCTOR_OF_PHILOSOPHY,
  },
];

const salaryRangeOptions = [
  {
    label: t('salary-range.under-5000'),
    value: ESalaryRange.UNDER_5000,
  },
  {
    label: t('salary-range.between-5000-10000'),
    value: ESalaryRange.BETWEEN,
  },
  {
    label: t('salary-range.above-10000'),
    value: ESalaryRange.ABOVE_10000,
  },
];

const alcoholUsageOptions = [
  {
    label: t('alcohol-usage.never'),
    value: EAlcoholUsage.NEVER,
  },
  {
    label: t('alcohol-usage.sometimes'),
    value: EAlcoholUsage.SOMETIMES,
  },
  {
    label: t('alcohol-usage.often'),
    value: EAlcoholUsage.OFTEN,
  },
  {
    label: t('alcohol-usage.every-day'),
    value: EAlcoholUsage.EVERY_DAY,
  },
  {
    label: t('alcohol-usage.always'),
    value: EAlcoholUsage.ALWAYS,
  },
];

const parentingAttitudeOptions = [
  {
    label: t('parenting-attitude.democratic'),
    value: EParentingAttitude.DEMOCRATIC,
  },
  {
    label: t('parenting-attitude.autocratic'),
    value: EParentingAttitude.AUTOCRATIC,
  },
  {
    label: t('parenting-attitude.over-protective'),
    value: EParentingAttitude.OVER_PROTECTIVE,
  },
  {
    label: t('parenting-attitude.disinterested'),
    value: EParentingAttitude.DISINTERESTED,
  },
];

// Computed

const birthDate = computed({
  get: () => {
    return patientStore.form.birthDate
      ? dayjs(patientStore.form.birthDate)
      : undefined;
  },
  set: (value: Dayjs) => {
    patientStore.form.birthDate = value?.format('YYYY-MM-DD');
  },
});

const age = computed({
  get: () => {
    return patientStore.form.age?.toString();
  },
  set: (value: string) => {
    const numerizedValue = parseInt(value, 10);
    patientStore.form.age = Number.isNaN(parseInt(value, 10))
      ? undefined
      : numerizedValue;
  },
});

const psychiatryTime = computed({
  get: () => {
    return patientStore.form.psychiatryTime?.toString();
  },
  set: (value: string) => {
    const numerizedValue = parseInt(value, 10);
    patientStore.form.psychiatryTime = Number.isNaN(parseInt(value, 10))
      ? undefined
      : numerizedValue;
  },
});

const hyperactivityMedicineTime = computed({
  get: () => {
    return patientStore.form.hyperactivityMedicineTime?.toString();
  },
  set: (value: string) => {
    const numerizedValue = parseInt(value, 10);
    patientStore.form.hyperactivityMedicineTime = Number.isNaN(
      parseInt(value, 10)
    )
      ? undefined
      : numerizedValue;
  },
});

const savedDate = computed({
  get: () => {
    return patientStore.form.savedDate
      ? dayjs(patientStore.form.savedDate)
      : undefined;
  },
  set: (value: Dayjs) => {
    patientStore.form.savedDate = value?.format('YYYY-MM-DD HH:mm:ss');
  },
});

// Methods

const submitForm = async () => {
  const { type } = route.query;
  sidenavStore.isLoading = true;
  isFetching.value = true;
  const callbacks = {
    success: () => {
      patientStore.resetForm();
      router.push(ERoutes.PATIENT_LIST);
    },
  };

  if (type === 'update') {
    await handleResponse(
      $fetch<IServerResponse>(
        `/api/patient/update?patientId=${patientStore.form.id}`,
        {
          body: patientStore.form,
          method: 'PATCH',
        }
      ),
      callbacks
    );
  } else if (type === 'add') {
    await handleResponse(
      $fetch<IServerResponse>('/api/patient/save', {
        body: patientStore.form,
        method: 'POST',
      }),
      callbacks
    );
  }
  isFetching.value = false;
  sidenavStore.isLoading = false;
};

const fetchPatient = async (patientId: string) => {
  isFetching.value = true;
  sidenavStore.isLoading = true;
  await handleResponse(
    $fetch<IServerResponse>(`/api/patient/get?patientId=${patientId}`),
    {
      success: (response: IServerResponse) =>
        (patientStore.form = response.data),
    }
  );
  sidenavStore.isLoading = false;
  isFetching.value = false;
};

// Life Cycle Hooks

onMounted(async () => {
  const { type, patientId } = route.query;

  setupSidenavStore(t('patient-form.default'), ERoutes.PATIENT_FORM);

  if (type === 'update') {
    patientStore.form =
      patientStore.list.find(
        (patient) => patient.id.toString() === patientId
      ) || ({} as IPatient);

    if (patientStore.form.id === undefined) {
      await fetchPatient(patientId as string);
    }

    sidenavStore.pageTitle += ` | ${patientStore.formFullName}`;
  }
});

onUnmounted(() => {
  patientStore.resetForm();
});
</script>

<style lang="scss" scoped>
.patient-form__field {
  @apply flex mb-6 w-min min-h-[52px] relative items-center;
}

.patient-form__label {
  @apply w-[160px] truncate flex-shrink-0;
}

.patient-form__input {
  &:not(.patient-form__input--dropdown):not(.patient-form__input--checkbox) {
    @apply min-w-[420px];
    box-shadow: 0 11px 23px 0 #00000005;
  }

  :deep(input) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0 11px 23px 0 #00000005;
  }
}

.patient-form__submit-button {
  @apply bg-primary-purple flex justify-center text-white text-lg bottom-8 float-right sticky items-center;
}
</style>

<i18n lang="yaml">
tr:
  submit: Gönder
  patient-form:
    default: Hasta Formu
    add: Kayıt
    update: Güncelle
</i18n>
