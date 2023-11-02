

import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { AntDesign } from '@expo/vector-icons'; 
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { useEffect, useState } from "react";
import { getExercisesThubsService } from "@services/exercises";

interface Props extends TouchableOpacityProps {
  data: ExerciseDTO;
};
export function ExerciseCard({data, ...rest}: Props){
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const fetchImage = async () => {
    try {
      const thumbImageUrl = await getExercisesThubsService(data.thumb);
      setImageUri(thumbImageUrl);
    } catch (error) {
      console.error('Erro ao buscar a URL da imagem:', error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [data.thumb]);


  return (
   <TouchableOpacity {...rest}>
    <HStack bg="gray.500" alignItems="center" p={2} pr={4} mb={3} rounded="md">
      <Image
      source={{uri: imageUri }}
      alt="Exercícios"
      w={16}
      h={16}
      mr={4}
      rounded="md"
      resizeMode="cover"
      />
      <VStack flex={1}>
        <Heading fontSize="lg" color="white" fontFamily="heading" >
        {data.name}
        </Heading>
        <Text fontSize="sm" color="gray.200" mt={1} noOfLines={2}>
        {data.series} séries x {data.repetitions} repetições 
        </Text>
      </VStack>
      <Icon 
      as={AntDesign}
      name="right"
      size={5}
      color="gray.300"
      />
    </HStack>
   </TouchableOpacity>
  );
};