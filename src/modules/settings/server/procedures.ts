import prisma from "@/lib/database";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  get: baseProcedure.query(async () => {
    const settings = await prisma.appSettings.findFirst();
    return settings ?? null;
  }),
  setKeys: baseProcedure
    .input(
      z.object({
        zaiApiKey: z.string().optional(),
        e2bApiKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const settings = await prisma.appSettings.upsert({
        where: { id: "default" },
        update: { zaiApiKey: input.zaiApiKey ?? undefined, e2bApiKey: input.e2bApiKey ?? undefined },
        create: { id: "default", zaiApiKey: input.zaiApiKey, e2bApiKey: input.e2bApiKey },
      });
      return settings;
    }),
});