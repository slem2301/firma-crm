/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Spinner } from "@chakra-ui/react";
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { SUCCESS_GET } from "../../const/http-codes";
import { ROLES } from "../../hooks/useRoles";
import { IUser } from "../../models/IUser";
import userService from "../../services/user-service";
import Private from "../private/Private";
import SelectFilter from "./SelectFilter";
import { useSearchParamsState } from "../../hooks/useQueryParamsState";
import { deserializeFilter, serializeFilter } from "../../utils/filters";
import { useStringFilterSearchParamsState } from "../../hooks/useStringFilterSearchParamsState";

type DealerFilterProps = {
    setIds: (ids: string[]) => void;  // ✅
    clearTigger?: boolean;
};

type Item = { name: string; id: string };

const Wrapper = (props: PropsWithChildren<DealerFilterProps>) => {
    return (
        <Private roles={[ROLES.ADMIN]}>
            <DealerFilter {...props} />
        </Private>
    );
};

type FilterProps = {
    defaultValues: string[];
    items: Item[];
    setIds: (ids: string[]) => void;
    clearTigger?: boolean;
};

const Filter = (props: FilterProps) => {
    const { defaultValues, items, clearTigger, setIds } = props;

    const [ids, setStateIds] = useStringFilterSearchParamsState("dealers", items);

    useEffect(() => {
        setIds(ids);
    }, [ids]);

    return (
        <SelectFilter<string>
            clearTrigger={clearTigger}
            filterName="Диллер"
            items={items}
            setFilter={(v) => setStateIds(v)}
            defaultValues={ids}
        />
    );
};

const DealerFilter: React.FC<DealerFilterProps> = ({ setIds, clearTigger }) => {
    const [loading, setLoading] = useState(true);
    const [dealers, setDealers] = useState<IUser[]>([]);

    const items = useMemo(() => {
        return dealers.map((user) => ({
            name: `${user.name ?? user.tag ?? ""} - ${user.email ?? user.login ?? ""}`,
            id: user.id, // ✅ string id
        }));
    }, [dealers]);

    const defaultIds = useMemo(() => {
        return items.map((item) => item.id);
    }, [items]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService().getAll();

            if (response.status === SUCCESS_GET) {
                const users: IUser[] = response.data;


                const isAdmin = (u: IUser) => (u as any).roles?.includes(ROLES.ADMIN);
                const isManager = (u: IUser) => (u as any).roles?.includes(ROLES.MANAGER);
                const hasDealerRole = (u: IUser) => (u as any).roles?.includes(ROLES.DEALER);

                const dealers = users.filter((u) =>
                    hasDealerRole(u) ? true : !isAdmin(u) && !isManager(u)
                );

                setDealers(dealers);
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading || !defaultIds.length)
        return (
            <Flex
                borderWidth={1}
                rounded={2}
                w={"100px"}
                h="32px"
                align="center"
                justify={"center"}
            >
                <Spinner h={"15px"} w={"15px"} />
            </Flex>
        );

    return (
        <Filter
            items={items}
            defaultValues={defaultIds}
            clearTigger={clearTigger}
            setIds={setIds}
        />
    );
};

export default Wrapper;
