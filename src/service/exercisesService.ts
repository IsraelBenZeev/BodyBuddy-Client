import axios from 'axios';
const BASE_API_URL = 'https://www.exercisedb.dev/api/v1/bodyparts/';
const bodyPart = 'upper%20arms/exercises';
const LIMIT = 25;

export const getExercisesByBodyPart = async (bodyPart: string, page: number) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}${bodyPart}/exercises?offset=${page * LIMIT}&limit=${LIMIT}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
