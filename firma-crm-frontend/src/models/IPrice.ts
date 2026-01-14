export interface IPrice {
    id: number;
    product_id: number;
    name: string;
    rb_buy: number;
    price_rb: number;
    delivery_c_br: number;
    delivery_c_usd: number;
    delivery_r_br: number;
    delivery_r_usd: number;
    price_delivery_br: number;
    ru_buy: number;
    price_ru: number;
    delivery_ru_ru: number;
    delivery_ru_usd: number;
    price_delivery_ru: number;
    koef: number;
    exchange_br: number;
    exchange_ru: number;
    version: number;
    date: string;
    otkat_ru: number;
    otkat_rb: number;
    otkat_ru_d: number;
    otkat_rb_d: number;
}

export const priceSignature: IPrice = {
    id: 1,
    product_id: 1,
    name: "1",
    rb_buy: 1,
    price_rb: 1,
    delivery_c_br: 1,
    delivery_c_usd: 1,
    delivery_r_br: 1,
    delivery_r_usd: 1,
    price_delivery_br: 1,
    ru_buy: 1,
    price_ru: 1,
    delivery_ru_ru: 1,
    delivery_ru_usd: 1,
    price_delivery_ru: 1,
    koef: 1,
    exchange_br: 1,
    exchange_ru: 1,
    version: 1,
    date: "",
    otkat_rb: 0,
    otkat_rb_d: 0,
    otkat_ru: 0,
    otkat_ru_d: 0,
};
