import { defineStore } from 'pinia';
import IPatient from '~~/interfaces/patient';

const usePatientStore = defineStore('patient', {
  state: () => {
    return {
      list: [] as IPatient[],
    };
  },
});

export default usePatientStore;
