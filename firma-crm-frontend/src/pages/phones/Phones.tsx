import { Checkbox, Flex, HStack, useBoolean, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Page from "../../components/ui/page/Page";
import { SUCCESS_GET } from "../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useTitle from "../../hooks/useTitle";
import { ICountry } from "../../models/ICountry";
import { IPhone } from "../../models/IPhone";
import phoneService from "../../services/phone-service";
import { setPhones } from "../../store/slices/phone-slice";
import CategoryItem from "./CategoryItem";

export type CategoryType = {
    phones: IPhone[];
    region: ICountry;
};

const Phones = () => {
    useTitle("Номера");
    const [loading, setLoading] = useBoolean();

    const { countries } = useAppSelector((state) => state.country);

    const [categories, setCategories] = useState<CategoryType[]>(
        countries.map((country) => ({
            phones: [],
            region: country,
        }))
    );
    const [editMode, setEditMode] = useState(false);

    const dispatch = useAppDispatch();

    const fetchPhones = useCallback(async () => {
        setLoading.on();
        try {
            const response = await phoneService.getAll(true);

            if (response.status === SUCCESS_GET) {
                const _categories: CategoryType[] = countries.map(
                    (country) => ({
                        phones: [],
                        region: country,
                    })
                );
                setCategories(() => {
                    const notReserved: IPhone[] = [];

                    response.data.forEach((phone: IPhone) => {
                        const category = _categories.find(
                            (category) => category.region.id === phone.regionId
                        );
                        if (category) {
                            category.phones.push(phone);
                        }

                        if (!phone.isReserved && !phone.projectId)
                            notReserved.push(phone);
                    });

                    dispatch(setPhones(notReserved));

                    return _categories.map((category) => ({
                        ...category,
                        phones: category.phones.sort(
                            (a, b) => Number(b.phone) - Number(a.phone)
                        ),
                    }));
                });
            }
        } catch (e) {}
        setLoading.off();
    }, [setLoading, countries, dispatch]);

    useEffect(() => {
        fetchPhones();
    }, [fetchPhones]);

    return (
        <Page>
            <VStack align="stretch">
                <Flex alignItems={"center"} gap={2} flexWrap="wrap">
                    <Checkbox
                        isChecked={editMode}
                        onChange={() => setEditMode((prev) => !prev)}
                    >
                        Редактирование
                    </Checkbox>
                </Flex>
                <HStack overflowX="auto" h="80vh" align="stretch">
                    {categories.map((category, i) => (
                        <CategoryItem
                            globalLoading={loading}
                            fetchPhones={fetchPhones}
                            globalEditMode={editMode}
                            category={category}
                            key={i}
                        />
                    ))}
                </HStack>
            </VStack>
        </Page>
    );
};

export default Phones;
