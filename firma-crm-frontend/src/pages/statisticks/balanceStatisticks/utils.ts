import { BalanceLimitZone, BalanceLimits } from "../../../models/IAd";

export const getBalanceZone = (
    balance: number,
    currencyKey: string,
    balanceLimits: BalanceLimits
): BalanceLimitZone => {
    const limits = balanceLimits[currencyKey];

    if (limits) {
        let zone: BalanceLimitZone = "GREEN_ZONE";

        Object.keys(limits)
            .map(Number)
            .sort((a, b) => b - a)
            .forEach((limit) => {
                if (balance < limit) {
                    zone = limits[limit];
                }
            });

        return zone;
    }

    return "GREEN_ZONE";
};
