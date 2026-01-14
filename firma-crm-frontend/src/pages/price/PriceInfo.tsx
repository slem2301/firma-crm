/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { SUCCESS_GET } from "../../const/http-codes";
import priceService from "../../services/price-service";

type PriceInfoProps = {
    signal: boolean;
};

const PriceInfo: React.FC<PriceInfoProps> = ({ signal }) => {
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = useCallback(async () => {
        setLoading(true);
        try {
            const response = await priceService.getInfo();

            if (response.status === SUCCESS_GET) {
                setCreatedAt(response.data.createdAt);
            }
        } catch (e) {}
        setLoading(false);
    }, [signal]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    if (loading) return <Spinner size="xs" />;

    return (
        <Text>
            {createdAt ? (
                <>Загружен: {format(new Date(createdAt), "dd.MM.yyyy HH:mm")}</>
            ) : (
                "Прайса нет"
            )}
        </Text>
    );
};

export default PriceInfo;
