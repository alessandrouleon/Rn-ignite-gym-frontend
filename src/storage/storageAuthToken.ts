import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_USER } from "./storageConfig";

interface StorageTokenRefreshToken {
  token: string;
  refresh_token: string;
}

export async function storageAuthTokenSave({ token, refresh_token }: StorageTokenRefreshToken) {
  await AsyncStorage.setItem(AUTH_TOKEN_USER, JSON.stringify({token, refresh_token}));
}

export async function storageAuthTokenGet() {
 const response = await AsyncStorage.getItem(AUTH_TOKEN_USER);

 const {token, refresh_token}: StorageTokenRefreshToken = response ? JSON.parse(response) : {};
  return {token, refresh_token};
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_USER)
}