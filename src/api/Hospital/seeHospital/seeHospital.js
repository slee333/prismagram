import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeHospital: async (_, args) => {
      const { name } = args;
      return prisma.hospital({ name });
    }
  }
};