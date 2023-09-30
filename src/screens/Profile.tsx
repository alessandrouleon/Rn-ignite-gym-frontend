import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/userPhoto";
import * as ImagemPinker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
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

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://avatars.githubusercontent.com/u/58829459?v=4"
  );

  const toast = useToast();

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
            bgColor: "red.500"
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
          <Input bgColor="gray.600" placeholder="Nome" />
          <Input bgColor="gray.600" placeholder="E-mail" isDisabled />

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
          <Input
            placeholder="Senha antiga"
            bgColor="gray.600"
            secureTextEntry
          />
          <Input placeholder="Nova senha" bgColor="gray.600" secureTextEntry />
          <Input
            placeholder="Repetir senha"
            bgColor="gray.600"
            secureTextEntry
          />
          <Button mt={4} title="Atualizar" />
        </Center>
      </ScrollView>
    </VStack>
  );
}
