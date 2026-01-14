import { sortValueType } from "../hooks/useSort";
import { IPrice } from "../models/IPrice";
import BaseService from "./base-service";

export type getAllPriceParams = {
    search: string;
    pagination: {
        page: number;
        itemsPerPage: number;
    };
    sort: {
        key: string;
        value: sortValueType;
    };
    filters: {
        productTypeIds: number[];
    };
    version: number;
};

export type uploadPriceParams = {
    version: "new" | number;
    file: File;
    date: Date;
};

class PriceService extends BaseService {
    async getAll(data: getAllPriceParams) {
        return this.api.post("/price/get-all", data);
    }

    async getInfo() {
        return this.api.get("/price/");
    }

    async upload(dto: uploadPriceParams, onUploadProgress: (e: any) => void) {
        const data = new FormData();
        data.append("file", dto.file);
        data.append("version", dto.version.toString());
        data.append("date", dto.date.toString());
        return this.api.post("/price/upload", data, {
            onUploadProgress,
        });
    }

    async update(data: IPrice) {
        return this.api.put("/price", data);
    }

    async getById(id: number) {
        return this.api.get(`/price/${id}`);
    }

    async getVersions() {
        return this.api.get("/price/get-versions");
    }
}

export default new PriceService();
