import IPatient from './patient';

interface IDiagnosis {
	name: string;
	isMedicatiton: boolean;
	medicineName: string;
	medicineTime: number;
	diagnosisDate: string;
	patient: {
		id: IPatient['id'];
	};
}

export default IDiagnosis;
