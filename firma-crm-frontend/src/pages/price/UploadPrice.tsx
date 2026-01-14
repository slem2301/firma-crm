import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useBoolean,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FaFileUpload } from "react-icons/fa";
import { PriceVersionFilter } from "../../components/filters/VersionFilter";
import { BAD_REQUEST, SUCCESS_POST } from "../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import priceService from "../../services/price-service";
import { getPriceVersions } from "../../store/slices/price-slice";

type UploadPriceProps = {
    update: () => void;
    setUploadProgress: (value: {
        loading: boolean;
        current: number;
        total: number;
    }) => void;
};

const UploadPrice: React.FC<UploadPriceProps> = ({
    update,
    setUploadProgress,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useAppDispatch();
    const { versions } = useAppSelector((state) => state.price);

    const toast = useAppToast();
    const [version, setVersion] = useState(-1);

    const [editable, setEditable] = useBoolean();
    const [advanced, setAdvanced] = useBoolean();

    const [date, setDate] = useState(new Date());
    const [file, setFile] = useState<null | File>(null);

    useEffect(() => {
        setDate(
            new Date(
                versions.find((_version) => _version.version === version)
                    ?.date || new Date()
            )
        );
    }, [versions, version]);

    const upload = async () => {
        if (!file) return toast({ text: "Выберите файл.", status: "error" });

        try {
            const response = await priceService.upload(
                {
                    file,
                    version: version === -1 ? "new" : version,
                    date,
                },
                (e) => {
                    if (e.loaded === e.total)
                        return setUploadProgress({
                            loading: true,
                            total: 0,
                            current: 0,
                        });

                    setUploadProgress({
                        loading: true,
                        current: (e.loaded * 100) / e.total,
                        total: 100,
                    });
                }
            );

            if (response.status === SUCCESS_POST) {
                toast({ status: "success", text: response.data.message });
                update();
                cancel();
                await dispatch(getPriceVersions());
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response?.status === BAD_REQUEST) {
                toast({ status: "error", text: error.response.data.message });
            }
        }
        setUploadProgress({ loading: false, total: 0, current: 0 });
    };

    const fileHandler = (e: any) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        setFile(file);
    };

    const chooseFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
        input.addEventListener("change", fileHandler);
        input.click();
    };

    const cancel = () => {
        setFile(null);
        setVersion(-1);
        setAdvanced.off();
        setEditable.off();
        onClose();
    };

    return (
        <>
            <Button
                minW={"auto"}
                colorScheme="green"
                onClick={onOpen}
                size="sm"
                leftIcon={<FaFileUpload />}
            >
                Загрузить прайс
            </Button>
            <Modal isOpen={isOpen} onClose={cancel}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Загрузка прайса</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align={"stretch"}>
                            <PriceVersionFilter
                                version={version}
                                setVersion={setVersion}
                                withoutSearch
                                withNew
                            />
                            <Text
                                onClick={setAdvanced.toggle}
                                fontSize={".8em"}
                                cursor={"pointer"}
                                alignSelf="flex-end"
                                color="blue.500"
                                textDecoration={"underline"}
                            >
                                {advanced ? "Скрыть" : "Расширенные настройки"}
                            </Text>
                            {advanced && (
                                <>
                                    <FormControl>
                                        <FormLabel>Версия</FormLabel>
                                        <InputGroup size="sm">
                                            <Input
                                                disabled={!editable}
                                                type="number"
                                                placeholder="Версия"
                                                value={version}
                                                onChange={(e) =>
                                                    setVersion(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                            <InputRightAddon
                                                children={
                                                    <Text
                                                        onClick={
                                                            setEditable.toggle
                                                        }
                                                        fontSize={".8em"}
                                                        cursor={"pointer"}
                                                        textDecoration={
                                                            "underline"
                                                        }
                                                    >
                                                        {editable
                                                            ? "Сохранить"
                                                            : "Изменить"}
                                                    </Text>
                                                }
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <ReactDatePicker
                                        locale={"ru"}
                                        onChange={(date) =>
                                            setDate(date || new Date())
                                        }
                                        selected={date}
                                        dateFormat="dd.MM.yyyy"
                                        customInput={
                                            <Input
                                                size="sm"
                                                placeholder="Выберите период"
                                            />
                                        }
                                    />
                                </>
                            )}
                            <HStack justify={"space-between"}>
                                <Text>
                                    {file ? file.name : "Файл не выбран"}
                                </Text>
                                <Button
                                    leftIcon={<FaFileUpload />}
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={chooseFile}
                                >
                                    Выбрать файл
                                </Button>
                            </HStack>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            mr={3}
                            onClick={cancel}
                        >
                            Отмена
                        </Button>
                        <Button size="sm" colorScheme="green" onClick={upload}>
                            {version === -1 ? "Загрузить" : "Обновить"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UploadPrice;
