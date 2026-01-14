import { Progress } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const StyledMain = styled.main`
    height: calc(100vh - 46px);
    overflow-y: auto;
    position: relative;
    flex-grow: 1;
`;

const Main = () => {
    return (
        <Suspense
            fallback={
                <Progress
                    position={"absolute"}
                    top={0}
                    left={0}
                    right={0}
                    size={"xs"}
                    isIndeterminate
                />
            }
        >
            <StyledMain>
                <Outlet />
            </StyledMain>
        </Suspense>
    );
};

export default Main;
