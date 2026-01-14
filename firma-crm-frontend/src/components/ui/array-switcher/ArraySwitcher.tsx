import { Box } from "@chakra-ui/react";
import React from "react";

type ArraySwitcherProps = {
    setValue: (value: number) => void;
    value: number;
    min?: number;
    max?: number;
    koef?: number;
};

const ArraySwitcher: React.FC<ArraySwitcherProps> = (props) => {
    const { setValue, value, min = 0, max = 10, koef = 10 } = props;

    const onChange = (e: any) => {
        const value = Number(e.target.value);
        setValue(value * koef);
    };

    return (
        <Box w="100%">
            <Box
                w="100%"
                cursor={"pointer"}
                as="input"
                type="range"
                min={min}
                max={max}
                className="array-switcher"
                value={value}
                onChange={onChange}
            />
        </Box>
    );
};

export default ArraySwitcher;
