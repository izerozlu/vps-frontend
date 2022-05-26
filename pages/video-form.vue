<template>
  <form
    class="relative video-form overflow-auto"
    :class="{ 'opacity-60 pointer-events-none': isFetching }"
    @submit.prevent
  >
    <!-- TODO [ozlui] add required field validation -->
    <div class="video-form__field h-16 flex items-center">
      <AntTooltip
        :visible="!patientStore.selectedPatient?.id"
        placement="right"
      >
        <template #title>
          <span class="block text-center">
            {{ t('cannot-submit-without-patient') }}
          </span>
        </template>
        <PatientSelector
          :set-selected-patient="patientStore.setSelectedPatient"
          :selected-patient-id="patientStore.selectedPatient?.id"
        />
      </AntTooltip>
    </div>
    <div class="video-form__field">
      <label class="mr-16 video-form__label" for="title">
        {{ t('video.title') }}:
      </label>
      <AntInput
        id="title"
        class="video-form__input"
        v-model:value="videoStore.form.title"
      />
    </div>
    <div class="video-form__field">
      <label class="mr-16 video-form__label" for="saved-date">
        {{ t('patient.saved-date') }}:
      </label>
      <AntDatePicker
        class="video-form__input"
        id="saved-date"
        v-model:value="savedDate"
        :allow-clear="false"
      />
    </div>
    <div class="video-form__field">
      <label class="mr-16 video-form__label" for="file">
        {{ t('video.video') }}:
      </label>
      <AntInput
        id="file"
        class="video-form__input"
        type="file"
        accept="video/*"
        ref="videoFileRef"
        @change="handleVideoFileChange"
      />
    </div>
    <AntTooltip
      class="video-form__submit-button-wrapper"
      placement="left"
      :visible="!patientStore.selectedPatient?.id"
    >
      <template #title>
        <span class="text-center block">
          {{ t('cannot-submit-without-patient') }}
        </span>
      </template>
      <AntButton
        class="video-form__submit-button"
        :class="{ 'video-form__submit-button--fetching': isFetching }"
        :disabled="isFetching || !patientStore.selectedPatient?.id"
        @click="submitForm"
      >
        <CheckCircleOutlined v-if="!isFetching" />
        <LoadingOutlined class="animate-spin mx-4" v-else />
        <span v-if="!isFetching">{{ t('submit') }}</span>
      </AntButton>
    </AntTooltip>
  </form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import dayjs, { Dayjs } from 'dayjs';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useToast } from 'vue-toastification';

import PatientSelector from '@/components/patient-selector.vue';
import usePatientStore from '@/store/patient';
import ERoutes from '@/enums/routes';
import useSidenavStore from '@/store/sidenav';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import useDiagnosisStore from '@/store/diagnosis';
import useVideoStore from '@/store/video';

definePageMeta({
  title: 'Diagnosis Form',
  alias: ERoutes.DIAGNOSIS_FORM,
  layout: 'with-sidenav',
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const diagnosisStore = useDiagnosisStore();
const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();
const videoStore = useVideoStore();

const isFetching = ref(false);
const videoFileRef = ref();

// Computed

const savedDate = computed({
  get: () => {
    return videoStore.form.savedDate
      ? dayjs(videoStore.form.savedDate)
      : undefined;
  },
  set: (value: Dayjs) => {
    videoStore.form.savedDate = value?.format('YYYY-MM-DD HH:mm:ss');
  },
});

// Methods

const handleVideoFileChange = (event: { target: { files: File[] } }) => {
  const video = event.target.files[0];
  videoStore.form.rawFile = video;
};

const submitForm = async () => {
  sidenavStore.isLoading = true;
  isFetching.value = true;

  const data = {
    title: videoStore.form.title,
    patient: { id: patientStore.selectedPatient.id },
    savedDate: videoStore.form.savedDate,
  };
  const file = videoStore.form.rawFile;

  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('file', file, file.name);

  let result;

  // TODO [ozlui] use some constant for the url
  // Cannot send a file via Nuxt server api to backend, therefore directly sending from client
  try {
    const response = await fetch('http://localhost:8090/videos', {
      method: 'POST',
      body: formData,
    });
    result = await response.json();
  } catch (error) {
    toast.error(t('error-messages.unknown'), { timeout: 0 });
    console.error(error);
  }

  if (result?.id) {
    videoStore.resetForm();
    router.push(ERoutes.VIDEO_LIST);
  } else if (result && !result.id) {
    console.error(result);
    toast.error(t('error-messages.video.save'), { timeout: 0 });
  }
  isFetching.value = false;
  sidenavStore.isLoading = false;
};

// Life Cycle Hooks

onMounted(async () => {
  setupSidenavStore(t('video-form'), ERoutes.VIDEO_FORM);
  videoStore.resetForm();
  patientStore.fetchPatients();
});

onUnmounted(() => {
  diagnosisStore.resetForm();
});
</script>

<style lang="scss" scoped>
.video-form__field {
  @apply flex mb-6 w-min min-h-[52px] relative items-center;
}

.video-form__label {
  @apply w-[160px] truncate flex-shrink-0;
}

.video-form__input {
  &:not(.video-form__input--dropdown):not(.video-form__input--checkbox) {
    @apply min-w-[420px];
    box-shadow: 0px 11px 23px 0px #00000005;
  }

  :deep(input) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0px 11px 23px 0px #00000005;
  }
}

.video-form {
  :deep(.video-form__submit-button-wrapper) {
    @apply bottom-8 float-right sticky;
  }
}

.video-form__submit-button {
  @apply bg-primary-purple flex justify-center text-white text-lg items-center;

  &[disabled] {
    @apply bg-gray-200;
  }
}
</style>

<i18n lang="yaml">
tr:
  submit: Gönder
  cannot-submit-without-patient: Hasta seçimi olmadan tanı ekleyemezsiniz.
  video-form: Video Formu
</i18n>