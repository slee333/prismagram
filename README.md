# Prismagram

Instragram clone with Express + Prisma + React and React Native

## User Stories

- [x] Create account
- [x] Request Secret
- [x] Confirm Secret (Login)
- [x] Like / Unlike a photo
- [x] Comment on a photo
- [x] Search by user
- [x] Search by location
- [x] Follow User
- [x] Unfollow User
- [x] Edit my profile
- [x] See user profile
- [x] See MY profile
- [x] See the full photo
- [x] Upload a photo
- [x] Edit the photo (Delete)
- [x] See the feed
- [x] Send private Message
- [x] See rooms
- [x] See room
- [x] Receive Message (Realtime)


## Prisma 문법
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


## GraphQL - Fragments
설명하기 앞서 저희가 이용하는 코드에서는 fragment 기능을 사용하지 않습니다. Fragment가 수행하는 기능을 Computed fields로 대체하였기 때문인데요. 
그래도 Fragment가 왜 필요한지 아시면 몇몇 코드들을 이해하는데 도움될거같아 설명을 남겨봅니다. 

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

이런 느낌으로요. 이렇게 되면 comment.user를 했을 때 user 내 comment 등을 return하지 않고 id와 username (둘 다 String)만 return하니 무한루프가 발생하지 않습니다.


Fragment는 기본적으로 

## Prisma: Computed field
- Prisma에는 computed field가 있습니다. 

