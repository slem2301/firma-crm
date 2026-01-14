import React from "react";
import { store } from "./store/store";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { theme } from "./theme";
import { Provider } from "react-redux";
import { initInterceptors } from "./axios";

initInterceptors(store);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ChakraProvider theme={theme}>
                    <AppRouter />
                </ChakraProvider>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
