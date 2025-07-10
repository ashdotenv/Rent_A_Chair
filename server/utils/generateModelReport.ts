import { PrismaClient, Prisma } from "@prisma/client"
const prisma = new PrismaClient()

type ModelName = keyof PrismaClient

type ReportFilters = {
    startDate?: Date | string
    endDate?: Date | string
    [key: string]: any
}

export async function generateModelReport<T extends ModelName>(
    modelName: T,
    filters: ReportFilters = {},
    sumField?: string
) {
    const model = prisma[modelName] as any
    if (!model) throw new Error(`Model "${modelName as string}" not found in Prisma client`)

    const where: Record<string, any> = {}

    if (filters.startDate || filters.endDate) {
        where.createdAt = {}
        if (filters.startDate) where.createdAt.gte = new Date(filters.startDate)
        if (filters.endDate) where.createdAt.lte = new Date(filters.endDate)
    }

    Object.entries(filters).forEach(([key, value]) => {
        if (key !== "startDate" && key !== "endDate") {
            where[String(key)] = value
        }
    })

    const totalCount = await model.count({ where })

    let totalSum: number | null = null
    if (sumField) {
        try {
            const aggregateResult = await model.aggregate({
                _sum: {
                    [sumField]: true,
                },
                where,
            })
            totalSum = aggregateResult._sum[sumField] ?? null
        } catch {
            totalSum = null
        }
    }

    return {
        model: modelName,
        totalCount,
        totalSum,
    }
}
