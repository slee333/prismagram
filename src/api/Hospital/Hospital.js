import { prisma } from "../../../generated/prisma-client";

export default {
  Hospital: {
    patients: ({ id }) => prisma.hospital({ id }).patients(),
    staffs: ({ id }) => prisma.hospital({ id }).staffs(),
    rooms: ({ id }) => prisma.hospital({ id }).rooms(),
    admin: ({ id }) => prisma.hospital({ id }).admin(),
    patientsCount: ({ id }) =>
      prisma
        .patientsConnection({ where: { hospital: { id } } })
        .aggregate()
        .count(),
    staffsCount: ({ id }) =>
      prisma
        .staffsConnection({ where: { hospital: { id } } })
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
