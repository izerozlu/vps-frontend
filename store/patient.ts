import { defineStore } from 'pinia';
import IPatient from '@/interfaces/patient';

const usePatientStore = defineStore('patient', {
  state: () => {
    return {
      list: [] as IPatient[],
      form: {} as IPatient,
    };
  },
  actions: {
    resetForm() {
      this.form = {};
    },
  },
});

export default usePatientStore;
