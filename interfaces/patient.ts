import ESalaryRange from '@/enums/salary-range';
import EAlcoholUsage from '@/enums/alcohol-usage';
import EEducation from '@/enums/education';
import EGender from '@/enums/gender';
import EMaritalStatus from '@/enums/marital-status';
import EParentingAttitude from '@/enums/parenting-attitude';
import IDiagnosis from '@/interfaces/diagnosis';

interface IPatient {
  id: number;
  name: string;
  lastName: string;
  tckn: string;
  birthDate: string;
  age: number;
  gender: EGender;
  maritalStatus: EMaritalStatus;
  education: EEducation;
  profession: string;
  salaryRange: ESalaryRange;
  medicinesCurrentlyUsed: string;
  alcoholUsage: EAlcoholUsage;
  useDrugs: boolean;
  isPsychiatryInChildhood: boolean;
  psychiatryTime: number;
  isDiagnosisOfHyperactivityInChildhood: boolean;
  hyperactivityMedicineName: string;
  hyperactivityMedicineTime: number;
  motherEducation: EEducation;
  fatherEducation: EEducation;
  parentingAttitude: EParentingAttitude;
  savedDate: string;
  // TODO [ozlui] Ask Dilsen about how to implement this field for the PatientForm
  previousDiagnosis: IDiagnosis[];
  fullText?: string;
}

export default IPatient;
