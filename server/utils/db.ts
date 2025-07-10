import { PrismaClient } from "@prisma/client";

export async function checkDBConnection() {
    try {
        await new PrismaClient().$queryRaw`SELECT 1`;
        console.log(`Db Connected`);

    } catch (error) {
        console.error('Database connection check failed:', error);
        return false;
    }
}