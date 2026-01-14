/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/ui/page/Page";
import useTitle from "../../hooks/useTitle";
import { ROUTES } from "../../router/routes";
import { getPathWithParam } from "../../utils/getPathWithParam";
import BalanceStatisticks from "./balanceStatisticks/BalanceStatisticks";
import CommonSalesStatisticks from "./commonSales/CommonSalesStatisticks";
import ExpenseStatisticks from "./expenseStatisticks/ExpenseStatisticks";
import RequestsStatisticks from "./requestStatisticks/RequestsStatisticks";

export const tabs: {
    [key: string]: {
        path: string;
        name: string;
        index: number;
        component: JSX.Element;
    };
} = {
    requests: {
        path: "requests",
        name: "Заявки",
        index: 0,
        component: <RequestsStatisticks />,
    },
    expenses: {
        path: "expenses",
        index: 1,
        name: "Расход",
        component: <ExpenseStatisticks />,
    },
    balance: {
        path: "balance",
        index: 2,
        name: "Баланс",
        component: <BalanceStatisticks />,
    },
    "common-sales": {
        path: "common-sales",
        index: 3,
        name: "Продажи",
        component: <CommonSalesStatisticks />,
    },
};

const Statisticks: React.FC = () => {
    const navigate = useNavigate();
    const { tab } = useParams();

    useTitle(`Статистика - ${tabs[tab || ""]?.name || ""}`);

    const [index, setIndex] = useState(
        Object.values(tabs).find((item) => item.path === tab)?.index || 0
    );

    useEffect(() => {
        const candidate = Object.values(tabs).find((item) => item.path === tab);

        if (candidate) return setIndex(candidate.index);

        navigate(
            getPathWithParam(ROUTES.statisticks.path, tabs.requests.path),
            { replace: true }
        );
    }, []);

    useEffect(() => {
        Object.values(tabs).forEach((item) => {
            if (item.index === index) {
                navigate(getPathWithParam(ROUTES.statisticks.path, item.path), {
                    replace: true,
                });
            }
        });
    }, [index]);

    return (
        <Page maxW={"100%"}>
            <Tabs isLazy index={index} onChange={setIndex}>
                <TabList flexWrap={"wrap"}>
                    {Object.values(tabs).map((tab) => (
                        <Tab key={tab.path}>{tab.name}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                    {Object.values(tabs).map((tab) => (
                        <TabPanel px={0} key={tab.path}>
                            {tab.component}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Page>
    );
};

export default Statisticks;
