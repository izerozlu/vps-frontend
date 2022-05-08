<template>
	<ul>
		<li v-for="patient in patientStore.list">
			{{ patient }}
		</li>
	</ul>
</template>

<script setup lang="ts">
import usePatientStore from '@/store/patient';
import IPatient from '@/interfaces/patient';

const patientStore = usePatientStore();
const { data } = await useFetch<IPatient[]>('/api/patients');
patientStore.list = data.value;
</script>
