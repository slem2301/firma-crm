import { IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { BiGitCompare } from "react-icons/bi";
import { ComparePhonesModal } from "./ComparePhonesModal";

export const ComparePhones = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <>
            <IconButton
                colorScheme="green"
                fontSize={"1.3em"}
                size="sm"
                aria-label="compare phones"
                icon={<BiGitCompare />}
                onClick={onOpen}
            />
            {isOpen && <ComparePhonesModal isOpen={isOpen} onClose={onClose} />}
        </>
    );
};
