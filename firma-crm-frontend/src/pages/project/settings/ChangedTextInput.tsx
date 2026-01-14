import {
    Input,
    InputProps,
    InputRightAddon,
    TextProps,
} from "@chakra-ui/react";
import { forwardRef, LegacyRef, useEffect, useState } from "react";
import InfoText from "./InfoText";
import { FaEdit } from "react-icons/fa";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

type ChangedTextProps = {
    isEdited: boolean;
    text: string;
    renderedText?: JSX.Element;
    textProps?: TextProps;
} & InputProps;

const LENGTH_LIMIT = 36;

export const ChangedText: React.FC<ChangedTextProps> = forwardRef(
    (
        { isEdited, text, textProps, renderedText, ...props },
        ref: LegacyRef<HTMLInputElement>
    ) => {
        const sm = useBreakpoint("sm");

        const defaultFontSize = sm ? 13 : 16;

        const [fontSize, setFontSize] = useState(defaultFontSize);
        const [color, setColor] = useState("inherit");
        const calculateFontSize = (length: number) => {
            if (length >= LENGTH_LIMIT) {
                const newSize = defaultFontSize - (length - LENGTH_LIMIT) * 0.3;
                setFontSize(newSize < 10 ? 10 : newSize);
            }
        };

        const onChange = (e: any) => {
            setColor(
                e.target.value === text
                    ? "inherit"
                    : "var(--chakra-colors-blue-500)"
            );
            calculateFontSize(e.target.value.length);
        };

        const onKeyPress = (e: any) => {
            if (e.key === "Enter") e.preventDefault();
        };

        useEffect(() => {
            setColor("inherit");
        }, [isEdited]);

        useEffect(() => {
            calculateFontSize(text.length);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [text.length]);

        return isEdited ? (
            <>
                <Input
                    ref={ref}
                    {...props}
                    size={{ base: "sm", sm: "md" }}
                    fontSize={fontSize + "px"}
                    borderRightRadius={"0 !important"}
                    onChange={onChange}
                    onKeyDown={onKeyPress}
                />
                <InputRightAddon
                    fontSize={fontSize + "px"}
                    h={{ base: "32px", sm: "40px" }}
                    bg="transparent"
                    children={<FaEdit color={color} />}
                />
            </>
        ) : (
            <InfoText {...textProps}>
                {renderedText ? renderedText : text || "Отключено"}
            </InfoText>
        );
    }
);
