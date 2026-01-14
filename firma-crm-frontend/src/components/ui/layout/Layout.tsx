import { Flex, useBoolean } from "@chakra-ui/react";
import Header from "../header/Header";
import Main from "../main/Main";
import Sidebar from "../sidebar/Sidebar";

const Layout = () => {
    const [open, setOpen] = useBoolean();

    return (
        <>
            <Header toggle={setOpen.toggle} />
            <Flex>
                <Sidebar open={open} toggle={setOpen.toggle} />
                <Main />
            </Flex>
        </>
    );
};

export default Layout;
