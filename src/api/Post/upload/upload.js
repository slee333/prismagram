import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    upload: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { caption, files, location } = args;

      // 일단 파일이 없는 post를 만들고
      const post = await prisma.createPost({
        caption,
        location,
        user: { connect: { id: user.id } }
      });

      // 각각의 파일들을 만들어 post와 연결시켜주는 방식입니다.
      files.forEach(
        async file =>
          await prisma.createFile({
            url: file,
            post: {
              connect: {
                id: post.id
              }
            }
          })
      );
      return post;
    }
  }
};
