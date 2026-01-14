import { ButtonProps, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { GrRefresh } from "react-icons/gr";

type UpdateButtonProps = {} & ButtonProps;

const UpdateButton: React.FC<UpdateButtonProps> = (props) => {
    // if (props.loadingText) console.log(props.isLoading);

    return (
        <Tooltip fontSize={"10px"} label="Обновить данные" openDelay={1000}>
            <IconButton
                bg="transparent"
                rounded={"50%"}
                icon={<GrRefresh />}
                aria-label={"update"}
                {...props}
            />
        </Tooltip>
    );
};

export default UpdateButton;
