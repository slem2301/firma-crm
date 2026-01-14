/* eslint-disable react-hooks/exhaustive-deps */
import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputProps,
    InputRightElement,
    Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useSearchParamsState } from "../../../hooks/useQueryParamsState";

type SearchInputProps = {
    onChange: (e: any) => void;
    value: string;
    loading?: boolean;
    placeholder?: string;
    paramsName?: string;
    clearTrigger?: boolean;
} & InputProps;

const SearchInput: React.FC<SearchInputProps> = ({
    onChange,
    value,
    clearTrigger,
    loading,
    paramsName = "search",
    ...props
}) => {
    const [debouncedValue, setValue] = useSearchParamsState<string>({
        name: paramsName,
        deserialize: (v) => v || "",
    });

    const onChangeHandler = (value: string) => {
        onChange({
            target: {
                value,
            },
        });
    };

    useEffect(() => {
        if (!debouncedValue) return onChangeHandler("");
        const timeout = setTimeout(() => {
            onChangeHandler(debouncedValue);
        }, 500);

        return () => clearTimeout(timeout);
    }, [debouncedValue]);

    useEffect(() => {
        if (clearTrigger) setValue("");
    }, [clearTrigger]);

    useEffect(() => {
        onChangeHandler(debouncedValue);
    }, []);

    return (
        <InputGroup size={"sm"} w={"100%"} maxW={"300px"}>
            <InputLeftElement
                zIndex={0}
                pointerEvents="none"
                children={loading ? <Spinner size="sm" /> : <FaSearch />}
            />
            <Input
                type="text"
                placeholder={"Поиск"}
                onChange={(e) => setValue(e.target.value)}
                value={debouncedValue}
                {...props}
            />
            {debouncedValue && (
                <InputRightElement
                    children={
                        <IconButton
                            onClick={() => setValue("")}
                            rounded={"50%"}
                            bg={"transparent"}
                            icon={<FaTimes />}
                            size={"xs"}
                            aria-label="close"
                        />
                    }
                />
            )}
        </InputGroup>
    );
};

export default SearchInput;
