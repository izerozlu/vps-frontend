import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import IDiagnosis from '@/interfaces/diagnosis';
import IPatient from '@/interfaces/patient';
import handleResponse from '@/utils/handle-response';
import useSidenavStore from '@/store/sidenav';
import { i18n } from '@/plugins/vue-i18n';
import usePatientStore from './patient';

const useDiagnosisStore = defineStore('diagnosis', {
  state: () => {
    return {
      diagnosisPatientMap: {} as { [patientId: IPatient['id']]: IDiagnosis[] },
      form: {} as IDiagnosis,
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
      this.fetchDiagnosisOfPatient(patientId);
    },
    setDiagnosis(diagnosis: IDiagnosis) {
      const patientId = diagnosis.patient.id;
      this.diagnosisPatientMap[patientId] = diagnosis;
    },
    async fetchDiagnosisOfPatient(patientId?: IPatient['id']) {
      const sidenavStore = useSidenavStore();
      const toast = useToast();
      const { t } = i18n.global;

      if (!patientId) {
        patientId = this.selectedPatient?.id;
      }

      sidenavStore.isLoading = true;
      await handleResponse(
        $fetch(`/api/diagnosis/list?patientId=${patientId}`),
        {
          success: (response) => {
            const diagnosisList: IDiagnosis[] = response.data.list;
            this.diagnosisPatientMap[patientId] = diagnosisList.map(
              (diagnosis, index) => ({ ...diagnosis, key: index })
            );
          },
          error: () => {
            toast.error(t('error-messages.diagnosis.fetch'), { timeout: 0 });
          },
        }
      );
      sidenavStore.isLoading = false;
    },
    resetForm() {
      this.form = {};
    },
  },
  getters: {
    diagnosisList(): IDiagnosis[] {
      return Object.entries(this.diagnosisPatientMap).reduce(
        (
          diagnosisList: IDiagnosis[],
          [patientId, diagnosis]: [string, IDiagnosis]
        ) => {
          return [...diagnosisList, diagnosis];
        },
        []
      );
    },
    selectedPatientDiagnosisList(): IDiagnosis[] {
      return this.diagnosisPatientMap[this.selectedPatient.id] || [];
    },
  },
});

export default useDiagnosisStore;
