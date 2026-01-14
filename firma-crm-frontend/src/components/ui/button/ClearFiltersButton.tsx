import { ButtonProps, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { RiFilterOffLine } from "react-icons/ri";

const ClearFiltersButton: React.FC<ButtonProps> = (props) => {
    return (
        <Tooltip label={"Очистить фильтры"} openDelay={400} fontSize="10px">
            <IconButton
                bg="transparent"
                rounded={"50%"}
                aria-label="clear filters"
                icon={<RiFilterOffLine />}
                {...props}
            />
        </Tooltip>
    );
};

export default ClearFiltersButton;
