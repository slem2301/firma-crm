import {
    FormControl,
    FormControlProps,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputProps,
} from "@chakra-ui/react";
import { Ref, forwardRef } from "react";

interface ChatOptionsInputProps extends InputProps {
    label: string;
    leftAddon?: string;
    helperText?: string;
    clear?: boolean;
}

export const ChatOptionsInput = forwardRef(
    (props: ChatOptionsInputProps, ref: Ref<HTMLInputElement>) => {
        const { label, leftAddon, helperText, clear, ...otherProps } = props;

        const styles: FormControlProps = clear
            ? {}
            : {
                  padding: 3,
                  borderWidth: 1,
                  borderTopWidth: 4,
                  borderTopColor: "blue.200",
              };

        return (
            <FormControl {...styles}>
                <FormLabel>{label}</FormLabel>
                <InputGroup>
                    {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                    <Input placeholder={label} ref={ref} {...otherProps} />
                </InputGroup>
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
);
