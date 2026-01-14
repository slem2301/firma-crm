import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
    deletePhoneFromBlacklist,
    getAllBlockedPhones,
} from "../../store/slices/blacklist-slice";
import Toolbar from "./Toolbar";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";

import useTitle from "../../hooks/useTitle";

import Table from "../../components/table/Table";
import { IBlacklist } from "../../models/IBlacklist";
import { ROLES, useRoles } from "../../hooks/useRoles";

const Blacklist = () => {
    useTitle("Черный список");
    const { phones, loading } = useAppSelector((state) => state.blacklist);
    const [search, setSearch] = useState("");
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [deletedId, setDeletedId] = useState<number>(-1);
    const { hasRoles } = useRoles();

    const dispatch = useAppDispatch();

    const fetchPhones = useCallback(async () => {
        await dispatch(getAllBlockedPhones(search));
    }, [search, dispatch]);

    useEffect(() => {
        fetchPhones();
    }, [fetchPhones]);

    const deleteHandler = (id: number) => async () => {
        await dispatch(deletePhoneFromBlacklist(id));
        fetchPhones();
        onClose();
    };

    const openDialog = (id: number) => {
        setDeletedId(id);
        onOpen();
    };

    return (
        <Page toolbar={<Toolbar search={search} setSearch={setSearch} />}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Table<IBlacklist>
                        maxH={"84vh"}
                        headers={[
                            {
                                name: "Номер",
                                key: "phone",
                                helperText: (item) => item.reason,
                                helperTextProps: {
                                    display: { base: "block", sm: "none" },
                                    color: "black",
                                },
                            },
                            {
                                name: "Причина",
                                key: "reason",
                                sortable: false,
                                hideOn: "sm",
                            },
                            {
                                name: "Удалить",
                                align: "center",

                                props: {
                                    display: hasRoles([
                                        ROLES.ADMIN,
                                        ROLES.MANAGER,
                                    ])
                                        ? "table-cell"
                                        : "none",
                                },
                                rowProps: {
                                    display: hasRoles([
                                        ROLES.ADMIN,
                                        ROLES.MANAGER,
                                    ])
                                        ? "table-cell"
                                        : "none",
                                },

                                render: (item) => (
                                    <Button
                                        size="xs"
                                        colorScheme="red"
                                        onClick={() => openDialog(item.id)}
                                    >
                                        Удалить
                                    </Button>
                                ),
                            },
                        ]}
                        rows={phones}
                    />
                </>
            )}
            <ConfirmDialog
                isOpen={isOpen}
                onCancel={onClose}
                onAccept={deleteHandler(deletedId)}
                title="Удалить номер"
                text={`Вы уверены, что хотите удалить номер "${
                    phones.find((item) => item.id === deletedId)?.phone
                }" из черного списка?`}
            />
        </Page>
    );
};

export default Blacklist;
