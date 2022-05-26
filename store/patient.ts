import { defineStore } from 'pinia';

import IPatient from '@/interfaces/patient';
import IServerResponse from '@/interfaces/server-response';
import useSidenavStore from '@/store/sidenav';
import handleResponse from '@/utils/handle-response';

const usePatientStore = defineStore('patient', {
  state: () => {
    return {
      list: [] as IPatient[],
      form: {} as IPatient,
      query: '',
      selectedPatient: {} as IPatient,
    };
  },
  actions: {
    resetForm() {
      this.form = {};
    },
    setSelectedPatient(patientId: number) {
      const patient = this.list.find((patient) => patient.id === patientId);

      this.selectedPatient = patient || null;
    },
    async fetchPatients() {
      const sidenavStore = useSidenavStore();
      sidenavStore.isLoading = true;
      await handleResponse($fetch('/api/patient/list'), {
        success: (response: IServerResponse) =>
          (this.list = response.data.list),
      });
      sidenavStore.isLoading = false;
    },
  },
  getters: {
    formFullName(): string {
      return `${this.form.name} ${this.form.lastName}`;
    },
  },
});

export default usePatientStore;
