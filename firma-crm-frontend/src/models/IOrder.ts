import { ICurrency } from "./ICurrency";
import { IPrice } from "./IPrice";
import { IRequest } from "./IRequest";

export interface OrderType {
    name: string;
    identity: string;
    id: number;
}

export interface OrderStatus {
    name: string;
    id: number;
}

type OrderProduct = IPrice & { OrderPrice: { count: number } };

export interface IOrder {
    id: number;
    order_id: number;
    phones: string;
    price: number;
    date: string;
    date_route: string | null;
    address: string;
    delivery: string;
    stock: string;
    info: string;
    status: string;
    dealer: string;
    tag: string;
    otkat: number;
    hasPrevOrders: boolean;

    block?: IOrderBlock;

    dealerOtkat: number;

    currencyId: number;
    currency: ICurrency;

    userId: number;

    typeId: number;
    type?: OrderType;

    requestId?: number;
    request?: IRequest;

    products: OrderProduct[];
}

export const orderSignature: IOrder = {
    id: 1,
    order_id: 1,
    phones: "1",
    price: 1,
    date: "1",
    date_route: "1",
    hasPrevOrders: false,
    address: "1",
    delivery: "1",
    stock: "1",
    info: "1",
    status: "1",
    dealerOtkat: 1,
    dealer: "1",
    tag: "1",
    otkat: 1,

    currencyId: 1,
    currency: {
        id: -1,
        key: "1",
        symbol: "1",
        name: "1",
    },

    userId: 1,

    typeId: 1,

    products: [],
};

export interface IOrderBlock {
    id: number;
    orderId: number;
    fields: string;
}
