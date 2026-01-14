import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    breakpoints: {
        xs: "400px",
    },
    fonts: {
        body: `'Rubik', sans-serif;`,
    },
    components: {
        Button: {
            baseStyle: {
                rounded: 2,
            },
        },
        IconButton: {
            baseStyle: {
                position: "static",
            },
        },
        Tooltip: {
            baseStyle: {
                fontSize: "10px",
            },
        },
    },
});
