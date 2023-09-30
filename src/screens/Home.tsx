import { useCallback, useEffect, useState } from "react";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base";
import { ExerciseCard } from "@components/ExerciseCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNatigationRouteProps } from "@routes/app.routes";
import { getGroupsService } from "@services/groups";
import { AppError } from "@utils/error/AppError";
import { getExercisesByService } from "@services/exercises";
import { ExerciseDTO } from "@dtos/exerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupsSelected, setGroupsSelected] = useState("antebraço");
  const navigation = useNavigation<AppNatigationRouteProps>();
  
  const toast = useToast();
  function handleOpenExerciseDetails() {
    navigation.navigate("exercise");
  }

  async function fethGroups() {
     try {
        const response = await getGroupsService();
        setGroups(response);
     }catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos na tabela';
     return toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
     }
  }

  async function fethExercisesByGroups() {
    try {
      setIsLoading(true);
      const response = await getExercisesByService(groupsSelected);
     setExercises(response.data);
    }catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';
     return toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
     } finally {
      setIsLoading(false);
     }
  }

  useEffect(() => {
    fethGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fethExercisesByGroups();
  }, [groupsSelected]));

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupsSelected.toUpperCase() === item.toUpperCase()}
            onPress={() => setGroupsSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />
      { isLoading ? <Loading /> :
      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExerciseCard onPress={handleOpenExerciseDetails} data={item}/>}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
     }
    </VStack>
  );
}
