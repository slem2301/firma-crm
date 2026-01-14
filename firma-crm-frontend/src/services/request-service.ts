import BaseService from "./base-service";

export interface getRequestsFilters {
    source: string;
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
        value: "ASC" | "DESC";
    };
}

interface getAllFilters {
    pagination: {
        page: number;
        itemsPerPage: number;
    };
    filters: {
        regionIds: number[];
        productIds: number[];
    };
    period: {
        from: Date;
        to: Date;
    };
}

class RequestService extends BaseService {
    async getByProjectId(projectId: number, filters: getRequestsFilters) {
        return this.api.post(
            `/requests/get-by-project-id/${projectId}`,
            filters
        );
    }

    async getAll(filters: getAllFilters) {
        return this.api.post("/requests/get-all", filters);
    }
}

export default new RequestService();
