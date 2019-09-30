import { prisma } from "../../../generated/prisma-client";

export default {
  Hospital: {
    patients: ({ id }) => prisma.hospital({ id }).patients(),
    staffs: ({ id }) => prisma.hospital({ id }).staffs(),
    rooms: ({ id }) => prisma.hospital({ id }).rooms(),
    admin: ({ id }) => prisma.hospital({ id }).admin(),
    files: ({ id }) => prisma.hospital({ id }).files(),
    patientsCount: ({ id }) =>
      prisma
        .usersConnection({ where: { patientof_some: {id } } })
        .aggregate()
        .count(),
    staffsCount: ({ id }) =>
      prisma
      .usersConnection({ where: { staffof_some: { id } } })
        .aggregate()
        .count(),
    isYours: async (parent, _, { request }) => {
      // 이 병원의 Admin이 나인지 알아보기 위한 코드. 수정이 필요함
      const { user } = request;
      const { id: parentId } = parent;
      const ADMIN = await prisma.hospital({ id: parentId }).admin();

      return user.id === ADMIN.id;
    }
  }
};
