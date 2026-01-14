/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex, FormLabel, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IAd } from "../../models/IAd";
import { getAllAds } from "../../store/slices/ad-slice";
import AdItem from "./AdItem";
import ChooseAd from "./ChooseAd";
import CreateAd from "./CreateAd";

type AdProps = {
    setAds: React.Dispatch<React.SetStateAction<IAd[]>>;
    ads: IAd[];
    editMode?: boolean;
};

const Ad: React.FC<AdProps> = ({ setAds, ads, editMode = true }) => {
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();
    const {
        isOpen: isChooseOpen,
        onOpen: onChooseOpen,
        onClose: onChooseClose,
    } = useDisclosure();

    const { loading } = useAppSelector((state) => state.ad);
    const dispatch = useAppDispatch();

    const createOpenHandler = (cb: () => void) => () => {
        document.body.classList.add("not-overflowed");
        cb();
    };
    const createCloseHandler = (cb: () => void) => () => {
        cb();
        document.body.classList.remove("not-overflowed");
    };

    const openCreateModal = createOpenHandler(onCreateOpen);
    const closeCreateModal = createCloseHandler(onCreateClose);
    const openChooseModal = createOpenHandler(onChooseOpen);
    const closeChooseModal = createCloseHandler(onChooseClose);

    const removeAdHandler = (ad: IAd) => () => {
        setAds((prev) =>
            prev.filter(
                (item) => !(item.type === ad.type && item.login === ad.login)
            )
        );
    };

    const fetchAds = useCallback(() => {
        dispatch(getAllAds());
    }, [dispatch, editMode]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    return (
        <>
            {ads.length < 2 && editMode && (
                <Flex
                    gap={2}
                    flexDirection={{ base: "column", sm: "row" }}
                    w={"100%"}
                >
                    <Button
                        isDisabled={loading}
                        onClick={openCreateModal}
                        w={{ base: "100%", sm: "50%" }}
                        size="sm"
                        colorScheme="green"
                    >
                        Создать
                    </Button>
                    <Button
                        isDisabled={loading}
                        w={{ base: "100%", sm: "50%" }}
                        size="sm"
                        colorScheme="gray"
                        borderWidth={1}
                        onClick={openChooseModal}
                    >
                        Добавить существующий
                    </Button>
                </Flex>
            )}
            {!!ads.length ? (
                ads.map((ad, i) => (
                    <AdItem
                        setAds={setAds}
                        removeAdHandler={removeAdHandler}
                        key={i}
                        index={i}
                        ad={ad}
                        editMode={editMode}
                    />
                ))
            ) : (
                <FormLabel p={2} textAlign="center" borderWidth={1} w={"100%"}>
                    Аккаунт не создан
                </FormLabel>
            )}
            {isCreateOpen && (
                <CreateAd
                    setAds={setAds}
                    ads={ads}
                    onClose={closeCreateModal}
                />
            )}
            {isChooseOpen && (
                <ChooseAd
                    setAds={setAds}
                    ads={ads}
                    onClose={closeChooseModal}
                />
            )}
        </>
    );
};

export default Ad;
