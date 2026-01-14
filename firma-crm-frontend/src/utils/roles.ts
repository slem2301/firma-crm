export const normalizeRoles = (roles: any): string[] => {
    if (!roles) return [];

    // Уже string[]
    if (Array.isArray(roles) && typeof roles[0] === "string") {
        return roles.filter(Boolean);
    }

    // Старый формат: [{ role: "ADMIN" }]
    if (Array.isArray(roles) && typeof roles[0] === "object") {
        return roles
            .map((r) => r?.role?.name ?? r?.role ?? r?.name ?? r?.code)
            .filter(Boolean);
    }

    // Если вдруг строка "ADMIN,MANAGER"
    if (typeof roles === "string") {
        return roles.split(",").map((s) => s.trim()).filter(Boolean);
    }

    return [];
};
