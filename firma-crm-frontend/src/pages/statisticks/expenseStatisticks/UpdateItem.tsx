/* eslint-disable react-hooks/exhaustive-deps */
import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    VStack,
} from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import { nameAssociacions } from "../../../components/ad/AdItem";
import { IAd } from "../../../models/IAd";

type UpdateItemProps = {
    ad: IAd;
    setAds: React.Dispatch<SetStateAction<IAd[]>>;
    index: number;
};

const UpdateItem: React.FC<UpdateItemProps> = ({ ad, setAds, index }) => {
    const [form, setForm] = useState({
        balance: ad.balance,
        delay: ad.delay,
    });

    const change = (key: keyof IAd) => (e: any) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value || 0 }));
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAds((prev) =>
                prev.map((item, i) => {
                    if (index === i) {
                        return {
                            ...item,
                            ...form,
                        };
                    }

                    return item;
                })
            );
        }, 30);

        return () => clearTimeout(timeout);
    }, [form]);

    return (
        <VStack alignItems={"stretch"} p={2} borderWidth={1}>
            <FormLabel borderBottomWidth={1} pb={2}>
                {nameAssociacions[ad.type]} аккаунт
            </FormLabel>
            <FormControl>
                <FormLabel>Баланс</FormLabel>
                <InputGroup size="sm">
                    <Input
                        onChange={change("balance")}
                        placeholder={`0 ${ad.currency.symbol}`}
                        value={form.balance}
                    />
                    <InputRightAddon children={ad.currency.symbol} />
                </InputGroup>
            </FormControl>
            {ad.type === "yandex" && (
                <FormControl>
                    <FormLabel>Отсрочка</FormLabel>
                    <InputGroup size="sm">
                        <Input
                            onChange={change("delay")}
                            placeholder={`0 ${ad.currency.symbol}`}
                            value={form.delay}
                        />
                        <InputRightAddon children={ad.currency.symbol} />
                    </InputGroup>
                </FormControl>
            )}
        </VStack>
    );
};

export default UpdateItem;
