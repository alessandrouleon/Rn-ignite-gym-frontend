import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base";

interface Props extends IInputProps {
  errorMessage?: string | null;
}

export function Input({errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid}  mb={4}>
    <NativeBaseInput
      bgColor="gray.700"
      h={14}
      px={4}
      borderWidth={0}
      color="white"
      fontSize="md"
      fontFamily="body"
      placeholderTextColor="gray.300"
      isInvalid={invalid}
      _invalid={{
        borderWidth: 1,
        borderColor: 'red.500'
      }}
      _focus={{
        borderWidth: 1,
        borderColor: "green.500"
      }}
      {...rest}
    />
    <FormControl.ErrorMessage _text={{color: 'error.500'}}>
    {errorMessage}
    </FormControl.ErrorMessage>
    </FormControl>
  );
}
