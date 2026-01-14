import { Flex, FlexProps, Input } from "@chakra-ui/react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import IconButton from "../../components/ui/sidebar/IconButton";
import styles from "./EditableText.module.scss";

type EditableTextProps = FlexProps & {
    onSave: (value: string) => void;
    text: string;
};

const EditableText = ({
    children,
    onSave,
    text,
    ...props
}: PropsWithChildren<EditableTextProps>) => {
    const [editableMode, setEditableMode] = useState(false);
    const [value, setValue] = useState(text);

    const handleCancel = () => {
        setEditableMode(false);
        setValue(text);
    };

    const handleSubmit = () => {
        if (!value) return;
        onSave(value);
        handleCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSubmit();
    };

    useEffect(() => {
        setValue(text);
    }, [text]);

    return (
        <Flex
            alignItems="center"
            justifyContent={"flex-start"}
            className={styles.wrapper}
            {...props}
        >
            {editableMode ? (
                <>
                    <Input
                        onKeyDown={handleKeyDown}
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        size="sm"
                        placeholder={text}
                    />
                    <IconButton
                        ml={1}
                        onClick={handleCancel}
                        aria-label="cancel"
                        icon={<FaTimes />}
                        size="xs"
                        colorScheme="gray"
                    />
                    <IconButton
                        ml={1}
                        onClick={handleSubmit}
                        aria-label="save"
                        bg="green.500"
                        rounded={2}
                        icon={<FaCheck />}
                        size="xs"
                        colorScheme="green"
                    />
                </>
            ) : (
                <>
                    <IconButton
                        onClick={() => setEditableMode(true)}
                        aria-label="edit"
                        icon={<MdEdit />}
                        size="xs"
                        colorScheme="gray"
                    />
                    {children}
                </>
            )}
        </Flex>
    );
};

export default EditableText;
