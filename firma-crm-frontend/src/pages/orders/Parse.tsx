import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useBoolean,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../axios";
import socketIO from "socket.io-client";
import { format } from "date-fns";
import orderService from "../../services/order-service";
import { FaCheck, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import ModalLoader from "../../components/ui/modal-loading/ModalLoader";

const Parse = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                alignSelf={"flex-start"}
                onClick={onOpen}
                colorScheme="blue"
                size="sm"
                w="100%"
                maxW="300px"
                variant="outline"
            >
                Загрузить
            </Button>
            {isOpen && <ParseModal onOpen={onOpen} onClose={onClose} />}
        </>
    );
};

type ParseModalProps = {
    onClose: () => void;
    onOpen: () => void;
};

type StageType = "start" | "parsing" | "serialisation" | "end" | "idle" | null;

type InfoType = {
    message: string;
    current?: string | number;
    total?: string | number;
    id?: number;
    stage: StageType;
    time: number;
};

const statuses: { [key: string]: string } = {
    parsing: "Парсинг",
    serialisation: "Обработка",
    end: "Статус",
    start: "Статус",
};

const ParseModal: React.FC<ParseModalProps> = ({ onClose, onOpen }) => {
    const [messages, setMessages] = useState<
        {
            text: string;
            status: string;
            time: string;
        }[]
    >([]);
    const [stage, setStage] = useState<StageType>(null);

    const [changeKeyMode, changeKey] = useBoolean();
    const [key, setKey] = useState("");
    const [keyLoading, setLoading] = useState(false);

    const inProgress = stage !== "idle" && stage !== "end";

    const [period, setPeriod] = useState<[Date, Date]>([
        new Date(),
        new Date(),
    ]);
    const [from, to] = period;

    const saveNewKey = async () => {
        setLoading(true);
        await orderService.updateKey(key);
        setLoading(false);
        toggleKey();
    };

    const startParse = () => {
        setMessages([]);
        setStage("start");
        const date = from;
        date.setHours(12);
        const secondDate = from.getDate() === to.getDate() ? undefined : to;
        secondDate?.setHours(12);
        try {
            orderService.startParse({ date, secondDate });
        } catch (e) {}
    };

    useEffect(() => {
        const socket = socketIO(API_URL as any);

        socket.on("parse-info", (info: InfoType) => {
            const { stage, message, current, total, id, time } = info;
            setStage(stage);

            if (stage === "idle") return;

            let text = message;

            if (current)
                text =
                    stage === "parsing"
                        ? `${current} из ${total}. Парсинг заказа #${id} закончен.`
                        : `${current} из ${total}. Обработка заказа #${id} закончена.`;

            setMessages((prev) => [
                {
                    status: statuses[stage as string],
                    text,
                    time: format(new Date(time), "hh:mm:ss"),
                },
                ...prev,
            ]);
        });

        return () => {
            socket.close();
        };
    }, []);

    const toggleKey = () => {
        setKey("");
        changeKey.toggle();
    };

    const setPeriodHandler = (range: any) => {
        setPeriod(range);
    };

    return (
        <Modal size="xl" isOpen onClose={onClose}>
            <ModalOverlay />
            {stage ? (
                <ModalContent maxW="1000px">
                    <ModalHeader
                        pr={{ base: 6, sm: 14 }}
                        gap={2}
                        as={Flex}
                        align="center"
                        justify="space-between"
                        flexWrap={"wrap"}
                    >
                        <Text
                            display={{
                                base: "block",
                                sm: changeKeyMode ? "none" : "block",
                            }}
                        >
                            Загрузка заказов
                        </Text>
                        {changeKeyMode ? (
                            <HStack flex={1}>
                                <Input
                                    colorScheme="green"
                                    size="sm"
                                    w="100%"
                                    minW={{ base: "0", sm: "240px" }}
                                    autoFocus
                                    placeholder="Новый ключ"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                />
                                <IconButton
                                    size="xs"
                                    colorScheme="green"
                                    rounded={20}
                                    aria-label="save key"
                                    icon={<FaCheck />}
                                    isLoading={keyLoading}
                                    onClick={saveNewKey}
                                />
                                <IconButton
                                    isDisabled={keyLoading}
                                    onClick={toggleKey}
                                    size="xs"
                                    colorScheme="blue"
                                    rounded={20}
                                    aria-label="cancel"
                                    icon={<FaTimes />}
                                />
                            </HStack>
                        ) : (
                            <Button
                                w={{ base: "100%", sm: "304px" }}
                                onClick={toggleKey}
                                isDisabled={inProgress}
                                size="sm"
                                variant={"outline"}
                                colorScheme="green"
                            >
                                Обновить сессионный ключ
                            </Button>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody minH="75vh" maxH="75vh" overflowY={"auto"}>
                        <VStack align="stretch">
                            <Box maxW="190px" w="100%">
                                <DatePicker
                                    locale={"ru"}
                                    selectsRange={true}
                                    startDate={from}
                                    endDate={to}
                                    dateFormat="dd.MM.yyyy"
                                    onChange={setPeriodHandler}
                                    customInput={
                                        <Input
                                            size="sm"
                                            placeholder="Выберите период"
                                        />
                                    }
                                />
                            </Box>
                            <Button
                                loadingText="Загрузка..."
                                colorScheme="blue"
                                variant={"outline"}
                                isLoading={inProgress}
                                onClick={startParse}
                            >
                                <VStack spacing={0}>
                                    <Text> Начать загрузку</Text>
                                    {from && to && (
                                        <Text fontSize=".7em">
                                            за{" "}
                                            {from.getDate() === to.getDate()
                                                ? format(from, "dd.MM.yyyy")
                                                : `${format(
                                                      from,
                                                      "dd.MM.yyyy"
                                                  )} - ${format(
                                                      to,
                                                      "dd.MM.yyyy"
                                                  )}`}
                                        </Text>
                                    )}
                                </VStack>
                            </Button>
                            {!!messages.length && (
                                <VStack
                                    p={2}
                                    borderWidth={1}
                                    rounded={2}
                                    spacing={1}
                                    align="stretch"
                                >
                                    {messages.map((message, i) => (
                                        <HStack
                                            key={i}
                                            spacing={1}
                                            align="center"
                                        >
                                            <Text color="green.300">
                                                [{message.time}]
                                            </Text>
                                            <Text fontWeight={500}>
                                                {message.status}:
                                            </Text>
                                            <Text>{message.text}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            ) : (
                <ModalLoader />
            )}
        </Modal>
    );
};

export default Parse;
