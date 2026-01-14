import {
    Box,
    Button,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AutoCompleteInput from "../autoCompleteInput/AutoCompleteInput";
import SingleSelectFilter, { optionType } from "../filters/SingleSelectFilter";
import { useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import { AdType, IAd } from "../../models/IAd";

type ChooseAdProps = {
    onClose: () => void;
    ads: IAd[];
    setAds: React.Dispatch<React.SetStateAction<IAd[]>>;
};

const ChooseAd: React.FC<ChooseAdProps> = ({ onClose, ads, setAds }) => {
    const {
        ad: { ads: allAds },
    } = useAppSelector((state) => state);

    const toast = useAppToast();
    const [options, setOptions] = useState<optionType<AdType>[]>([]);
    const [chooseAdType, setChooseAdType] = useState<AdType>("yandex");
    const [login, setLogin] = useState("");

    const onSubmit = () => {
        const candidate = allAds.find(
            (item) => item.login === login && item.type === chooseAdType
        );
        if (!candidate) {
            return toast({
                text: "Аккаунта с таким логином и типом не существует",
                status: "error",
            });
        }

        setAds((prev) => [...prev, { ...candidate }]);
        onClose();
    };

    useEffect(() => {
        let newOptions: optionType<AdType>[] = [];

        if (!ads.find((ad) => ad.type === "yandex"))
            newOptions.push({
                name: "Яндекс",
                value: "yandex",
            });
        if (!ads.find((ad) => ad.type === "google"))
            newOptions.push({
                name: "Google",
                value: "google",
            });

        setChooseAdType(newOptions[0].value);
        setOptions(newOptions);
    }, [ads]);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Добавить рекламный аккаунт</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack alignItems={"stretch"}>
                        <Box>
                            <FormLabel>Тип аккаунта</FormLabel>
                            <SingleSelectFilter<AdType>
                                bold
                                setValue={setChooseAdType}
                                paired
                                options={options}
                                defaultValue={chooseAdType}
                            />
                        </Box>
                        <AutoCompleteInput<IAd>
                            value={login}
                            attribute="login"
                            allItems={allAds.filter(
                                (item) => item.type === chooseAdType
                            )}
                            onChange={setLogin}
                            otherCondition={(item) =>
                                item.type === chooseAdType
                            }
                            props={{ placeholder: "Логин" }}
                        />
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        mr={3}
                        onClick={onClose}
                    >
                        Отмена
                    </Button>
                    <Button onClick={onSubmit} colorScheme="green" size="sm">
                        Добавить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChooseAd;
