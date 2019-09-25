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

설명하기 앞서 저희가 이용하는 코드에서는 fragment **기능을 사용하지 않습니다**. 


Fragment가 수행하는 기능을 Computed fields로 대체하였기 때문인데요. 그래도 Fragment가 왜 필요한지 아시면 몇몇 코드들을 이해하는데 도움될거같아 설명을 남겨봅니다. 

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

** fragment.js **

```js
// User Fragment를 지정해줍니다.
export const USER_FRAGMENT = `
    id
    username
`;

export const COMMENT_FRAGMENT = `
    id
    text
    user {
        ${USER_FRAGMENT}
    }
`;
```

이렇게 USER_FRAGMENT는 User에서 id와 username만을 return합니다. 이렇게 되면 comment.user를 했을 때 user 내 comment 등을 return하지 않고 id와 username (둘 다 String)만 return하니 무한루프가 발생하지 않습니다.

## 2. Computed code


## Prisma: Computed field
- Prisma에는 computed field가 있습니다. 

