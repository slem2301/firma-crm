import { Flex, IconButton, Select, Tooltip } from "@chakra-ui/react";
import { ChangeEvent, useMemo } from "react";
import { FaTimes } from "react-icons/fa";

interface DataOrderSlotProps {
    acceptedFields: string[];
    onValueChange: (value: string, index: number) => void;
    onDelete: (index: number) => void;
    value: string;
    index: number;
}

export const SPACE = "_";

export const DataOrderSlot = (props: DataOrderSlotProps) => {
    const { acceptedFields, onValueChange, onDelete, value, index } = props;

    const fields = useMemo(() => {
        return Array.from(new Set([value, SPACE, ...acceptedFields]));
    }, [value, acceptedFields]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onValueChange(e.target.value, index);
    };

    return (
        <Flex w={150}>
            <Tooltip label={value}>
                <Select
                    size="sm"
                    w="auto"
                    value={value}
                    onChange={handleChange}
                >
                    {fields.map((field) => (
                        <option key={field} value={field}>
                            {field === SPACE ? "Пропуск" : field}
                        </option>
                    ))}
                </Select>
            </Tooltip>
            <IconButton
                onClick={() => onDelete(index)}
                size="sm"
                aria-label="delete"
                colorScheme="red"
            >
                <FaTimes />
            </IconButton>
        </Flex>
    );
};
