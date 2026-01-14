import BaseService from "./base-service";

interface DownloadOrdersReport {
    regionIds: number[];
    period: { from: Date; to: Date };
    productTypeIds: number[];
    orderTypeIds: number[];
    statusIds: number[];
    routeDate: boolean;
    fields: Array<{
        name: string;
        key: string;
    }>;
}

class ExcelService extends BaseService {
    async downloadOrdersReport(data: DownloadOrdersReport) {
        return this.api.post("order/generate-excel-report", data, {
            responseType: "arraybuffer",
        });
    }
}

export default new ExcelService();
