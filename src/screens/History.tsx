import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByBayDTO } from "@dtos/HstoryDTO";
import { useFocusEffect } from "@react-navigation/native";
import { getExerciseHistory } from "@services/history";
import { AppError } from "@utils/error/AppError";
import { Heading, SectionList, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { Loading } from "@components/Loading";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [execises, setExercises] = useState<HistoryByBayDTO[]>([]);

  const toast = useToast();

  async function fathHistory() {
    try {
      setIsLoading(true);
     const response =  await getExerciseHistory();
     setExercises(response.data);
      
    }catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';
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

  useFocusEffect(useCallback(() => {
    fathHistory();
  }, []));

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
     { isLoading ? <Loading /> :
      <SectionList
        sections={execises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={execises.length === 0 &&  {flex: 1, justifyContent: 'center'}}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercicios hoje registrado. {'\n '}
            Vamos começar?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />}
    </VStack>
  );
}
