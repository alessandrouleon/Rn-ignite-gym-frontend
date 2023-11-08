import { HStack, Heading, Icon, Text, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { UserPhoto } from "./userPhoto";
import { useAuth } from "@hooks/useAuth";
import userPhotoDefault from "../../src/assets/userPhotoDefault.png";
import { getAvatarUser } from "@services/profile";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function HomeHeader() {
  const { user, signOut } = useAuth();
  const [avatarUser, setAvatarUser] = useState(user.avatar);

  const fetchAvatarUser = async () => {
    const avatarUser = await getAvatarUser(user.avatar);
    setAvatarUser(avatarUser);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAvatarUser();
    }, [avatarUser])
  );

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={user.avatar ? { uri: avatarUser } : userPhotoDefault}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
