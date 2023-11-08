import { api } from "@services/api";

interface FormDataProps {
  name?: string;
  password?: string;
  old_password?: string;
}

export const updateProfile = async (data: FormDataProps) => {
 const response = await api.put('/users', data);
 return response;
};

export const updateUserPhoto = async (userPhotoUploadForm: any) => {
 const response = await api.patch('/users/avatar', userPhotoUploadForm, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export const getAvatarUser = async (avatarUser: any) => {
 const response = `${api.defaults.baseURL}/avatar/${avatarUser}`;
  return response;
};
