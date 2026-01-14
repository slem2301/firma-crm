import BaseService from "./base-service";

type AddProps = {
    yandex: number;
    google: number;
    projectId: number;
    date: Date;
    currencyKey: string;
    currencyId: number;
};

type GetByProjectIdProps = {
    projectId: number;
    period: {
        from: Date;
        to: Date;
    };
};

type GetOnByDateProps = {
    projectId: number;
    date: Date;
};

class ExpenseService extends BaseService {
    async add(data: AddProps) {
        return this.api.post("/expense/add-to-project", data);
    }
    async getByProjectId(data: GetByProjectIdProps) {
        return this.api.post("/expense/get-by-project-id", data);
    }
    async getOneByDate(data: GetOnByDateProps) {
        return this.api.post("/expense/get-one", data);
    }
}

export default new ExpenseService();
