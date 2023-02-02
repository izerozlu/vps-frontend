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
      <div
        class="patient-detail__video-list flex flex-wrap"
        :class="{ 'flex-col': isUserExpert }"
      >
        <div
          class="patient-detail__video video mb-12 mr-8 flex"
          :class="{
            'w-full': isUserExpert,
            'w-[600px] flex-col items-center': !isUserExpert,
          }"
          v-for="(video, index) of patientStore.patientDetail.videos"
        >
          <div
            class="video__left-column min-w-[600px] w-[600px]"
            :class="{ 'w-full': !isUserExpert }"
          >
            <!-- TODO [ozlui] :src="video.fileUrl" -->
            <video
              class="video__player rounded-xl rounded-b-none"
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              controls
              @play="
                (event) => activateVideo({ video, event, refIndex: index })
              "
              ref="videoRefs"
            />
            <div
              class="video__properties flex flex-col text-base p-3 rounded-xl rounded-t-none w-full h-min"
            >
              <div
                class="video__header flex justify-between"
                :class="{
                  'mb-4':
                    patientStore.patientVideoTags[video.id]?.ownTags?.length,
                }"
              >
                <span class="video__title font-semibold">
                  {{ video.title }}
                </span>
                <button
                  class="video__add-tag-button px-2 py-1 border border-primary-purple rounded hover:bg-primary-purple hover:text-white"
                  @click="(event) => manualAddTag(event, video)"
                >
                  {{ t('new-tag') }}
                </button>
              </div>
              <div class="video__tags video__tags flex flex-wrap">
                <VideoTag
                  :tag="tag"
                  v-for="tag of patientStore.patientVideoTags[video.id]
                    ?.ownTags"
                  @activate-tag="(event) => activateTag({ tag, video, event })"
                />
              </div>
            </div>
          </div>
          <div
            class="video__right-column video__other-tags px-8 flex flex-col"
            v-if="isUserExpert"
          >
            <div
              class="other-tags__row mb-4"
              v-for="(tags, username) of patientStore.patientVideoTags[video.id]
                ?.otherTags"
            >
              <span
                class="other-tags__username mb-2 block underline underline-dark-400 font-bold"
              >
                {{ username }}
              </span>
              <VideoTag
                class="other-tags__tag bg-white"
                :tag="tag"
                v-for="tag of tags"
                @activate-tag="(event) => activateTag({ tag, video, event })"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <TagRegistrationModal
      :tag="tagRegistration.tag"
      :video="tagRegistration.video"
      :visible="tagRegistration.visible"
      @cancel="cancelTagRegistration"
      @save="saveTagRegistration"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import ERoutes from '@/enums/routes';
import usePatientStore from '@/store/patient';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import ITag from '@/interfaces/tag';
import IVideo from '@/interfaces/video';
import TagRegistrationModal from '@/components/tag-registration-modal.vue';
import handleResponse from '@/utils/handle-response';
import IServerResponse from '@/interfaces/server-response';
import useAuthenticationStore from '@/store/authentication';
import ERole from '@/enums/role';

const fields = [
  { field: 'birthDate', translationKey: 'birth-date' },
  { field: 'savedDate', translationKey: 'saved-date' },
];

const patientStore = usePatientStore();
const authenticationStore = useAuthenticationStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

definePageMeta({
  title: 'Patient Detail',
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_DETAIL,
});

const videoRefs = ref<HTMLVideoElement[]>();

const activeVideo = ref<
  Partial<{
    video: IVideo;
    element: HTMLVideoElement;
    previousElement: HTMLVideoElement;
  }>
>();
const tagRegistration = ref<{
  tag?: ITag;
  video?: IVideo;
  visible: boolean;
}>({ visible: false });

// Computed

const isUserExpert = computed(() => authenticationStore.role === ERole.EXPERT);

const diagnosis = computed(() => {
  return (
    patientStore.patientDetail?.previousDiagnosis
      ?.map((diagnosis) => diagnosis.name)
      .join(', ') || []
  );
});

const newTagsOfActiveVideo = computed(() => {
  return activeVideo.value.video.videoTags.filter(
    (tag) => !tag.tag || !tag.endTime
  );
});

// Methods

const sortVideoTags = () => {
  patientStore.patientDetail.videos?.forEach((video) => {
    video.videoTags = video.videoTags.sort((tagA: ITag, tagB: ITag) => {
      const tagAValue = humanReadableToSeconds(tagA.startTime);
      const tagBValue = humanReadableToSeconds(tagB.startTime);

      return tagAValue === tagBValue ? 0 : tagAValue > tagBValue ? 1 : -1;
    });
  });
};

const humanReadableToSeconds = (humanReadable: string): number => {
  const [hours, minutes, seconds] = humanReadable.split(':');
  return (
    Number.parseInt(hours) * 3600 +
    Number.parseInt(minutes) * 60 +
    Number.parseInt(seconds)
  );
};

const secondsToHumanReadable = (amount: number): string => {
  const hours = Math.floor(amount / 3600);
  const minutes = Math.floor((amount - hours * 3600) / 60);
  const seconds = amount - hours * 3600 - minutes * 60;

  return `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }:${seconds < 10 ? '0' + seconds : seconds}`;
};

const activateTag = ({
  tag,
  video,
  event,
}: {
  video: IVideo;
  tag: ITag;
  event: MouseEvent;
}) => {
  setCurrentTimeForVideo(event, tag.startTime);
  if (!tag.tag || !tag.endTime) {
    registerTag(tag, video);
  }
};

const setCurrentTimeForVideo = (event: MouseEvent, startTime: string) => {
  const videoElement: HTMLVideoElement = (event.target as HTMLButtonElement)
    .closest('.patient-detail__video')
    .querySelector('video');

  videoElement.currentTime = humanReadableToSeconds(startTime);
};

const registerTag = (tag: ITag, video: IVideo) => {
  tagRegistration.value = {
    tag: { ...tag },
    video,
    visible: true,
  };
};

const cancelTagRegistration = () => {
  tagRegistration.value.visible = false;
};

const saveTagRegistration = (tag: ITag) => {
  const isNewTag = !tag.id;
  if (isNewTag) {
    handleResponse(
      $fetch<IServerResponse>('/api/tag/save', {
        body: { ...tag },
        method: 'POST',
      }),
      {
        success: (response) => {
          if (tagRegistration.value.video) {
            const videoToAddTag = patientStore.patientDetail.videos.find(
              (video) => video.id === tagRegistration.value.video.id
            );
            const savedTag = response.data;
            if (videoToAddTag && savedTag) {
              videoToAddTag.videoTags.push(savedTag);
              patientStore.setVideoTags();
            }
          }
        },
      }
    );
  } else {
    handleResponse(
      $fetch<IServerResponse>(`/api/tag/update?id=${tag.id}`, {
        body: { ...tag, video: { id: tagRegistration.value.video.id } },
        method: 'PATCH',
      }),
      {
        success: () => {
          if (tagRegistration.value.video) {
            const indexOfTag = tagRegistration.value.video.videoTags.findIndex(
              (tag) => tag.id === tagRegistration.value.tag.id
            );
            tagRegistration.value.video.videoTags[indexOfTag] = tag;
          }
        },
      }
    );
  }
  cancelTagRegistration();
};

const activateVideo = ({
  video,
  refIndex,
  event,
}: {
  video: IVideo;
  refIndex: number;
  event: Event;
}) => {
  stopOtherVideos(event);
  activeVideo.value = {
    video,
    element: videoRefs.value[refIndex],
    previousElement: activeVideo.value?.element,
  };
  initializeNewTagListener();
};

const stopOtherVideos = (event: Event) => {
  videoRefs.value.forEach((videoElement: HTMLVideoElement) => {
    if (videoElement !== event.target) {
      videoElement.pause();
    }
  });
};

const initializeNewTagListener = () => {
  activeVideo.value.previousElement?.removeEventListener(
    'timeupdate',
    listenForNewTag
  );

  activeVideo.value.element.addEventListener('timeupdate', listenForNewTag);
};

const listenForNewTag = () => {
  if (isUserExpert.value && !tagRegistration.value.visible) {
    const newTagToRegister = newTagsOfActiveVideo.value
      .filter((tag) => {
        const startTimeInSeconds = humanReadableToSeconds(tag.startTime);
        return (
          !tag.checkedForRegistration &&
          activeVideo.value.element.currentTime >= startTimeInSeconds &&
          activeVideo.value.element.currentTime - startTimeInSeconds <= 1
        );
      })
      ?.pop();

    if (newTagToRegister && !newTagToRegister?.checkedForRegistration) {
      activeVideo.value.element.pause();
      newTagToRegister.checkedForRegistration = true;
      registerTag(newTagToRegister, activeVideo.value.video);
    }
  }
};

const manualAddTag = (event: MouseEvent, video: IVideo) => {
  const videoElement: HTMLVideoElement = (event.target as HTMLButtonElement)
    .closest('.patient-detail__video')
    .querySelector('video');

  const tag: ITag = {
    tag: '',
    startTime: secondsToHumanReadable(videoElement.currentTime),
    endTime: '',
    video: { id: video.id },
  };

  registerTag(tag, video);
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
  new-tag: Yeni Etiket
</i18n>
