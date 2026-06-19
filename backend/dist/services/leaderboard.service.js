import { prisma } from "../configs/database.config.js";
import { RoleEnum } from "../generated/prisma/client.js";
export class LeaderboardService {
    static getLeaderboard = async (limit) => {
        const users = await prisma.user.findMany({
            where: {
                role: RoleEnum.MAHASISWA,
            },
            orderBy: [{ xp: "desc" }, { name: "asc" }],
            take: limit,
            select: {
                name: true,
                xp: true,
            },
        });
        return users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            xp: user.xp,
        }));
    };
}
//# sourceMappingURL=leaderboard.service.js.map