/* eslint-disable react-hooks/exhaustive-deps */
import {
    Button,
    Checkbox,
    Flex,
    HStack,
    IconButton,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SearchInput from "../../components/ui/search-input/SearchInput";
import { VscAdd } from "react-icons/vsc";
import AddDrawer from "./AddDrawer";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useAppSelector } from "../../hooks/redux";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import CountryFilter from "../../components/filters/CountryFilter";
import ProductFilter from "../../components/filters/ProductFilter";
import Private from "../../components/private/Private";
import { ROLES } from "../../hooks/useRoles";
import ArraySwitcher from "../../components/ui/array-switcher/ArraySwitcher";

type ToolbarProps = {
    mode?: "create";
    countryFilter: {
        setIds: (value: number[]) => void;
    };
    productFilter: {
        setIds: (value: number[]) => void;
    };
    search: {
        setValue: (value: string) => void;
        value: string;
    };
    redirectRange: number;
    setRedirectRange: (value: number) => void;
    isTesting: boolean;
    setTesting: (value: boolean) => void;
    APM: boolean;
    setAPM: (value: boolean) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
    mode,
    countryFilter,
    productFilter,
    search,
    isTesting,
    redirectRange,
    setTesting,
    setRedirectRange,
    APM,
    setAPM,
}) => {
    const md = useBreakpoint("md");

    const navigate = useNavigate();

    const { postLoading } = useAppSelector((state) => state.project);

    const {
        isOpen: addDrawer,
        onOpen: addDrawerOnOpen,
        onClose: addDrawerOnClose,
    } = useDisclosure();

    const [range, setRange] = useState(redirectRange);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRedirectRange(range);
        }, 400);

        return () => clearTimeout(timeout);
    }, [range]);

    useEffect(() => {
        if (mode === "create") return addDrawerOnOpen();
        else addDrawerOnClose();
    }, [mode, addDrawerOnOpen, addDrawerOnClose]);

    const openAddDrawer = () => {
        navigate(ROUTES.createProject.path);
        addDrawerOnOpen();
    };

    const closeAddDrawer = () => {
        navigate(ROUTES.projects.path);
        addDrawerOnClose();
    };

    return (
        <>
            <HStack
                spacing={{ base: 0, sm: 2 }}
                justify={"space-between"}
                alignItems={"center"}
                borderBottom={"1px solid"}
                borderColor="gray.200"
                p={1.5}
                flexWrap={{ base: "wrap", sm: "nowrap" }}
            >
                <Flex
                    gap={2}
                    flexWrap={"wrap"}
                    w={"100%"}
                    align="center"
                    mb={{ base: 1, sm: 0 }}
                >
                    <Private roles={[ROLES.ADMIN]}>
                        {md ? (
                            <IconButton
                                aria-label="add project"
                                size="sm"
                                icon={<VscAdd />}
                                onClick={openAddDrawer}
                                colorScheme="green"
                            />
                        ) : (
                            <Button
                                colorScheme="green"
                                size="sm"
                                leftIcon={<VscAdd />}
                                onClick={openAddDrawer}
                            >
                                Добавить проект
                            </Button>
                        )}
                    </Private>
                    <ProductFilter setIds={productFilter.setIds} />
                    <CountryFilter setCoutryIds={countryFilter.setIds} />
                    <Checkbox
                        isChecked={isTesting}
                        onChange={(e) => setTesting(e.target.checked)}
                    >
                        Тестовый режим
                    </Checkbox>
                    <Checkbox
                        isChecked={APM}
                        onChange={(e) => setAPM(e.target.checked)}
                    >
                        АПН
                    </Checkbox>
                    <HStack w={"200px"}>
                        <ArraySwitcher
                            max={100}
                            setValue={setRange}
                            value={range}
                            koef={1}
                        />
                        <Text>{range}%</Text>
                    </HStack>
                </Flex>
                <SearchInput
                    placeholder="Поиск: Название, URL"
                    loading={postLoading}
                    onChange={(e) => search.setValue(e.target.value)}
                    value={search.value}
                />
            </HStack>
            <AddDrawer isOpen={addDrawer} onClose={closeAddDrawer} />
        </>
    );
};

export default Toolbar;
