import React from "react";
import { NavLink } from "react-router-dom";

type LinkProps = {
    to: string;
    children: JSX.Element;
    onClick: (e?: any) => void;
};

const Link: React.FC<LinkProps> = (props) => {
    return (
        <NavLink to={props.to} className="nav-link" onClick={props.onClick}>
            {props.children}
        </NavLink>
    );
};

export default Link;
