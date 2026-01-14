import { Container } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type PageProps = {
    children: ReactNode;
    maxW?: number | string;
    toolbar?: JSX.Element;
    withoutPT?: boolean;
};

const Page: React.FC<PageProps> = ({ ...props }) => {
    return (
        <>
            {props.toolbar && props.toolbar}
            <Container
                px={{ base: 2, sm: 3 }}
                maxW={props.maxW ? props.maxW : 1200}
                pt={props.withoutPT ? 0 : "16px"}
                pb={3}
            >
                {props.children}
            </Container>
        </>
    );
};

export default Page;
