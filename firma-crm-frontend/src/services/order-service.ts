import { sortValueType } from "../hooks/useSort";
import { IOrder } from "../models/IOrder";
import BaseService from "./base-service";

type GetAllProps = {
    search: string;
    period: {
        from: Date;
        to: Date;
    };
    pagination: {
        page: number;
        itemsPerPage: number;
    };
    sort: {
        key: string;
        value: sortValueType;
    };
    filters: {
        countryIds: number[];
        typeIds: number[];
        dealerIds: string[];
        statusIds: number[];
        productTypeIds: number[];
    };
    withRouteDate: boolean;
};

type startParseProps = {
    date: Date;
    secondDate?: Date;
};

type updateProps = {
    order: IOrder;
    fields: string;
};

class OrderService extends BaseService {
    async getAll(data: GetAllProps) {
        return this.api.post("/order/get-all", data);
    }
    async getOrderTypes() {
        return this.api.get("/otypes/");
    }
    async startParse(data: startParseProps) {
        return this.api.post("/order/", data);
    }
    async updateKey(key: string) {
        return this.api.put(`/order/change-session-id/`, { key });
    }
    async checkKey() {
        return this.api.get("/order/check-session-id");
    }
    async getStatuses() {
        return this.api.get("/order/get-statuses");
    }
    async getById(id: number) {
        return this.api.get(`/order/${id}`);
    }
    async update(data: updateProps) {
        return this.api.put("/order/", data);
    }
    async clearBlocks(id: number) {
        return this.api.delete(`/order/clear-blocks/${id}`);
    }
    async comparePhones(phones: string[]) {
        return this.api.post(`/order/compare-phones`, { phones });
    }
}

export default new OrderService();
