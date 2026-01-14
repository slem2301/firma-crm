import { Flex, Heading } from "@chakra-ui/react";
import { CanceledError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../../components/ui/goBack/GoBackButton";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { FetchStatus, FETCH_STATUS, SUCCESS_GET } from "../../const/http-codes";
import { useLatest } from "../../hooks/useLatest";
import { IAd } from "../../models/IAd";
import { ROUTES } from "../../router/routes";
import adService from "../../services/ad-service";
import { ArchiveAd } from "./ArchiveAd";
import { AdForm } from "./AdForm";

const Ad = () => {
    const params = useParams();
    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const [ad, setAd] = useState<IAd | null>(null);

    const latestAd = useLatest(ad);

    const isLoading = status === FETCH_STATUS.LOADING;
    const isError = status === FETCH_STATUS.ERROR;

    const fetchAd = useCallback(async () => {
        setStatus(
            latestAd.current ? FETCH_STATUS.RELOADING : FETCH_STATUS.LOADING
        );
        try {
            const response = await adService.getByLogin(params.login as string);

            if (response.status === SUCCESS_GET) {
                if (!response.data) throw new Error("Not Found");

                setAd(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e) {
            if (!(e instanceof CanceledError)) {
                setStatus(FETCH_STATUS.ERROR);

            }
        }
    }, [params.login, latestAd]);

    useEffect(() => {
        fetchAd();
    }, [fetchAd]);

    if (isLoading) return <Loader />;

    return (
        <Page>
            <Flex gap={2}>
                <GoBackButton to={ROUTES.ads.path} />
                {ad && (
                    <ArchiveAd
                        id={ad.id}
                        archived={ad.archived}
                        updateAd={setAd}
                    />
                )}
            </Flex>
            {ad ? (
                <AdForm ad={ad} updateAd={setAd} />
            ) : (
                isError && (
                    <Heading size="lg" mt={10} textAlign={"center"}>
                        Рекламный аккаунт не найден
                    </Heading>
                )
            )}
        </Page>
    );
};

export default Ad;
