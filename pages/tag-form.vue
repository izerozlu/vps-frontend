<template>
  <form
    class="relative tag-form overflow-auto"
    :class="{ 'opacity-60 pointer-events-none': isFetching }"
    @submit.prevent
  >
    <!-- TODO [ozlui] add required field validation -->
    <div class="tag-form__field h-16 flex items-center">
      <AntTooltip :visible="!patientStore.selectedPatient?.id" placement="top">
        <template #title>
          <span class="block text-center">
            {{ t('cannot-submit-without-patient') }}
          </span>
        </template>
        <PatientSelector
          class="!mr-4"
          @patient-select="tagStore.setSelectedPatient"
        />
      </AntTooltip>
      <AntTooltip
        :visible="
          patientStore.selectedPatient?.id && !videoStore.selectedVideo?.id
        "
        placement="top"
      >
        <template #title>
          <span class="block text-center">
            {{
              patientStore.selectedPatient?.id
                ? t('cannot-submit-without-video')
                : t('cannot-submit-without-patient')
            }}
          </span>
        </template>
        <VideoSelector
          :disabled="!patientStore.selectedPatient?.id"
          @video-select="tagStore.setSelectedVideo"
        />
      </AntTooltip>
    </div>
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="tag">
        {{ t('tag.tag') }}:
      </label>
      <AntInput
        id="tag"
        class="tag-form__input"
        v-model:value="tagStore.form.tag"
      />
    </div>
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="start-time">
        {{ t('tag.start-time') }}:
      </label>
      <AntTimePicker
        class="tag-form__input"
        id="start-time"
        format="mm:ss"
        value-format="mm:ss"
        :clear-icon="false"
        :show-now="false"
        v-model:value="tagStore.form.startTime"
      />
    </div>
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="end-time">
        {{ t('tag.end-time') }}:
      </label>
      <AntTimePicker
        class="tag-form__input"
        id="end-time"
        format="mm:ss"
        value-format="mm:ss"
        :clear-icon="false"
        :show-now="false"
        v-model:value="tagStore.form.endTime"
      />
    </div>
    <AntTooltip
      class="tag-form__submit-button-wrapper"
      placement="left"
      :visible="
        !patientStore.selectedPatient?.id || !videoStore.selectedVideo?.id
      "
    >
      <template #title>
        <span class="text-center block">
          {{
            !patientStore.selectedPatient?.id
              ? t('cannot-submit-without-patient')
              : t('cannot-submit-without-video')
          }}
        </span>
      </template>
      <AntButton
        class="tag-form__submit-button"
        :class="{ 'tag-form__submit-button--fetching': isFetching }"
        :disabled="
          isFetching ||
          !patientStore.selectedPatient?.id ||
          !videoStore.selectedVideo?.id
        "
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
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useToast } from 'vue-toastification';

import useDiagnosisStore from '@/store/diagnosis';
import useVideoStore from '@/store/video';
import usePatientStore from '@/store/patient';
import useSidenavStore from '@/store/sidenav';
import useTagStore from '@/store/tag';

import PatientSelector from '@/components/patient-selector.vue';
import ERoutes from '@/enums/routes';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '~~/utils/handle-response';
import IServerResponse from '~~/interfaces/server-response';
import ITag from '~~/interfaces/tag';

definePageMeta({
  title: 'Diagnosis Form',
  alias: ERoutes.DIAGNOSIS_FORM,
  layout: 'with-sidenav',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();
const videoStore = useVideoStore();
const tagStore = useTagStore();

const isFetching = ref(false);

// Methods

const submitForm = async () => {
  const { type } = route.query;
  sidenavStore.isLoading = true;
  isFetching.value = true;

  tagStore.form.video = { id: videoStore.selectedVideo?.id };
  if (type === 'update') {
    await handleResponse(
      $fetch<IServerResponse>(`/api/tag/update?id=${tagStore.form.id}`, {
        body: tagStore.form,
        method: 'PATCH',
      }),
      {
        success: () => {
          tagStore.resetForm();
          router.push(ERoutes.TAG_LIST);
        },
      }
    );
  } else {
    await handleResponse(
      $fetch<IServerResponse>('/api/tag/save', {
        body: tagStore.form,
        method: 'POST',
      }),
      {
        success: () => {
          tagStore.resetForm();
          router.push(ERoutes.TAG_LIST);
        },
      }
    );
  }
  isFetching.value = false;
  sidenavStore.isLoading = false;
};

// Life Cycle Hooks

onMounted(async () => {
  const { type, tagId } = route.query;
  setupSidenavStore(t('tag-form'), ERoutes.TAG_FORM);
  videoStore.resetForm();
  await patientStore.fetchPatients();

  if (type === 'update' && tagId) {
    const selectedVideoId = videoStore.selectedVideo?.id;

    if (selectedVideoId) {
      tagStore.form =
        tagStore.tagVideoMap[selectedVideoId].find(
          (tag) => tag.id === parseInt(tagId.toString())
        ) || ({} as ITag);

      sidenavStore.pageTitle += ` | ${tagStore.form.tag}`;
    }

    if (!tagStore.form.id) {
      router.push(ERoutes.TAG_LIST);
    }
  }
});

onUnmounted(() => {
  tagStore.resetForm();
});
</script>

<style lang="scss" scoped>
.tag-form__field {
  @apply flex mb-6 w-min min-h-[52px] relative items-center;
}

.tag-form__label {
  @apply w-[160px] truncate flex-shrink-0;
}

.tag-form__input {
  &:not(.tag-form__input--dropdown):not(.tag-form__input--checkbox) {
    @apply min-w-[420px];
    box-shadow: 0px 11px 23px 0px #00000005;
  }

  :deep(input) {
    @apply border-none min-w-[420px] py-4 px-8;
    box-shadow: 0px 11px 23px 0px #00000005;
  }
}

.tag-form {
  :deep(.tag-form__submit-button-wrapper) {
    @apply bottom-8 float-right sticky;
  }
}

.tag-form__submit-button {
  @apply bg-primary-purple flex justify-center text-white text-lg items-center;

  &[disabled] {
    @apply bg-gray-200;
  }
}
</style>

<i18n lang="yaml">
tr:
  submit: Gönder
  cannot-submit-without-patient: Hasta seçimi olmadan etiket ekleyemezsiniz.
  cannot-submit-without-video: Video seçimi olmadan etiket ekleyemezsiniz.
  tag-form: Etiket Formu
</i18n>
