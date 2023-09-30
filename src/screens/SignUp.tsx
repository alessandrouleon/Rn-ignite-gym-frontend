import { useNavigation } from "@react-navigation/native";
import {
  Center,
  Image,
  Text,
  VStack,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import LogoSVG from "../assets/logo.svg";
import BackgroundImage from "../assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useForm, Controller } from "react-hook-form";
import { regexName, regexPassword } from "@utils/regexConstants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/error/AppError";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const signUpScheme = yup.object({
  name: yup
    .string()
    .required("Informe o nome.")
    .min(3, "Nome dever ter no mínimo 3 dígitos.")
    .matches(regexName, "Nome inválido, permitido apenas letras."),
  email: yup
    .string()
    .required("Informe o email")
    .min(3, "Email dever ter no mínimo 3 dígitos.")
    .email("E-mail inválido."),
  password: yup
    .string()
    .required("Informe a senha.")
    .min(6, "Senha deve ser maior que 6 dígitos.")
    .matches(
      regexPassword,
      "Senha deve incluir letras maiúsculas, minúsculas, números e caracteres especiais."
    ),
  passwordConfirm: yup
    .string()
    .required("Campo Confirme a senha obrigatório.")
    .oneOf([yup.ref("password"), ""], "A senha não confere."),
});

export function SignUp() {
  const toast = useToast();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpScheme),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await api.post("/users", { name, email, password });
      await signIn(email, password);
      return toast.show({
        title: "Usuário cadastrado com sucesso.",
        placement: "top",
        bgColor: "green.500",
        paddingLeft: "10",
        paddingRight: "10",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar conta!";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
        paddingLeft: "10",
        paddingRight: "10",
      });
    } finally {
      setIsLoading(false);
    }
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
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.passwordConfirm?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          mt={12}
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
