import { HStack, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { IPhone } from "../../../models/IPhone";
import { useMemo } from "react";
import { getMaskedPhone } from "../CategoryItem";
import Table from "../../../components/table/Table";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../../router/routes";
import useTitle from "../../../hooks/useTitle";

interface PhonePageProps {
    phone: IPhone;
}

export const PhonePage = (props: PhonePageProps) => {
    const { phone } = props;
    const calls = phone.calls;

    const maskedPhone = useMemo(() => {
        if (!phone.region) {
            return phone.phone;
        }

        return getMaskedPhone(phone.region.name, phone.phone);
    }, [phone]);

    useTitle(maskedPhone);

    return (
        <VStack alignItems={"flex-start"} spacing={0}>
            <Heading
                size="md"
                background={"blue.500"}
                color="#fff"
                borderTopRadius={4}
                p={2}
            >
                {maskedPhone}
            </Heading>
            <Table
                rows={calls}
                props={{
                    borderTopLeftRadius: 0,
                }}
                maxH={"88vh"}
                toolbar={
                    <HStack>
                        <Text>Звонков: {calls.length}</Text>
                    </HStack>
                }
                headers={[
                    {
                        name: "#",
                        key: "id",
                        sortable: false,
                    },
                    {
                        name: "Номер",
                        key: "client_number",
                        sortable: false,
                        render: ({ client_number }) => {
                            if (phone.region) {
                                return getMaskedPhone(
                                    phone.region.name,
                                    client_number
                                );
                            }

                            return client_number;
                        },
                    },
                    {
                        name: "Заказ",
                        render: ({ order }) => {
                            if (!order) return null;

                            return (
                                <Link
                                    as={RouterLink}
                                    to={`${ROUTES.orders.path}?search=${order.order_id}`}
                                >
                                    {order.type?.name}: {order.order_id}
                                </Link>
                            );
                        },
                    },
                ]}
            />
        </VStack>
    );
};
