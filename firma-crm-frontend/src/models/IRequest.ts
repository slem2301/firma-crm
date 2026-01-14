import { IOrder } from "./IOrder";
import { IPrice } from "./IPrice";
import { IProduct } from "./IProduct";
import { IProject } from "./IProject";

export interface IRequest {
    id: number;
    phone: string;
    name: string | null;
    data: string;
    from: string;
    source: string;
    utm: string;
    projectId: number;
    project?: IProject;
    createdAt: string;
    order?: IOrder;
    comment?: string;
    product?: IPrice;
    productType?: IProduct;
}

export const requestSignature: IRequest = {
    id: 1,
    phone: "1",
    name: "1",
    data: "1",
    from: "1",
    utm: "1",
    source: "1",
    projectId: 1,
    createdAt: "1",
};
