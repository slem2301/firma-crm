import { useCallback, useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { ICallsStatisticksData } from "../../../models/IStatisticks";
import statisticksService from "../../../services/statisticks-service";
import { useAppSelector } from "../../../hooks/redux";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import { Link as RouterLink } from "react-router-dom";
import { getMaskedPhone } from "../../phones/CategoryItem";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import { ROUTES } from "../../../router/routes";
import { Link } from "@chakra-ui/react";

export const CallsChart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ICallsStatisticksData[]>([]);
    const period = useAppSelector((state) => state.app.period);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        statisticksService
            .getCalls({
                period,
            })
            .then((response) => setData(response.data))
            .finally(() => setIsLoading(false));
    }, [period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Table
            props={{
                mt: { base: 2, sm: 4 },
            }}
            toolbar={<UpdateButton isLoading={isLoading} onClick={fetchData} />}
            maxH={"80vh"}
            rows={data}
            headers={[
                {
                    name: "Номер",
                    key: "phone",
                    props: {
                        w: "400px",
                    },
                    render: (phone) => {
                        const maskedPhone = phone.region
                            ? getMaskedPhone(phone.region.name, phone.phone)
                            : phone.phone;

                        return (
                            <Link
                                as={RouterLink}
                                to={getPathWithParam(
                                    ROUTES.phone.path,
                                    phone.id
                                )}
                            >
                                {maskedPhone}
                            </Link>
                        );
                    },
                },
                {
                    name: "Звонков",
                    key: "calls",
                },
            ]}
        />
    );
};
