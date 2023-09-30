import { api } from "@services/api";

export  const getExercisesByService =  async (id: string) => {
const response =  await api.get(`/exercises/bygroup/${id}`);
return response;
}

export  const getExercisesThubsService =  async (thumb: string) => {
  const response = `${api.defaults.baseURL}/exercise/thumb/${thumb}` ;
  return response;
  }