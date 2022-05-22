import IPatient from './patient';

interface IDiagnosis {
  id: number;
  name: string;
  isMedication: boolean;
  medicineName: string;
  medicineTime: number;
  diagnosisDate: string;
  patient?: {
    id: IPatient['id'];
  };
  creationDate?: string;
  key?: number;
}

export default IDiagnosis;
