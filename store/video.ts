import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import IPatient from '@/interfaces/patient';
import handleResponse from '@/utils/handle-response';
import useSidenavStore from '@/store/sidenav';
import { i18n } from '@/plugins/vue-i18n';
import usePatientStore from './patient';
import IVideo from '@/interfaces/video';

const useVideoStore = defineStore('video', {
  state: () => {
    return {
      videoPatientMap: {} as { [patientId: IPatient['id']]: IVideo[] },
      form: {} as IVideo,
      selectedVideo: {} as IVideo
    };
  },
  actions: {
    setSelectedPatient(patientId: number) {
      const patientStore = usePatientStore();
      patientStore.setSelectedPatient(patientId);
      this.fetchVideoOfPatient();
    },
    setSelectedVideo(videoId: number) {
      if (videoId === -1) {
        this.selectedVideo = null;
      } else {
        const video = this.selectedPatientVideoList.find(
          (video) => video.id === videoId
        );

        this.selectedVideo = video || null;
      }
    },
    setVideo(video: IVideo) {
      const patientId = video.patient.id;
      this.videoPatientMap[patientId] = video;
    },
    async fetchVideoOfPatient(patientId?: IPatient['id']) {
      const sidenavStore = useSidenavStore();
      const patientStore = usePatientStore();
      const toast = useToast();
      const { t } = i18n.global;

      if (!patientId) {
        patientId = patientStore.selectedPatient?.id;
      }

      sidenavStore.isLoading = true;
      await handleResponse($fetch(`/api/video/list?patientId=${patientId}`), {
        success: (response) => {
          const videoList: IVideo[] = response.data.list;
          this.videoPatientMap[patientId] = videoList.map((video, index) => ({
            ...video,
            key: index
          }));
        },
        error: () => {
          toast.error(t('error-messages.video.fetch'), { timeout: 0 });
        }
      });
      sidenavStore.isLoading = false;
    },
    resetForm() {
      this.form = {};
    }
  },
  getters: {
    selectedPatientVideoList(): IVideo[] {
      const patientStore = usePatientStore();
      return this.videoPatientMap[patientStore.selectedPatient.id] || [];
    }
  }
});

export default useVideoStore;
