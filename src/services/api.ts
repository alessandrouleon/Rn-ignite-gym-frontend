import { SignIn } from "@screens/SignIn";
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";
import { AppError } from "@utils/error/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type SignOut = () => void;

interface PromiseType {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://192.168.0.18:3333",
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError?.response?.data?.message === "token.invalid" ||
          requestError?.response?.data?.message === "token.expired"
        ) {
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;
          if (isRefreshing) {
            return new Promise((resolver, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolver(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }
          isRefreshing = true;

          return new Promise(async (resolver, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });
              await storageAuthTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });

             if(originalRequestConfig.data){
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
             }

             originalRequestConfig.headers = {'Authorization': `Bearer ${data.token}`};
             api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
             
             failedQueue.forEach(request => {
              request.onSuccess(data.token);
             });
                           
             resolver(api(originalRequestConfig));

            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });
              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }
        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );
  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
