/* eslint-disable react-hooks/exhaustive-deps */
import { Text, TextProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { animate } from "framer-motion";

type AnimatedNumberProps = {
    number: number;
    withAnimation?: boolean;
    dots?: number;
    addon?: string;
    addonProps?: TextProps;
} & TextProps;

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    number,
    withAnimation,
    dots = 0,
    addon,
    addonProps,
    ...props
}) => {
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        if (withAnimation) {
            const from = value;
            const animation = animate(from, number, {
                duration: 0.8,
                onUpdate: (value) => setValue(Number(value?.toFixed(dots))),
            });

            return animation.stop;
        }
    }, [number]);

    return (
        <Text as="span" {...props}>
            {withAnimation ? value : number?.toFixed(dots)}{" "}
            {addon && (
                <Text as="span" {...addonProps}>
                    {addon}
                </Text>
            )}
        </Text>
    );
};

export default AnimatedNumber;
