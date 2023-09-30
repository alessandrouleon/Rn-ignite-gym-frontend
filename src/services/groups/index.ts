import { api } from "@services/api";

export  const getGroupsService =  async () => {
const response =  await api.get('/groups')
return response.data;
}


