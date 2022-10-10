import { defineStore } from 'pinia';

import useVideoStore from '@/store/video';
import useSidenavStore from '@/store/sidenav';

import IPatient from '@/interfaces/patient';
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
          // TODO remove this mock
          response.data.list[0].videos[0].videoTagList[1] = {
            id: 99,
            startTime: '00:12',
            creationDate: '2022-10-09 14:19:03',
          };
          response.data.list[0].videos = new Array(5)
            .fill(0)
            .map(() => ({ ...response.data.list[0].videos[0] }));
          // end TODO
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
            // TODO remove this mock
            response.data.list[0].videos[0].videoTagList[1] = {
              id: 99,
              startTime: '00:12',
              creationDate: '2022-10-09 14:19:03',
            };
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
    },
    resetList() {
      this.list = [];
    },
  },
  getters: {
    formFullName(): string {
      return `${this.form.name} ${this.form.lastName}`;
    },
  },
});

export default usePatientStore;
