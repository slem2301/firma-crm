import { BalanceLimitZone } from "../models/IAd";

export const COLOR_SCHEME = "blue";
export const COLOR_PRIMARY = "blue.500";
export const COLOR_PRIMARY_DARK = "blue.700";

export const GREEN_LIMIT = "green.200";
export const ORANGE_LIMIT = "orange.200";
export const RED_LIMIT = "red.300";

export const LIMIT_BG: Record<BalanceLimitZone, string> = {
    ORANGE_ZONE: ORANGE_LIMIT,
    RED_ZONE: RED_LIMIT,
    GREEN_ZONE: GREEN_LIMIT,
};
