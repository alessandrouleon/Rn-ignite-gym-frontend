import { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNatigationRouteProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { AppError } from "@utils/error/AppError";
import { getExercisesByIdService, getExercisesDemo, checkedExerciseAsCompleted } from "@services/exercises";
import { Loading } from "@components/Loading";

interface RouteParamsProps {
  exerciseId: string;
  }

export function Exercise() {
  const navigation = useNavigation<AppNatigationRouteProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const [imageSource, setImageSource] = useState(exercise.demo);
  const [sendigRegister, setSendigRegister] = useState(false);

  const toast = useToast();
  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;
      
 async function  fethExerciseDetails() {
  try {
    setIsLoading(true);
    const response = await getExercisesByIdService(exerciseId);
     setExercise(response.data);
  } catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícos.';
     return toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
     }
     finally {
      setIsLoading(false);
     }
 }

 async function handleExerciseHistoryRegister() {
  try {
    setSendigRegister(true);
    checkedExerciseAsCompleted(exerciseId);
    toast.show({
      title: 'Parabens, exercíco registrado com sucesso no seu histórico.',
      placement: 'top',
      bgColor: 'green.700'
    });

    navigation.navigate('history');
  }catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o exercícos.';
     return toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
     }
     finally {
      setSendigRegister(false);
     }
 }

 const fetchImageSource = async () => {
  const exerciseDemo = await getExercisesDemo(exercise.demo);
  setImageSource(exerciseDemo);
};

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    fethExerciseDetails();
    fetchImageSource();
  }, [exerciseId, exercise.demo]);


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
           {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
             {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
     <ScrollView>
      { isLoading ? <Loading /> : 
      <VStack p={8}>
       
       <Box   rounded="lg" mb={3} overflow="hidden">
       <Image
          w="full"
          height={80}
         source={{uri: imageSource}}
          alt="Imagem do exercício"
          resizeMode="cover"
          rounded="lg"
        />
       </Box>
        <Box bg="gray.600" pb={4} px={4} rounded="lg">
        <HStack justifyContent="space-around" mb={6} mt={5}>
          <HStack alignItems="center">
            <SeriesSvg />
            <Text color="gray.200" ml={2}>
             {exercise.series} séries
            </Text>
          </HStack>
          <HStack alignItems="center">
            <RepetitionsSvg />
            <Text color="gray.200" ml={2}>
             {exercise.repetitions} repetições
            </Text>
          </HStack>
        </HStack>
        <Button
         title="Marcar como realizado" 
         isLoading={sendigRegister}
         onPress={handleExerciseHistoryRegister}
        />
        </Box>
      </VStack>
      }
      </ScrollView>
    </VStack>
  );
}
