<template>
  <form
    class="relative patient-form overflow-auto"
    :class="{ 'opacity-60 pointer-events-none': isFetching }"
    @submit.prevent="submitForm"
  >
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="name">
        {{ t('patient.name') }}:
      </label>
      <InputText
        id="name"
        class="patient-form__input"
        v-model="patientStore.form.name"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="last-name">
        {{ t('patient.last-name') }}:
      </label>
      <InputText
        id="last-name"
        class="patient-form__input"
        v-model="patientStore.form.lastName"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="tckn">
        {{ t('patient.tckn') }}:
      </label>
      <InputText
        id="tckn"
        class="patient-form__input"
        v-model="patientStore.form.tckn"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="birth-date">
        {{ t('patient.birth-date') }}:
      </label>
      <Calendar
        class="patient-form__input patient-form__input--calendar"
        id="birth-date"
        v-model="birthDate"
        autocomplete="off"
        date-format="yy - mm - dd"
      />
      <i
        class="text-glossy-grape right-4 absolute pi pi-calendar !text-[24px]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="age">
        {{ t('patient.age') }}:
      </label>
      <InputText id="age" class="patient-form__input" v-model="age" />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="gender">
        {{ t('patient.gender') }}:
      </label>
      <Dropdown
        id="gender"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.gender"
        option-label="label"
        option-value="value"
        :options="[
          { label: t('male'), value: EGender.MALE },
          { label: t('female'), value: EGender.FEMALE },
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="martial-status">
        {{ t('patient.martial-status') }}:
      </label>
      <Dropdown
        id="martial-status"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.martialStatus"
        option-label="label"
        option-value="value"
        :options="[
          { label: t('martial-status.single'), value: EMartialStatus.SINGLE },
          { label: t('martial-status.married'), value: EMartialStatus.MARRIED },
          {
            label: t('martial-status.divorced'),
            value: EMartialStatus.DIVORCED,
          },
          { label: t('martial-status.widowed'), value: EMartialStatus.WIDOWED },
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="education">
        {{ t('patient.education') }}:
      </label>
      <Dropdown
        id="education"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.education"
        option-label="label"
        option-value="value"
        :options="[
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
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="profession">
        {{ t('patient.profession') }}:
      </label>
      <InputText
        id="profession"
        class="patient-form__input"
        v-model="patientStore.form.profession"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="salary-range">
        {{ t('patient.salary-range') }}:
      </label>
      <Dropdown
        id="salary-range"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.salaryRange"
        option-label="label"
        option-value="value"
        :options="[
          {
            label: t('salary-range.under-5000'),
            value: ESalaryRange.UNDER_5000,
          },
          {
            label: t('salary-range.between-5000-10000'),
            value: ESalaryRange.BETWEEN_5000_10000,
          },
          {
            label: t('salary-range.above-10000'),
            value: ESalaryRange.ABOVE_10000,
          },
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="alcohol-usage">
        {{ t('patient.alcohol-usage') }}:
      </label>
      <Dropdown
        id="alcohol-usage"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.alcoholUsage"
        option-label="label"
        option-value="value"
        :options="[
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
        ]"
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
      <ToggleButton
        v-model="patientStore.form.useDrugs"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
        :on-label="t('yes')"
        :off-label="t('no')"
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="is-psychiatry-in-childhood"
        :title="t('patient.is-psychiatry-in-childhood')"
      >
        {{ t('patient.is-psychiatry-in-childhood') }}:
      </label>
      <ToggleButton
        v-model="patientStore.form.isPsychiatryInChildhood"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
        :on-label="t('yes')"
        :off-label="t('no')"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="psychiatry-time">
        {{ t('patient.psychiatry-time') }}:
      </label>
      <InputText
        id="psychiatry-time"
        class="patient-form__input"
        v-model="psychiatryTime"
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
      <ToggleButton
        v-model="patientStore.form.isDiagnosisOfHyperactivityInChildhood"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
        :on-label="t('yes')"
        :off-label="t('no')"
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
      <InputText
        id="hyperactivity-medicine-name"
        class="patient-form__input"
        v-model="patientStore.form.hyperactivityMedicineName"
      />
    </div>
    <div class="patient-form__field">
      <label
        class="mr-16 patient-form__label"
        for="hyperactivity-medicine-time"
      >
        {{ t('patient.hyperactivity-medicine-time') }}:
      </label>
      <InputText
        id="hyperactivity-medicine-time"
        class="patient-form__input"
        v-model="hyperactivityMedicineTime"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="mother-education">
        {{ t('patient.mother-education') }}:
      </label>
      <Dropdown
        id="education"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.motherEducation"
        option-label="label"
        option-value="value"
        :options="[
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
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="father-education">
        {{ t('patient.father-education') }}:
      </label>
      <Dropdown
        id="education"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.fatherEducation"
        option-label="label"
        option-value="value"
        :options="[
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
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="parenting-attitude">
        {{ t('patient.parenting-attitude') }}:
      </label>
      <Dropdown
        id="education"
        class="patient-form__input patient-form__input--dropdown"
        v-model="patientStore.form.parentingAttitude"
        option-label="label"
        option-value="value"
        :options="[
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
        ]"
      />
    </div>
    <div class="patient-form__field">
      <label class="mr-16 patient-form__label" for="saved-date">
        {{ t('patient.saved-date') }}:
      </label>
      <Calendar
        class="patient-form__input patient-form__input--calendar"
        id="saved-date"
        v-model="savedDate"
        autocomplete="off"
        date-format="yy - mm - dd"
      />
      <i
        class="text-glossy-grape right-4 absolute pi pi-calendar !text-[24px]"
      />
    </div>
    <button
      class="patient-form__submit-button"
      :class="{ 'patient-form__submit-button--fetching': isFetching }"
      type="submit"
    >
      <i
        class="pi !text-[20px]"
        :class="{
          'pi-spinner animate-spin mx-4': isFetching,
          'pi-check-circle mr-2': !isFetching,
        }"
      />
      <span v-if="!isFetching">{{ t('submit') }}</span>
    </button>
  </form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import usePatientStore from '@/store/patient';
import ERoutes from '@/enums/routes';
import EGender from '@/enums/gender';
import EMartialStatus from '@/enums/martial-status';
import EEducation from '@/enums/education';
import ESalaryRange from '@/enums/salary-range';
import EAlcoholUsage from '@/enums/alcohol-usage';
import EParentingAttitude from '@/enums/parenting-attitude';
import useSidenavStore from '@/store/sidenav';

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

// Computed

const birthDate = computed({
  get: () => {
    return patientStore.form.birthDate
      ? new Date(patientStore.form.birthDate)
      : undefined;
  },
  set: (value: Date) => {
    patientStore.form.birthDate = `${value.getFullYear()}-${
      value.getMonth() + 1 < 10
        ? '0' + (value.getMonth() + 1)
        : value.getMonth() + 1
    }-${value.getDate()}`;
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
      ? new Date(patientStore.form.savedDate)
      : undefined;
  },
  set: (value: Date) => {
    patientStore.form.savedDate = `${value.getFullYear()}-${
      value.getMonth() + 1 < 10
        ? '0' + (value.getMonth() + 1)
        : value.getMonth() + 1
    }-${value.getDate()}`;
  },
});

// Methods

const submitForm = async () => {
  sidenavStore.isLoading = true;
  isFetching.value = true;
  const respone = await $fetch('/api/patient/save', {
    body: patientStore.form,
    method: 'POST',
  });
  isFetching.value = false;
  sidenavStore.isLoading = false;

  if (respone.status === 'success') {
    patientStore.resetForm();
    router.push(ERoutes.PATIENT_LIST);
  }
};

// Life Cycle Hooks

onMounted(() => {
  const { type, patientId } = route.query;

  setupSidenavStore(
    t('patient-form.default') +
      ' | ' +
      t(`patient-form.${type}`) +
      (type === 'update' ? ' | ' + patientId : ''),
    ERoutes.PATIENT_FORM
  );
});
</script>

<style lang="scss" scoped>
.patient-form__field {
  @apply flex mb-6 w-min min-h-[52px] relative items-center;
}

.patient-form__label {
  @apply w-[160px] truncate;
}

.patient-form__input {
  &:not(.patient-form__input--calendar):not(.patient-form__input--dropdown):not(.patient-form__input--checkbox) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0px 11px 23px 0px #00000005;
  }

  &--dropdown {
    @apply border-none min-w-[420px] py-0.5 px-4;
  }

  :deep(input) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0px 11px 23px 0px #00000005;
  }
}

.patient-form__submit-button {
  @apply bg-primary-purple rounded-xl flex justify-center shadow-reversed-pretty-one--light text-white mr-8 text-lg py-4 px-6 transition-box-shadow bottom-8 duration-200 float-right sticky items-center hover:shadow-reversed-pretty-one active:opacity-80;

  &--fetching {
    top: 50%;
  }
}
</style>

<i18n lang="yaml">
tr:
  submit: Gönder
  patient-form:
    default: Hasta Formu
    add: Kayıt
    update: Güncelle
  martial-status:
    single: Bekar
    married: Evli
    divorced: Ayrılmış
    widowed: Dul
  education:
    primary-school: İlkokul
    secondary-school: Ortaokul
    high-school: Lise
    university: Üniversite
    master-of-science: Master
    doctor-of-philosophy: Doktora
  salary-range:
    under-5000: 5000 TL den az
    between-5000-10000: 5000 - 10000 TL arası
    above-10000: 10000 TL den çok
  alcohol-usage:
    never: Hiç
    sometimes: Bazen
    often: Sık sık
    every-day: Her gün
    always: Her zaman
  parenting-attitude:
    democratic: Demokratik
    autocratic: Otonom
    over-protective: Fazla koruyucu
    disinterested: İlgisiz
</i18n>
