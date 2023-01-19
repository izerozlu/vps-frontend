import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  const body = await useBody(event);

  for (let key in body) {
    const viableUpdateKeys = [
      'age',
      'alcoholUsage',
      'birthDate',
      'drugNamesAndAmount',
      'education',
      'fatherEducation',
      'gender',
      'hyperactivityMedicineName',
      'hyperactivityMedicineTime',
      'isDiagnosisOfHyperactivityInChildhood',
      'isMedicationInHyperactivity',
      'isPsychiatryInChildhood',
      'lastName',
      'maritalStatus',
      'medicinesCurrentlyUsed',
      'motherEducation',
      'name',
      'parentingAttitude',
      'profession',
      'psychiatryTime',
      'salaryRange',
      'savedDate',
      'tckn',
      'useDrugs',
      'previousDiagnosis',
      'videos'
    ];

    if (!viableUpdateKeys.includes(key)) {
      delete body[key];
    }
  }

  // TODO [ozlui] handle these two papis
  body.videos = [];
  body.previousDiagnosis = [];

  return await sendRequest(event, `/patients/${query.patientId}`, 'PATCH', body);
});
