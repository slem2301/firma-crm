import { Divider } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { TbWorld } from "react-icons/tb";
import {
    FaChartBar,
    FaExclamationCircle,
    FaGooglePlay,
    FaHashtag,
    FaUserCircle,
} from "react-icons/fa";
import { MdBlock, MdOutlineAttachMoney } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import IconButton from "./IconButton";
import { ROUTES } from "../../../router/routes";
import Private from "../../private/Private";
import Button from "./Button";
import Link from "./Link";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useEffect } from "react";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import { tabs } from "../../../pages/statisticks/Statisticks";
import { ROLES } from "../../../hooks/useRoles";

type BarProps = {
    open: boolean;
    md: boolean;
};

const StyledBar = styled.aside<BarProps>`
    display: flex;
    flex-direction: column;
    width: ${(props) => (props.open ? "240px" : props.md ? "0px" : "40px")};
    transition: width 0.3s ease, min-width 0.3s ease;
    box-shadow: 3px 0 0 0 rgba(66, 153, 225, 0.6);
    box-shadow: var(--chakra-shadows-lg);
    overflow: hidden;
    min-width: ${(props) => (props.open ? "240px" : props.md ? "0px" : "40px")};
    background: white;
    ${(props) =>
        props.md
            ? `
            position: absolute;
            z-index: 2000;
            top: 0;
            left: 0;
            bottom: 0;
        `
            : ""}
`;

type SidebarProps = {
    open: boolean;
    toggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ open, toggle }) => {
    const md = useBreakpoint("md");

    const onClick = (e: any) => {
        if (md) {
            toggle();
        }
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const button = target.closest("button");
            const isCaller = button && button.ariaLabel === "open sidebar";
            if (!target.closest("aside") && !isCaller) toggle();
        };

        open && md && document.addEventListener("click", handler);

        return () => document.removeEventListener("click", handler);
    }, [open, md, toggle]);

    return (
        <Private>
            <StyledBar open={open} md={md}>
                <IconButton
                    aria-label="open sidebar"
                    icon={open ? <FaChevronLeft /> : <FaChevronRight />}
                    ml="auto"
                    onClick={toggle}
                />
                <Divider h={"2px"} opacity={1} />
                <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <>
                        <Link to={ROUTES.projects.path} onClick={onClick}>
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<TbWorld />}
                            >
                                Проекты
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
                <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <>
                        <Link
                            to={getPathWithParam(
                                ROUTES.statisticks.path,
                                tabs.requests.path
                            )}
                            onClick={onClick}
                        >
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<FaChartBar />}
                            >
                                Статистика
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
                <Link to={ROUTES.orders.path} onClick={onClick}>
                    <Button tooltipdisabled={open} leftIcon={<BsStack />}>
                        Заказы
                    </Button>
                </Link>
                <Divider />
                <Link to={ROUTES.price.path} onClick={onClick}>
                    <Button
                        tooltipdisabled={open}
                        leftIcon={<MdOutlineAttachMoney />}
                    >
                        Прайс
                    </Button>
                </Link>
                <Divider />
                <Link to={ROUTES.blacklist.path} onClick={onClick}>
                    <Button tooltipdisabled={open} leftIcon={<MdBlock />}>
                        Черный список
                    </Button>
                </Link>
                <Divider />
                <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <>
                        <Link to={ROUTES.phones.path} onClick={onClick}>
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<FaHashtag />}
                            >
                                Номера
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
                <Private roles={[ROLES.ADMIN]}>
                    <>
                        <Link to={ROUTES.requests.path} onClick={onClick}>
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<FaExclamationCircle />}
                            >
                                Заявки
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
                <Private roles={[ROLES.ADMIN]}>
                    <>
                        <Link to={ROUTES.users.path} onClick={onClick}>
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<FaUserCircle />}
                            >
                                Аккаунты
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
                <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <>
                        <Link to={ROUTES.ads.path} onClick={onClick}>
                            <Button
                                tooltipdisabled={open}
                                leftIcon={<FaGooglePlay />}
                            >
                                Рекламные аккаунты
                            </Button>
                        </Link>
                        <Divider />
                    </>
                </Private>
            </StyledBar>
        </Private>
    );
};

export default Sidebar;
