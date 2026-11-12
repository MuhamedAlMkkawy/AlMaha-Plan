// PATCH /api/admin/plots/:plotNo/contract
// Saves contract fields for one plot. Admin only.
//
// The two TODOs are the only parts that depend on your project:
//  1. reuse the same admin check your other /api/admin endpoints use
//  2. persist the fields with your existing plots data layer

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default defineEventHandler(async (event) => {
    // TODO 1: admin check, e.g. `await requireAdmin(event)`

    const plotNo = Number(getRouterParam(event, 'plotNo'));
    if (!Number.isInteger(plotNo) || plotNo < 1 || plotNo > 973) {
        throw createError({ statusCode: 400, statusMessage: 'رقم القطعة غير صحيح' });
    }

    const body = await readBody<Record<string, unknown>>(event);

    const buyerId = str(body.buyerId, 10);
    if (buyerId && !/^\d{10}$/.test(buyerId)) {
        throw createError({ statusCode: 400, statusMessage: 'رقم الهوية يجب أن يتكون من 10 أرقام' });
    }

    // null means "use the default terms"
    let contractTerms: string[] | null = null;
    if (Array.isArray(body.contractTerms)) {
        contractTerms = body.contractTerms
            .filter((t): t is string => typeof t === 'string')
            .map((t) => t.trim().slice(0, 3000))
            .filter(Boolean)
            .slice(0, 50);
        if (!contractTerms.length) contractTerms = null;
    }

    const update = {
        contractNo: str(body.contractNo, 30),
        contractDate: str(body.contractDate, 30),
        contractNote: str(body.contractNote, 500),
        contractTerms,
        buyerName: str(body.buyerName, 120),
        buyerId,
        buyerBirthDate: str(body.buyerBirthDate, 30),
        buyerPhone: str(body.buyerPhone, 20),
    };

    // TODO 2: persist `update` on plot `plotNo`, e.g.
    // await updatePlot(plotNo, update);

    return { success: true, data: update };
});