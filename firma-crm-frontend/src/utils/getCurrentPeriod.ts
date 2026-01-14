export const getCurrentPeriod = (): [Date, Date] => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);      // 1-е число
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);    // 1-е след. месяца
    return [from, to];
};

export const getMonthPeriod = (toCurrent?: boolean) => {
    const [from, to] = getCurrentPeriod();

    from.setDate(1);

    if (!toCurrent)
        to.setDate(new Date(to.getFullYear(), to.getMonth() + 1, 0).getDate());

    return [from, to];
};
