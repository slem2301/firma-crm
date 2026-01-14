import { useEffect, useMemo, useState } from "react";
import { DataOrderSlot, SPACE } from "./DataOrderSlot";
import { Flex, IconButton } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export interface DataOrderSlotListProps {
    acceptedFields: string[];
    initialItems: string[];
    onChange: (dataOrder: string) => void;
}

export const DataOrderSlotList = (props: DataOrderSlotListProps) => {
    const [data, setData] = useState<string[]>(props.initialItems);

    const acceptedFields = useMemo(() => {
        return props.acceptedFields.filter((field) => !data.includes(field));
    }, [data, props.acceptedFields]);

    const handleChange = (value: string, index: number) => {
        setData((prev) => prev.map((v, i) => (i === index ? value : v)));
    };

    const handleAddSlot = () => {
        setData((prev) => [...prev, SPACE]);
    };

    const handleDeleteSlot = (index: number) => {
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        props.onChange(data.join(","));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <Flex overflowX={"auto"} pb={2}>
            <Flex gap={1}>
                {data.map((item, index) => (
                    <DataOrderSlot
                        key={index}
                        index={index}
                        value={item}
                        acceptedFields={acceptedFields}
                        onValueChange={handleChange}
                        onDelete={handleDeleteSlot}
                    />
                ))}
                <IconButton
                    size="sm"
                    aria-label="add"
                    colorScheme="green"
                    onClick={handleAddSlot}
                >
                    <FaPlus />
                </IconButton>
            </Flex>
        </Flex>
    );
};
