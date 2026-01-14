import {
    Button,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
} from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ChatOptionsInput } from "./ChatOptionsInput";

interface ChatOptionsConversionProps {
    conversionIdOptions: UseFormRegisterReturn<"conversionId">;
    conversionEventOptions: UseFormRegisterReturn<"conversionEvent">;
}

export const ChatOptionsConversion = (props: ChatOptionsConversionProps) => {
    const { conversionEventOptions, conversionIdOptions } = props;

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={"link"} colorScheme="blue">
                    Конверсии
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader fontWeight={500}>
                        Настройки конверсии
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody
                        display={"flex"}
                        gap={2}
                        flexDirection={"column"}
                    >
                        <ChatOptionsInput
                            clear
                            label="ID Счётчика"
                            {...conversionIdOptions}
                        />
                        <ChatOptionsInput
                            clear
                            label="Название события"
                            {...conversionEventOptions}
                        />
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
