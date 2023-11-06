import { api } from "@services/api";

interface FormDataProps {
  name?: string;
  password?: string;
  old_password?: string;
}

export const updateProfile = async (data: FormDataProps) => {
 const response = await api.put('/users', data);
 console.log(response);
 return response;
};

export const updateUserPhoto = async (userPhotoUploadForm: any) => {
  await api.patch('/users/avatar', userPhotoUploadForm, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}