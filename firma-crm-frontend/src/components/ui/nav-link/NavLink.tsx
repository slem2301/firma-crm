import { Box } from "@chakra-ui/react";
import React, { ReactNode, SyntheticEvent } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from "../../../const/colors";
import styles from "./NavLink.module.scss";

type NavLinkProps = {
    children: ReactNode;
    to?: string;
    inversed?: boolean;
    onClick?: (e: SyntheticEvent) => void;
    block?: boolean;
};

const NavLink: React.FC<NavLinkProps> = (props) => {
    return (
        <RouterNavLink
            to={props.to || ""}
            onClick={props.onClick}
            className={styles.link}
            style={{ width: props.block ? "100%" : "auto" }}
        >
            <Box
                p={4}
                py={2.5}
                fontWeight="700"
                transition={"all"}
                transitionDuration=".2s"
                color={props.inversed ? "white" : "black"}
                bg={props.inversed ? COLOR_PRIMARY : "transparent"}
                _hover={{
                    background: props.inversed
                        ? COLOR_PRIMARY_DARK
                        : COLOR_PRIMARY,
                    color: "white",
                }}
            >
                {props.children}
            </Box>
        </RouterNavLink>
    );
};

export default NavLink;
