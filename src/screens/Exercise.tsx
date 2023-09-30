import { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNatigationRouteProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";

export function Exercise() {
  const navigation = useNavigation<AppNatigationRouteProps>();

  function handleGoBack() {
    navigation.goBack();
  }
  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={AntDesign} name="arrowleft" size={6} color="green.500" />
        </TouchableOpacity>
        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading color="gray.100" fontSize="lg" flexShrink={1} fontFamily="heading">
            Puxada frontal
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
     <ScrollView>
      <VStack p={8}>
        <Image
          w="full"
          height={80}
          source={{
            uri: "https://ideogram.ai/api/images/direct/nLhvbRVwQk-TqFwNf4KKew",
          }}
          alt="Imagem do exercício"
          mb={4}
          resizeMode="cover"
          rounded="lg"
        />
        <Box bg="gray.600" pb={4} px={4} rounded="lg">
        <HStack justifyContent="space-around" mb={6} mt={5}>
          <HStack alignItems="center">
            <SeriesSvg />
            <Text color="gray.200" ml={2}>
              3 séries
            </Text>
          </HStack>
          <HStack alignItems="center">
            <RepetitionsSvg />
            <Text color="gray.200" ml={2}>
              12 repetições
            </Text>
          </HStack>
        </HStack>
        <Button title="Marcar como realizado" />
        </Box>
      </VStack>
      </ScrollView>
    </VStack>
  );
}
