import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Center, Image, Text, VStack, Heading, ScrollView, useToast } from "native-base";
import LogoSVG from "../assets/logo.svg";
import BackgroundImage from "../assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigationRoutesProps } from "@routes/auth.routes";

import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/error/AppError';
import { useState } from 'react';

interface FormeProps {
  email: string;
  password: string;
}

const signInScheme = yup.object({
  email: yup.string().required("Informe o email."),
  password: yup.string().required("Informe a senha.")
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AuthNavigationRoutesProps>();
  const { signIn } = useAuth();
  const toast = useToast();

  const {control, handleSubmit, formState: { errors } } = useForm<FormeProps>({
    resolver: yupResolver(signInScheme)
  });

  async function handleSignIn({ email, password }: FormeProps){
    try {
      setIsLoading(true);
      await signIn(email, password);
    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possivel entrar, tente novamente."
      setIsLoading(false);
      toast.show({
       title,
        placement: "top",
        bgColor: "red.500",
        paddingLeft: "10",
        paddingRight: "10",
      })
    }
  
  }

  function handleNewAccount() {    
    navigation.navigate('signUp');
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImage}
          defaultSource={BackgroundImage}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSVG />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" mb={6} fontSize="xl" fontFamily="heading">
            Acesse sua conta
          </Heading>
          <Controller 
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
           ) }
          />
          <Controller 
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <Input 
            placeholder="Senha"
             secureTextEntry 
             value={value}
             onChangeText={onChange}
             errorMessage={errors.password?.message}
             />
          )}
          />
          <Button title="Entrar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
        </Center>
        <Center mt={24}>
          <Text color="gray.100" mb={3} fontSize="sm" fontFamily="body">
            ainda não tem acesso!
          </Text>
        </Center>
        <Button
          title="Criar conta"
          variant="outline"
          onPress={handleNewAccount}
        />
      </VStack>
    </ScrollView>
  );
}
