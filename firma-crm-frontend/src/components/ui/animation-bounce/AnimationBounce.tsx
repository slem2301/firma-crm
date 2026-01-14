import React, { PropsWithChildren } from "react";
import { AnimationProps, motion } from "framer-motion";

const AnimationBounce = ({
    children,
    ...props
}: PropsWithChildren<AnimationProps>) => {
    return (
        <motion.div
            initial={{ opacity: 0, transform: "scale(.8)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default AnimationBounce;
