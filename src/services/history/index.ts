import { api } from "@services/api";

export const getExerciseHistory = async () => {
 const response = await api.get('/history');
 return response;
};