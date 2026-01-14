import { IOrder } from "../../../models/IOrder";

export interface ComparePhonesResult {
    phone: {
        id: number;
        initial: string;
        phone: string;
    };
    orders: IOrder[];
}
