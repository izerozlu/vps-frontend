import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const { 'search-text': searchText } = await useQuery(event);
  return await sendRequest(`/patients/search/${searchText}`);
});
