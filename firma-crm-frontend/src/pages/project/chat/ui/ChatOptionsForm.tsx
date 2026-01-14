import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import { ChatOptionsInput } from "./ChatOptionsInput";
import { useForm } from "react-hook-form";
import { IChatOptions } from "../model/types/chatOptions";
import { options } from "../model/types/optionInputs";
import { useCallback, useId, useState } from "react";
import { ChatOptionsConversion } from "./ChatOptionsConversion";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getProjectLoading } from "../model/selectors";
import { updateProjectOptions } from "../model/services/updateProjectOptions";

interface ChatOptionsFormProps {
    projectOptions: IChatOptions;
    defaultOptions: IChatOptions;
    projectId: number;
}

export const ChatOptionsForm = (props: ChatOptionsFormProps) => {
    const { projectOptions, defaultOptions, projectId } = props;
    const projectLoading = useAppSelector(getProjectLoading);
    const [helpText, setHelpText] = useState(false);
    const switchId = useId();
    const dispatch = useAppDispatch();

    const isDisabled = projectLoading;

    const {
        register,
        handleSubmit: onSubmit,
        setValue,
    } = useForm({
        mode: "onBlur",
        defaultValues: projectOptions,
    });

    const handleReset = useCallback(() => {
        Object.keys(defaultOptions).forEach((key) => {
            const typedKey = key as keyof IChatOptions;
            if (typedKey === "conversionEvent") return;
            if (typedKey === "conversionId") return;
            setValue(typedKey, defaultOptions[typedKey]);
        });
    }, [defaultOptions, setValue]);

    const handleSubmit = useCallback(
        (data: IChatOptions) => {
            dispatch(
                updateProjectOptions({
                    ...data,
                    projectId,
                })
            );
        },
        [dispatch, projectId]
    );

    return (
        <VStack spacing={3} align="flex-stretch">
            <Flex gap={2} flexWrap={"wrap"}>
                <Text fontWeight={500} fontSize={"1.2em"}>
                    Настройки чата
                </Text>
                <Checkbox
                    isChecked={helpText}
                    onChange={(e) => setHelpText(e.target.checked)}
                    mr="auto"
                >
                    Подсказки
                </Checkbox>
                <ChatOptionsConversion
                    conversionIdOptions={register("conversionId", {
                        disabled: isDisabled,
                    })}
                    conversionEventOptions={register("conversionEvent", {
                        disabled: isDisabled,
                    })}
                />
                <FormControl w="auto" display="flex" alignItems="center" ml={2}>
                    <FormLabel htmlFor={switchId} mb={0}>
                        Включён
                    </FormLabel>
                    <Switch
                        id={switchId}
                        {...register("enabled", { disabled: isDisabled })}
                    />
                </FormControl>
            </Flex>
            <Flex gap={2} justifyContent={"flex-end"}>
                <Button size="sm" disabled={isDisabled} onClick={handleReset}>
                    По умолчанию
                </Button>
                <Button
                    size="sm"
                    colorScheme="green"
                    disabled={isDisabled}
                    isLoading={projectLoading}
                    onClick={onSubmit(handleSubmit)}
                >
                    Сохранить
                </Button>
            </Flex>

            {options.map((option) => (
                <ChatOptionsInput
                    leftAddon={option.leftAddon}
                    key={option.key}
                    label={option.label}
                    type={option.type}
                    helperText={helpText ? option.helperText : undefined}
                    {...register(option.key, { disabled: isDisabled })}
                />
            ))}
        </VStack>
    );
};
