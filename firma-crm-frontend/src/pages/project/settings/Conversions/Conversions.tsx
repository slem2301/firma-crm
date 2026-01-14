import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import ConversionSettings from "./Settings/ConversionSettings";

type ConversionsProps = {
    projectId: number;
};

const Conversions: React.FC<ConversionsProps> = ({ projectId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                w="100%"
                onClick={onOpen}
                size="sm"
                colorScheme="blue"
                variant={"outline"}
            >
                Настройки конверсий
            </Button>
            {isOpen && (
                <ConversionsModal projectId={projectId} onClose={onClose} />
            )}
        </>
    );
};

type ConversionsModalProps = {
    onClose: () => void;
    projectId: number;
};

type modeType = "google" | "yandex" | "idle";

const ConversionsModal: React.FC<ConversionsModalProps> = ({
    onClose,
    projectId,
}) => {
    const [mode, setMode] = useState<modeType>("idle");
    const name = useMemo(() => {
        return mode === "google" ? "Google" : "Яндекс";
    }, [mode]);

    const changeMode = (mode: modeType) => () => setMode(mode);

    return (
        <Modal isCentered size={"lg"} isOpen onClose={onClose}>
            <ModalOverlay />
            <ModalContent pb={3}>
                {mode === "idle" && <ModalCloseButton />}
                <ModalHeader
                    fontSize={{ base: 16, sm: 20 }}
                    display={"flex"}
                    justifyContent="space-between"
                >
                    Настройки конверсий {mode !== "idle" && name}
                    {mode !== "idle" && (
                        <Button
                            ms="auto"
                            borderColor={"dark"}
                            variant="outline"
                            display={"block"}
                            size="xs"
                            onClick={changeMode("idle")}
                        >
                            Назад
                        </Button>
                    )}
                </ModalHeader>
                <ModalBody>
                    {mode === "idle" ? (
                        <HStack
                            h={{ base: "100px", sm: "35vh" }}
                            alignItems="stretch"
                        >
                            <Button
                                borderColor={"dark"}
                                variant="outline"
                                flexGrow={1}
                                h="auto"
                                onClick={changeMode("google")}
                            >
                                Google
                            </Button>
                            <Button
                                borderColor={"dark"}
                                flexGrow={1}
                                h="auto"
                                variant="outline"
                                onClick={changeMode("yandex")}
                            >
                                Яндекс
                            </Button>
                        </HStack>
                    ) : (
                        <ConversionSettings mode={mode} projectId={projectId} />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default Conversions;
