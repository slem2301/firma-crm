import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useConst,
} from "@chakra-ui/react";
import Logo from "./Logo";
import { FaChevronRight, FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import Private from "../../private/Private";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { logout } from "../../../store/slices/auth-slice";
import { SyntheticEvent, useEffect, useState } from "react";
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from "../../../const/colors";
import DatePicker from "react-datepicker";
import { setPeriod } from "../../../store/slices/app-slice";
import { setHours, setMinutes } from "date-fns";
import { getCurrentPeriod } from "../../../utils/getCurrentPeriod";
import authService from "../../../services/auth-service";
import { SUCCESS_GET } from "../../../const/http-codes";

type HeaderProps = {
    toggle: () => void;
};

const calculateFontSize = (length: number) => {
    if (length > 15) {
        return 18 - (length - 15) * 0.2;
    }

    return 18;
};

const Header: React.FC<HeaderProps> = ({ toggle }) => {
    const {
        period: { from, to },
        title,
    } = useAppSelector((state) => state.app);

    const initialPeriod = useConst([from, to]);
    const [_period, _setPeriod] = useState(initialPeriod);
    const [_from, _to] = _period;

    const dispatch = useAppDispatch();

    const logoutHandler = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            const response = await authService().logout();

            if (response.status === SUCCESS_GET) {
                localStorage.removeItem("token");
                localStorage.removeItem("auth_id");
                dispatch(logout());
            }
        } catch (e) {}
    };

    useEffect(() => {
        _setPeriod([from, to]);
    }, [from, to]);

    const setPeriodHandler = (range: any) => {
        const from = setHours(
            setMinutes(range[0] || getCurrentPeriod()[0], 0),
            0
        );
        const to = setHours(
            setMinutes(range[1] || getCurrentPeriod()[1], 59),
            23
        );

        if (!((range[0] && !range[1]) || (!range[0] && range[1])))
            dispatch(setPeriod([from, to]));

        if (!range[0] && !range[1]) return _setPeriod([from, to]);

        _setPeriod(range);
    };

    return (
        <Flex
            justify="space-between"
            align="center"
            as="header"
            boxShadow="outline"
            ps={{ base: 2, md: 3 }}
            zIndex={1}
            position="relative"
            h={"44px"}
            mb={"2px"}
        >
            <Private>
                <IconButton
                    ml={-2}
                    rounded={0}
                    display={{ base: "flex", md: "none" }}
                    aria-label="open sidebar"
                    icon={<FaChevronRight />}
                    onClick={toggle}
                    bg={"transparent"}
                />
            </Private>
            <Logo />
            <Heading
                color={COLOR_PRIMARY}
                fontSize={calculateFontSize(title.length)}
                size="md"
                display={{ base: "none", md: "block" }}
            >
                {title}
            </Heading>
            <Private>
                <HStack spacing={0}>
                    <Box w={"220px"} display={{ base: "none", md: "block" }}>
                        <DatePicker
                            locale={"ru"}
                            selectsRange={true}
                            startDate={_from}
                            endDate={_to}
                            dateFormat="dd.MM.yyyy"
                            onChange={setPeriodHandler}
                            withPortal
                            customInput={
                                <Input
                                    size="sm"
                                    placeholder="Выберите период"
                                />
                            }
                            isClearable={true}
                        />
                    </Box>
                    <Menu>
                        <MenuButton
                            ml={"8px !important"}
                            as={Button}
                            rounded={0}
                            h={"44px"}
                            color={"white"}
                            bg={COLOR_PRIMARY}
                            _hover={{
                                background: COLOR_PRIMARY_DARK,
                            }}
                            _active={{
                                background: COLOR_PRIMARY_DARK,
                            }}
                        >
                            <FaUserCircle fontSize={"24px"} />
                        </MenuButton>
                        <MenuList shadow={"dark-lg"} rounded={0}>
                            <Box p={2} display={{ base: "block", md: "none" }}>
                                <Text fontWeight={500} fontSize={14}>
                                    Период
                                </Text>
                                <DatePicker
                                    locale={"ru"}
                                    selectsRange={true}
                                    startDate={_from}
                                    endDate={_to}
                                    dateFormat="dd.MM.yyyy"
                                    onChange={setPeriodHandler}
                                    customInput={
                                        <Input
                                            size="sm"
                                            placeholder="Выберите период"
                                        />
                                    }
                                    isClearable={true}
                                />
                            </Box>
                            <Divider />
                            <MenuItem
                                icon={<MdLogout />}
                                onClick={logoutHandler}
                            >
                                Выйти
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Private>
        </Flex>
    );
};

export default Header;
