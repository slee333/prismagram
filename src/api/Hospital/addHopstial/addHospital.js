import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    addHospital: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { name, email = "", location = "", contact = "", bio = "" } = args;
      const { user } = request;
      console.log(user.id)
      return prisma.createHospital({
        name,
        admin: {
          connect: {
            id: user.id
          }
        },
        email,
        location,
        contact,
        bio
      });
    }
  }
};
