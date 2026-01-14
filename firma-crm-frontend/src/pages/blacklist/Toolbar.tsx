import { Button, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";
import SearchInput from "../../components/ui/search-input/SearchInput";
import { VscAdd } from "react-icons/vsc";
import AddDrawer from "./AddDrawer";
import { useBreakpoint } from "../../hooks/useBreakpoint";

type ToolbarProps = {
    search: string;
    setSearch: (value: string) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ search, setSearch }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const sm = useBreakpoint("sm");

    return (
        <>
            <HStack
                spacing={2}
                justify={"space-between"}
                alignItems={"center"}
                h={"43px"}
                borderBottom={"1px solid"}
                borderColor="gray.200"
                p={1.5}
            >
                {sm ? (
                    <IconButton
                        aria-label="open add drawer"
                        icon={<VscAdd />}
                        size="sm"
                        colorScheme="green"
                        onClick={onOpen}
                    />
                ) : (
                    <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<VscAdd />}
                        onClick={onOpen}
                    >
                        Добавить
                    </Button>
                )}
                <SearchInput
                    type="number"
                    placeholder="Поиск: Номер"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </HStack>
            <AddDrawer isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default Toolbar;
