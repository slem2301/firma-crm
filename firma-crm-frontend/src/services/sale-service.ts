import { ISale } from "../models/ISale";
import BaseService from "./base-service";

type getSalesStatisticksData = {
    period: {
        from: Date;
        to: Date;
    };
    regionId: number;
    compare: boolean;
    productIds: number[];
};

class SaleService extends BaseService {
    async addSales(data: ISale[]) {
        return this.api.post("/sale/add-sales", { sales: data });
    }
    async loadSales(date: Date) {
        return this.api.post("/sale/load", { date });
    }
    async getSalesByDate(date: Date) {
        return this.api.post(`/sale/get-sales-by-date`, { date });
    }
    async getSalesStatisticks(data: getSalesStatisticksData) {
        return this.api.post(
            `/sale/get-sales-statisticks/${data.regionId}`,
            data
        );
    }
}

export default new SaleService();
