TO-DO LIST

[X] 병원 데이터모델 만들기
[ ] 병원 프로필 페이지 만들기
[ ] 병원 추가 기능 만들기
[ ] 병원 프로필 수정 기능 ~ admin에게만 권한 주기
[ ] 내 프로필 수정 기능
[ ] 포스트 올리기 기능 만들기 - 내가 병원 스태프일 경우 해당 병원으로서 올릴 수 있게
[ ] 
[ ]
[ ]
[ ]
[ ]


# api 폴더

GraphQL resolver들을 다룹니다.

복잡한 유형의 resolver들엔 얘네가 어떻게 동작하는지 따로 주석을 붙여놓았습니다.
각 resolver들의 기능은 이름에서 유추할 수 있을거고요.

Resolver들을 살펴보며 전반적인 이해에 도움 되는 내용들만 이 readme 파일에 추가했습니다..

# 1 Prisma 문법 예시

```js
export default {
  Mutation: {
    addComment: async (_, args, { request }) => {
      isAuthenticated(request);
      const { text, postId } = args;
      const { user } = request;
      return prisma.createComment({
        user: {
          connect: {
            id: user.id
          }
        },
        post: {
          connect: {
            id: postId
          }
        },
        text
      });
    }
  }
};
```

isAuthenticated: 코멘트나 글을 남기는 등의 역할을 수행하려면

여기서 보면 createComment({ user, post, text}) 를 지정해줄 때 connect를 사용합니다. 만들어진 코멘트를 존재하는 user에 연결시킨 모습입니다. Post에도 마찬가지로 연결되어있구요.
만일 존재하지 않는 user를 만들어 연결하고 싶다면 connect 대신 create와 같은 문구도 사용해줄 수 있습니다.

위 코드 형태를 저희가 만들 "질의응답", "알람" 등에 응용할수 있어보입니다.

## 2. GraphQL - Fragments

설명하기 앞서 저희가 참고하는 오픈소스에서는 fragment **기능을 사용하지 않습니다**.

Fragment가 수행하는 기능을 Computed fields로 대체하였기 때문인데요. 그래도 Fragment가 왜 필요한지 아시면 몇몇 코드들을 이해하는데 도움될거같아 설명을 남겨봅니다.

정확하게 Fragment는 재사용할수 있는 query의 파편이라 생각하시면 됩니다. 이 때문에 복잡한 query들을 간단하게 표현하는데 주로 쓰이지만, query의 무한 루프로 인해 서버에 과부하가 발생하는 막는 일에도 쓰입니다.

GraphQL에서 user의 id와 사용자이름을 query한다 치면은:

```js
query {
  user( id: ~~~ ) {
    id
    username
  }
}
```

이런식으로 하게 되는데요. 다음과 같은 상황을 상정해볼게요.

```js
query {
  user( id: ~~~ ) {
    id
    comments {
      id
      user {
        id
        comment {
          id
          user { ... }
        }
      }
    }
  }
}
```

이런식으로 query의 무한루프를 만들게 하는 상황을 GraphQL은 허용하지 않습니다. 실제로 이런식으로 query를 해보려 하면 오류가 뜰겁니다.

하지만 user.comment로 찾은 comment가 user를 return하지 않는다거나, user.comment.user가 comment를 return하지 않으면 이런식의 무한루프를 방지할 수 있겠죠. 이걸 가능하게 하는게 fragment입니다.

예시를 하나 들자면:

```js
// COMMENT_FRAGMENT를 지정해줍니다.
export const COMMENT_FRAGMENT = `
    id
    text
    user {
        ${USER_FRAGMENT}
    }
`;
// USER_FRAGMENT를 지정해줍니다.
export const USER_FRAGMENT = `
    id
    username
    avatar
`;

// 포스트에 달린 코멘트를 찾는 query가 있다고 칠게요.
export default {
  Query: {
    seeCommentsOnPost: async (_, args) => {
      const { id } = args;
      const post = await prisma.post({ id });
      return prisma
        .post({ id })
        .comments()
        .$fragment(COMMENT_FRAGMENT);
    }
  }
};
```

이렇게 되면 seeCommentOwner라는 query에서는 comment들의 id, text, 그리고 해당 코멘트를 적은 user의 id와 username들만 받게됩니다. id, text, username 등은 다 string이니 이 경우 무한루프가 발생할 수 없습니다.


이런 fragment들을 저희는 따로 사용하지 않고 대신 computed field 기능을 사용합니다. Computed field가 무엇인지 볼게요.

---

## 2. Computed code

저희가 참고하는 오픈소스는 이때까지 설명한 Fragment 기능을 사용하지 않습니다. 대신 computed field 기능을 사용하는데요.

./src/api/User/User.js를 한번 보겠습니다.

```js
export default {
  User: {
    posts: ({ id }) => prisma.user({ id }).posts(),
    following: ({ id }) => prisma.user({ id }).following(),
    followers: ({ id }) => prisma.user({ id }).followers(),
    likes: ({ id }) => prisma.user({ id }).likes(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    rooms: ({ id }) => prisma.user({ id }).rooms(),
    postsCount: ({ id }) =>
      prisma
        .postsConnection({ where: { user: { id } } })
        .aggregate()
        .count(),
```


이런식으로 되어있는데요.

보시다싶이 User에서 얻을 수 있는 정보들을 함수 형태로 지정해주는 것을 computed field라고 합니다. 


구조가 왜 저런식인지 햇갈리실텐데요. 원래 computed field의 구조는


```js
export default {
  Like: {
    post: ( parent, arguments, {request}) => prisma.like({ parent.id }).post(),
    user: ( parent ) => prisma.like({ parent.id }).user()
  }
};
```

이런식인데요. parent를 input으로 받는데요. 저희가 필요한 거, 사용할건 어차피 parent 안의 id이니까, parent 이후 argument, {request} 부분은 날려 버리고 아래와 같이 써주는겁니다.

```js
export default {
  Like: {
    post: ({ id }) => prisma.like({ id }).post(),
    user: ({ id }) => prisma.like({ id }).user()
  }
};

// ID가 아니라 User 객체 내 다른 field들이 필요하다면 이렇게 써줄수도 있겠죠.
export default {
  User: {
    fullName: parent => `${parent.firstName} ${parent.lastName}`,
  }
};
```

이런 computed fields를 이용해서 fragment 사용을 피할 수 있어요.

원래 Like.post({id})를 하면 post를 바로 불러오면 에러가 뜨니 post의 fragment를 불러오는 식으로 해야했는데, 위와 같이 computed field를 지정해주면 그럴 필요 없이 Like.post({id})를 통해 바로 해당 query를 수행할 수 있습니다.