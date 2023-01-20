import { defineStore } from 'pinia';

import useVideoStore from '@/store/video';
import useSidenavStore from '@/store/sidenav';
import useAuthenticationStore from '@/store/authentication';

import IPatient from '@/interfaces/patient';
import ITag from '@/interfaces/tag';
import IVideo from '@/interfaces/video';
import IServerResponse from '@/interfaces/server-response';

import handleResponse from '@/utils/handle-response';

const usePatientStore = defineStore('patient', {
  state: () => {
    return {
      list: [] as IPatient[],
      form: {} as IPatient,
      query: '',
      selectedPatient: {} as IPatient,
      patientDetail: {} as IPatient,
      patientVideoTags: {} as {
        [videoId: number]: {
          ownTags: ITag[];
          otherTags: { [username: string]: ITag[] };
        };
      },
    };
  },
  actions: {
    resetForm() {
      this.form = {};
    },
    setSelectedPatient(patientId: number) {
      const videoStore = useVideoStore();
      const patient = this.list.find((patient) => patient.id === patientId);

      this.selectedPatient = patient || null;
      videoStore.setSelectedVideo(-1);
    },
    async fetchPatients() {
      const sidenavStore = useSidenavStore();
      sidenavStore.isLoading = true;
      await handleResponse($fetch('/api/patient/list'), {
        success: (response: IServerResponse) => {
          this.list = response.data.list;
        },
      });
      sidenavStore.isLoading = false;
    },
    async searchPatients(searchText: string) {
      const sidenavStore = useSidenavStore();
      sidenavStore.isLoading = true;
      await handleResponse(
        $fetch(`/api/patient/search?search-text=${searchText}`),
        {
          success: (response: IServerResponse) => {
            return (this.list = response.data.list);
          },
        }
      );
      sidenavStore.isLoading = false;
    },
    async fetchPatientDetail(patientId: number) {
      if (!this.list?.length) {
        await this.fetchPatients();
      }

      this.patientDetail = this.list.find(
        (patient) => patient.id === patientId
      );
      this.setVideoTags();
    },
    resetList() {
      this.list = [];
    },
    setVideoTags() {
      const authenticationStore = useAuthenticationStore();
      const loggedInUsername = authenticationStore.username;

      this.patientDetail.videos.forEach((video: IVideo) => {
        this.patientVideoTags[video.id] = {
          ownTags: video.videoTags.filter(
            (tag: ITag) => tag.user?.username === loggedInUsername
          ),
          otherTags: video.videoTags.reduce(
            (otherTags: { [userId: number]: ITag[] }, tag: ITag) => {
              const tagUsername = tag.user.username;

              if (tag.user?.username !== loggedInUsername) {
                otherTags[tagUsername] = [
                  ...(otherTags[tagUsername] || []),
                  tag,
                ];
              }

              return otherTags;
            },
            {}
          ),
        };
      });
    },
  },
  getters: {
    formFullName(): string {
      return `${this.form.name} ${this.form.lastName}`;
    },
  },
});

export default usePatientStore;
