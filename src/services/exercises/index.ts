import { api } from "@services/api";
import { string } from "yup";

export const getExercisesByService = async (id: string) => {
  const response = await api.get(`/exercises/bygroup/${id}`);
  return response;
};

export const getExercisesThubsService = async (thumb: string) => {
  const response = `${api.defaults.baseURL}/exercise/thumb/${thumb}`;
  return response;
};

export const getExercisesByIdService = async (id: string) => {
  const response = await api.get(`/exercises/${id}`);
  return response;
};

export const getExercisesDemo = async (demo: string) => {
  const response = `${api.defaults.baseURL}/exercise/demo/${demo}`;
  return response;
};

export const checkedExerciseAsCompleted = async (exerciseId: string) => {
  await api.post('/history', {exercise_id: exerciseId});
};
