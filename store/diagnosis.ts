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
    };
  },
  actions: {
    setSelectedPatient(patientId: number) {
      const patientStore = usePatientStore();
      patientStore.setSelectedPatient(patientId);
      this.fetchDiagnosisOfPatient();
    },
    setDiagnosis(diagnosis: IDiagnosis) {
      const patientId = diagnosis.patient.id;
      this.diagnosisPatientMap[patientId] = diagnosis;
    },
    async fetchDiagnosisOfPatient(patientId?: IPatient['id']) {
      const sidenavStore = useSidenavStore();
      const patientStore = usePatientStore();
      const toast = useToast();
      const { t } = i18n.global;

      if (!patientId) {
        patientId = patientStore.selectedPatient?.id;
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
      const patientStore = usePatientStore();
      return this.diagnosisPatientMap[patientStore.selectedPatient.id] || [];
    },
    formForUpdate(): Partial<IDiagnosis> {
      return {
        name: this.form.name,
        isMedication: this.form.isMedication,
        medicineName: this.form.medicineName,
        medicineTime: this.form.medicineTime,
        diagnosisDate: this.form.diagnosisDate,
        patient: this.form.patient,
      };
    },
  },
});

export default useDiagnosisStore;
