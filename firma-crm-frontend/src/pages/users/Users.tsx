import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import Table from "../../components/table/Table";
import Page from "../../components/ui/page/Page";
import { SUCCESS_GET } from "../../const/http-codes";
import { ROLES } from "../../hooks/useRoles";
import useTitle from "../../hooks/useTitle";
import { IUser } from "../../models/IUser";
import userService from "../../services/user-service";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";
import DeleteUser from "./DeleteUser";
import EditUser from "./EditUser";
import ToggleUser from "./ToggleActiveUser";

const Users = () => {
    useTitle("Аккаунты");

    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState<IUser[]>([]);
    const [admins, setAdmins] = useState<IUser[]>([]);
    const [managers, setManagers] = useState<IUser[]>([]);
    const [dealers, setDealers] = useState<IUser[]>([]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService().getAll();

            if (response.status === SUCCESS_GET) {
                const data = response.data;

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.users)
                        ? data.users
                        : data?.user
                            ? [data.user]
                            : [];

                setUsers(list);
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {

        const admins = users.filter((user) => user.roles?.includes(ROLES.ADMIN));
        const managers = users.filter(
            (user) => user.roles?.includes(ROLES.MANAGER) && !admins.some((a) => a.id === user.id)
        );
        const dealers = users.filter(
            (user) => !admins.some((a) => a.id === user.id) && !managers.some((m) => m.id === user.id)
        );

        console.log(users)

        setAdmins(admins);
        setManagers(managers);
        setDealers(dealers);
        setLoading(false);
    }, [users]);

    return (
        <Page>
            <VStack align="stretch">
                <HStack>
                    <AddUser users={users} update={fetchUsers} />
                </HStack>
                <Accordion defaultIndex={[2]} allowMultiple>
                    <AccordionItem>
                        <AccordionButton
                            borderLeftWidth={1}
                            borderRightWidth={1}
                            justifyContent={"space-between"}
                        >
                            <Text>Администраторы</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel p={0} pb={2}>
                            <UsersTable
                                update={fetchUsers}
                                loading={loading}
                                users={admins}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionButton
                            borderLeftWidth={1}
                            borderRightWidth={1}
                            justifyContent={"space-between"}
                        >
                            <Text>Менеджеры</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel p={0}>
                            <UsersTable
                                update={fetchUsers}
                                loading={loading}
                                users={managers}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionButton
                            borderLeftWidth={1}
                            borderRightWidth={1}
                            justifyContent={"space-between"}
                        >
                            <Text>Диллеры</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel p={0} pb={2}>
                            <UsersTable
                                update={fetchUsers}
                                loading={loading}
                                users={dealers}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </VStack>
        </Page>
    );
};

export default Users;

type UsersTableProps = {
    users: IUser[];
    loading: boolean;
    update: () => void;
};

const UsersTable: React.FC<UsersTableProps> = ({ users, loading, update }) => {
    if (loading)
        return (
            <Flex p={3} align="center" justify="center">
                <Spinner thickness="4px" w={"40px"} h={"40px"} />
            </Flex>
        );

    return users.length ? (
        <Table<IUser>
            props={{
                rounded: 0,
            }}
            headers={[
                {
                    name: "",
                    render: (item) => (
                        <EditUser update={update} user={item} users={users} />
                    ),
                },
                {
                    name: "Логин",
                    render: (item) => (
                        <Text opacity={(item as any).isActive === false ? 0.5 : 1}>
                            {(item as any).login ?? (item as any).email ?? "-"}
                        </Text>
                    ),
                },
                {
                    name: "Метка",
                    render: (item) => <>{(item as any).tag ?? (item as any).name ?? "-"}</>,
                },
                {
                    name: "Создан",
                    key: "createdAt",
                    render: (item) => (
                        <>
                            {format(
                                new Date(item.createdAt),
                                "dd.MM.yyyy HH:mm"
                            )}
                        </>
                    ),
                },
                {
                    name: "",
                    render: (item) => (
                        <HStack>
                            <ChangePassword update={update} user={item} />
                            {/* <DeleteUser update={update} login={(item as any).login ?? (item as any).email} userId={item.id} /> */}
                            <ToggleUser
                                update={update}
                                login={(item as any).login ?? (item as any).email}
                                userId={item.id}
                                isActive={(item as any).isActive ?? true}
                            />
                        </HStack>
                    ),
                },
            ]}
            rows={users}
        />
    ) : (
        <Text borderWidth={1} px={4} py={6}>
            Аккаунты не найдены
        </Text>
    );
};
