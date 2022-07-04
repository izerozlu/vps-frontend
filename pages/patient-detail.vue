<template>
  <div class="patient-detail">
    <div class="patient-detail__field field">
      <span class="field__label"> {{ t('fields.fullname') }}: </span>
      <span class="field__value">
        {{
          patientStore.patientDetail.name +
          ' ' +
          patientStore.patientDetail.lastName
        }}
      </span>
    </div>
    <div
      class="patient-detail__field field"
      v-for="{ field, translationKey } of fields"
    >
      <span class="field__label"> {{ t(`fields.${translationKey}`) }}: </span>
      <span class="field__value">
        {{ patientStore.patientDetail[field] }}
      </span>
    </div>
    <div class="patient-detail__field field">
      <span class="field__label"> {{ t('fields.diagnosis') }}: </span>
      <span class="field__value">
        {{ diagnosis }}
      </span>
    </div>
    <div class="patient-detail__videos mt-12">
      <span class="patient-detail__videos-header text-2xl font-bold block mb-4">
        {{ t('videos') }}
      </span>
      <div class="patient-detail__video-list flex flex-wrap">
        <div
          class="patient-detail__video video mb-12 mr-8 flex flex-col items-center w-[600px]"
          v-for="video of patientStore.patientDetail.videos"
        >
          <video
            class="video__player rounded-xl w-[600px] rounded-b-none"
            :src="video.fileUrl"
            controls
          />
          <div
            class="video__properties flex flex-col text-base p-3 mx-4 rounded-xl rounded-t-none w-full h-min"
          >
            <span
              class="video__title font-semibold"
              :class="{ 'mb-4': video.videoTagList?.length }"
            >
              {{ video.title }}
            </span>
            <div class="video__tags flex flex-wrap">
              <button
                class="video__tag tag rounded-xl mr-2 mb-2 border-2 border-solid p-2 hover:bg-gray-200 active:bg-gray-300"
                type="button"
                v-for="{ tag, startTime, endTime } of video.videoTagList"
                @click="setCurrentTimeForVideo($event, startTime)"
              >
                <span class="tag__name font-bold mr-2">{{ tag }}:</span>
                <span class="tag__start-time mr-1">{{ startTime }} -</span>
                <span class="tag__end-time">{{ endTime }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import ERoutes from '@/enums/routes';
import usePatientStore from '@/store/patient';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import ITag from '@/interfaces/tag';
import IVideo from '~~/interfaces/video';

const fields = [
  { field: 'birthDate', translationKey: 'birth-date' },
  { field: 'savedDate', translationKey: 'saved-date' },
];

const patientStore = usePatientStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: 'Patient Detail',
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_DETAIL,
});

// Computed

const diagnosis = computed(() => {
  return (
    patientStore.patientDetail?.previousDiagnosis
      ?.map((diagnosis) => diagnosis.name)
      .join(', ') || []
  );
});

// Methods

const sortVideoTags = () => {
  patientStore.patientDetail.videos?.forEach((video) => {
    video.videoTagList = video.videoTagList.sort((tagA: ITag, tagB: ITag) => {
      const [tagAStartMinute, tagAStartSecond] = tagA.startTime.split(':');
      const tagAValue = Number.parseInt(tagAStartMinute) * 60 + tagAStartSecond;
      const [tagBStartMinute, tagBStartSecond] = tagB.startTime.split(':');
      const tagBValue = Number.parseInt(tagBStartMinute) * 60 + tagBStartSecond;

      return tagAValue === tagBValue ? 0 : tagAValue > tagBValue ? 1 : -1;
    });
  });
};

const setCurrentTimeForVideo = (event: MouseEvent, startTime: string) => {
  const videoElement: HTMLVideoElement = (event.target as HTMLButtonElement)
    .closest('.patient-detail__video')
    .querySelector('video');

  const [minute, second] = startTime.split(':');
  videoElement.currentTime =
    Number.parseInt(minute) * 60 + Number.parseInt(second);
};

// Life Cycle Methods

onMounted(async () => {
  setupSidenavStore(t('title'), ERoutes.PATIENT_LIST);
  const { patientId } = route.query;

  if (patientId) {
    await patientStore.fetchPatientDetail(Number.parseInt(patientId as string));
    sortVideoTags();
  } else {
    router.push({
      path: ERoutes.SEARCH,
    });
  }
});
</script>

<style scoped lang="scss">
.field {
  @apply text-base px-6 py-4 w-[420px];

  &:not(:nth-child(4)) {
    @apply border-b border-solid border-b-gray-300;
  }

  &__label {
    @apply mr-2;
  }
}

.video__properties {
  box-shadow: 0 10px 49px 0 rgb(0 0 0 / 13%);
}
</style>

<i18n lang="yaml">
tr:
  title: Hasta Detayı
  fields:
    fullname: Adı Soyadı
    birth-date: Doğum Tarihi
    saved-date: Kayıt Tarihi
    diagnosis: Tanı
  videos: Videolar
</i18n>
