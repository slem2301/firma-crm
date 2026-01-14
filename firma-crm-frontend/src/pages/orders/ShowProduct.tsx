import { IconButton, Tooltip } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";

type ShowProductProps = {
    id: number;
    version: number;
};

const ShowProduct: React.FC<ShowProductProps> = ({ id, version }) => {
    const navigate = useNavigate();

    const onClick = useCallback(() => {
        navigate(`${ROUTES.price.path}?search=${id}&version=${version}`);
    }, [id, navigate, version]);

    return (
        <Tooltip openDelay={400} fontSize="10px" label="Смотреть в прайсе">
            <IconButton
                position="static"
                onClick={onClick}
                color="blue.500"
                aria-label="show in price"
                bg={"transparent"}
                rounded={20}
                icon={<FaEye />}
                size="xs"
            />
        </Tooltip>
    );
};

export default ShowProduct;
