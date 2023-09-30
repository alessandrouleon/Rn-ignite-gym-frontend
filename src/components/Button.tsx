import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";
interface Props extends IButtonProps {
  title: string;
  variant?: "solid" | "outline";
}
export function Button({ title, variant = "solid", ...rest }: Props) {
  return (
    <NativeBaseButton
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="green.500"
      w="full"
      h={14}
      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? "gray.500" : "green.500",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
