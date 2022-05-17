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
      'videos',
    ];

    if (!viableUpdateKeys.includes(key)) {
      delete body[key];
    }
  }

  // TODO [ozlui] handle these two papis
  body.videos = [];
  body.previousDiagnosis = [];

  const response = await fetch(
    `http://localhost:8090/patients/${query.patientId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      method: 'PATCH',
    }
  );
  const result = await response.json();
  return { data: result, status: response.status === 200 ? 'success' : 'fail' };
});
