import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import IDiagnosis from '@/interfaces/diagnosis';
import IPatient from '@/interfaces/patient';
import handleResponse from '@/utils/handle-response';
import useSidenavStore from '@/store/sidenav';
import { i18n } from '@/plugins/vue-i18n';
import usePatientStore from './patient';
import IVideo from '~~/interfaces/video';

const useVideoStore = defineStore('video', {
  state: () => {
    return {
      videoPatientMap: {} as { [patientId: IPatient['id']]: IVideo[] },
      form: {} as IVideo,
      selectedPatient: {} as IPatient,
    };
  },
  actions: {
    setSelectedPatient(patientId: number) {
      const patientStore = usePatientStore();
      const patient = patientStore.list.find(
        (patient) => patient.id === patientId
      );

      this.selectedPatient = patient || null;
      this.fetchVideoOfPatient(patientId);
    },
    setVideo(video: IVideo) {
      const patientId = video.patient.id;
      this.videoPatientMap[patientId] = video;
    },
    async fetchVideoOfPatient(patientId?: IPatient['id']) {
      const sidenavStore = useSidenavStore();
      const toast = useToast();
      const { t } = i18n.global;

      if (!patientId) {
        patientId = this.selectedPatient?.id;
      }

      sidenavStore.isLoading = true;
      await handleResponse($fetch(`/api/video/list?patientId=${patientId}`), {
        success: (response) => {
          const videoList: IVideo[] = response.data.list;
          this.videoPatientMap[patientId] = videoList.map((video, index) => ({
            ...video,
            key: index,
          }));
        },
        error: () => {
          toast.error(t('error-messages.diagnosis.fetch'), { timeout: 0 });
        },
      });
      sidenavStore.isLoading = false;
    },
    resetForm() {
      this.form = {};
    },
  },
  getters: {
    diagnosisList(): IVideo[] {
      return Object.entries(this.videoPatientMap).reduce(
        (videoList: IVideo[], [patientId, video]: [string, IVideo]) => {
          return [...videoList, video];
        },
        []
      );
    },
    selectedPatientVideoList(): IVideo[] {
      return this.videoPatientMap[this.selectedPatient.id] || [];
    },
  },
});

export default useVideoStore;
