import { defineStore } from 'pinia';

const usePatientStore = defineStore('patient', {
	state: () => {
		return {
			list: [],
		};
	},
});

export default usePatientStore;
