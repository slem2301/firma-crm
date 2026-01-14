import {
    Box,
    Checkbox,
    Flex,
    Grid,
    Progress,
    VStack,
    useBoolean,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import AdItem from "./AdItem";
import Page from "../../components/ui/page/Page";
import {
    FetchStatus,
    FETCH_STATUS,
    SUCCESS_POST,
} from "../../const/http-codes";
import { AdType, IAd } from "../../models/IAd";
import adService from "../../services/ad-service";
import Loader from "../../components/ui/loader/Loader";
import CurrencyFilter from "../../components/filters/CurrencyFilter";
import SingleSelectFilter from "../../components/filters/SingleSelectFilter";
import SearchInput from "../../components/ui/search-input/SearchInput";
import { useLatest } from "../../hooks/useLatest";
import { motion, AnimatePresence } from "framer-motion";
import { AddAd } from "./AddAd";

const Ads = () => {
    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const [ads, setAds] = useState<IAd[] | null>(null);

    const latestAds = useLatest(ads);

    const [currencyIds, setCurrencyIds] = useState<number[]>([]);
    const [type, setType] = useState<AdType>("yandex");
    const [search, setSearch] = useState("");
    const [archived, setArchived] = useBoolean();

    const loading = status === FETCH_STATUS.LOADING;
    const reloading = status === FETCH_STATUS.RELOADING;

    const fetchAds = useCallback(async () => {
        setStatus(
            latestAds.current === null
                ? FETCH_STATUS.LOADING
                : FETCH_STATUS.RELOADING
        );

        try {
            const response = await adService.getAllWithFilters({
                search,
                archived,
                filters: {
                    type,
                    currencyIds,
                },
            });

            if (response.status === SUCCESS_POST) {
                setAds(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    }, [latestAds, search, type, currencyIds, archived]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    return (
        <Page>
            <VStack spacing={4} align="stretch">
                <Flex gap={2} alignItems="center" flexWrap={"wrap"}>
                    <AddAd fetchAds={fetchAds} />
                    <SingleSelectFilter<AdType>
                        options={[
                            {
                                name: "Яндекс",
                                value: "yandex",
                            },
                            {
                                name: "Google",
                                value: "google",
                            },
                        ]}
                        setValue={setType}
                    />
                    <CurrencyFilter setIds={setCurrencyIds} />
                    <Checkbox
                        isChecked={archived}
                        onChange={setArchived.toggle}
                    >
                        Архивированные
                    </Checkbox>
                    <Flex flexGrow={1} justifyContent="flex-end">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск: Логин"
                        />
                    </Flex>
                    {reloading && (
                        <AnimatePresence>
                            <Box
                                as={motion.div}
                                w="100%"
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                            >
                                <Progress size="xs" isIndeterminate />
                            </Box>
                        </AnimatePresence>
                    )}
                </Flex>
                <Grid
                    templateColumns={"repeat(4, 1fr)"}
                    gap={3}
                    position="relative"
                >
                    {loading ? (
                        <Loader />
                    ) : (
                        ads &&
                        ads.map((ad) => (
                            <AdItem disabled={reloading} key={ad.id} ad={ad} />
                        ))
                    )}
                </Grid>
            </VStack>
        </Page>
    );
};

export default Ads;
