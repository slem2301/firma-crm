import { useMediaQuery } from "@chakra-ui/react";

type sizesType = "sm" | "md" | "lg" | "xl" | "xxl";

export const useBreakpoint = (size: sizesType) => {
    const sizes: { [key: string]: string } = {
        sm: "575px",
        md: "767px",
        lg: "991px",
        xl: "1200px",
        xxl: "1400px",
    };

    const [value] = useMediaQuery(`(max-width: ${sizes[size]})`);

    return value;
};
