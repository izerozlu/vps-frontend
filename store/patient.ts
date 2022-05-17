import { defineStore } from 'pinia';
import IPatient from '@/interfaces/patient';

const usePatientStore = defineStore('patient', {
  state: () => {
    return {
      list: [] as IPatient[],
      form: {} as IPatient,
      query: '',
    };
  },
  actions: {
    resetForm() {
      this.form = {};
    },
  },
  getters: {
    formFullName(): string {
      return `${this.form.name} ${this.form.lastName}`;
    },
  },
});

export default usePatientStore;
