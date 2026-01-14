import React, { useState } from "react";
import CommonChart from "./CommonChart";
import ProjectsChart from "./ProjectsChart";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { CallsChart } from "./CallsChart";

const RequestsStatisticks = () => {
    const [countryIds, setCountryIds] = useState<number[]>([]);
    const [productIds, setProductIds] = useState<number[]>([]);

    return (
        <>
            <CommonChart
                countryIds={countryIds}
                productIds={productIds}
                setCountryIds={setCountryIds}
                setProductIds={setProductIds}
            />
            <Tabs mt={2}>
                <TabList>
                    <Tab>Проекты</Tab>
                    <Tab>Звонки</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p={0}>
                        <ProjectsChart
                            countryIds={countryIds}
                            productIds={productIds}
                        />
                    </TabPanel>
                    <TabPanel p={0}>
                        <CallsChart />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

export default RequestsStatisticks;
