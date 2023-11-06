import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/userPhoto";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagemPinker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";
import { regexName, regexPassword } from "@utils/regexConstants";
//import { api } from "@services/api";
import { AppError } from "@utils/error/AppError";
import { updateProfile } from "@services/profile";

interface FormDataProps {
  name: string;
  email?: string;
  password: string;
  old_password?: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Informe o nome.")
    .min(3, "Nome dever ter no mínimo 3 dígitos.")
    .matches(regexName, "Nome inválido, permitido apenas letras."),
  old_password: yup
    .string()
    .nullable()
    .transform((value: any) => (!!value ? value : null))
    .matches(
      regexPassword,
      "Senha deve incluir letras maiúsculas, minúsculas, números e caracteres especiais."
    ),
  password: yup.string().when("old_password", {
    is: (oldPassword: any) => oldPassword,
    then: (scheme) =>
      scheme
        .required("Informe a nova senha.")
        .min(6, "Senha deve ter no mínimo, 6 dígitos.")
        .nullable()
        .transform((value: any) => (!!value ? value : null))
        .matches(
          regexPassword,
          "Senha deve incluir letras maiúsculas, minúsculas, números e caracteres especiais."
        ),
  }),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A nova senha não confere.")
    .when("password", {
      is: (Field: any) => Field,
      then: (screen) =>
        screen
          .nullable()
          .transform((value) => (!!value ? value : null))
          .required("Confirme a nova senha."),
    }),
});

const PHOTO_SIZE = 33;

export function Profile() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://avatars.githubusercontent.com/u/58829459?v=4"
  );

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserImageSelect() {
    try {
      setPhotoIsLoading(true);
      const photoselected = await ImagemPinker.launchImageLibraryAsync({
        mediaTypes: ImagemPinker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoselected.canceled) return;

      if (photoselected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoselected.assets[0].uri
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Foto maior que 5MB, não e permitido.",
            placement: "top",
            bgColor: "red.500",
          });
        }
        console.log("aqui", photoInfo);

        setUserPhoto(photoselected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdate(true);
      const userUpdated = user;
      userUpdated.name = data.name;

      await Promise.all([updateProfile(data), updateUserProfile(userUpdated)]);
      toast.show({
        title: "Perfil atualizado com sucesso.",
        placement: "top",
        bgColor: "green.700",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar o perfil.";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdate(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.600"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{
                uri: userPhoto,
              }}
              alt="Imagem do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserImageSelect}>
            <Text color="green.500" fontSize="md" mt={2} mb={10}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors?.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                isDisabled
              />
            )}
          />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={12}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha antiga"
                bgColor="gray.600"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors?.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nova senha"
                bgColor="gray.600"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors?.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Repetir senha"
                bgColor="gray.600"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors?.confirm_password?.message}
              />
            )}
          />
          <Button
            mt={4}
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdate}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
