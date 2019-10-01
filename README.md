# Prismagram

Instragram clone with Express + Prisma + React and React Native
이 리포지토리는 서버 역할을 수행합니다.
master branch로 merge가 끝났습니다.

---

# 0. Requirements

**Node js** (버젼은 10 이상이면 괜찮습니다)

**npm** / **yarn**: 둘 다 package를 manage해주는데 역할은 같다고 알아요. npm을 써도 무방하지만 체감상 속도가 빨라서 저는 yarn을 쓰고 있어요.

- package: 서버를 돌리는데 사용하는 자바스크립트 라이브러리들이라 생각하시면 편할 거 같아요. 

---

# 1. 인스톨 및 실행

## 1.1 Package들 설치하기
```
yarn install (or) npm install
```
**yarn install**, or **npm install**: package.json 안에 포함된 모든 package들을 설치합니다.

## 1.2 비는 파일들 설치하기

필요한 파일인 .env 파일은 깃허브에 업로드하지 않았습니다. 슬랙에 따로 올려드렸으니 거기서 다운받아 덮어씌우시면 될거같아요.
.env 파일은 프로젝트 폴더에 바로 넣으시면 됩니다.


## 1.3 Prisma 계정 만들기, Prisma 설치하기

#### 1.3.1 계정

dhhhground@gmail.com 이란 프리즈마 아이드를 만들었습니다.
계정과 비밀번호는 Slack 백엔드방에 올려놓았어요.

#### 1.3.2 프리즈마 설치하기

아래 커맨드를 하나씩 실행해주세요. prisma deploy를 하려 할때 팝업이 떠서 인증을 하라고 할텐데, 초록색 인증 버튼을 누르시면 됩니다.
```
prisma deploy
prisma generate
```

- **Prisma**는 데이터베이스 (Postgres, MySQL 및 MongoDB) 도구가 포함된 ORM, 마이그레이션 및 관리자 UI입니다. 


- **prisma deploy** 데이터모델(datamodel.prisma 파일)을 프리즈마 서버에 업로드합니다.
    - 사용자가 GraphQL Schema, 그러니까 데이터 모델만 정해주면 알아서 DB와 DB의 각 객체들을 관리하는데 필요한 함수들을 자동 생성해줍니다.
    - 예를 들어 User라는 데이터모델을 정의하면 createUser, deleteUser 같은 함수들 (GraphQL에선 mutation들)을 프리즈마 서버에 자동생성해주죠.


- **prisma generate** 프리즈마 서버와 prisma.yml을 기반으로 prisma client를 만들어줍니다. 저희의 경우엔 자바스크립트(JS)를 사용하니 JS client를 만들어줘요.
    - 아까 DB 내의 객체들을 관리하는 함수들을 프리즈마가 자동 생성해준다했죠?
    - Prisma client는 이 함수들을 우리 코드 내에서 사용할 수 있도록 해줍니다.
    - 얘를 들어 자바스크립트 코드 내에서 *prisma.users()* 커맨드를 실행하면 프리즈마 서버에 접속해서 모든 유저데이터를 받아오는 식이죠. 엄청 편해요.
    - 2.1.1.2에서 이 부분에 대한 추가설명을 보실 수 있어요.


- Prisma를 install하는데는 *prisma.yml*이라는 파일이 필요한데 이 파일은 Github에 올라가 있지 않습니다.
    - *prisma.yml* 안엔 prisma endpoint라는 링크가 있는데, 이 링크는 GraphQL playground를 제공합니다.
    - 이 Playground에선 DB 내 데이터를 마음대로 주무를 수 있습니다. 때문에 prisma.yml을 깃허브에 올리지 않았는데요. 해당 파일은 슬랙에 올려두도록 하겠습니다.


## 1.4 실행하기

```
yarn dev
```

위 명령어를 이용해 실행하시면 됩니다.
그럼 이제 인터넷 URL에 localhost:4000를 치시면 GraphQL Playground가 뜹니다.

GraphQL playground를 통해 서버 내 데이터들을 수정도 해보고 DB를 수정하는 커맨드들을 실행도 해보고 할 수 있어요.

전 시험삼아 제 데이터를 만들어보았는데요.

```js
mutation {
    createAccount {
        username: "slee333"
        firstName: "SEUNGWOOK"
        lastName: "LEE"
        email: "seungwooklee94@gmail.com"
    } {
        id
        username
        email
        firstName
        lastName
    }
}
```
이렇게 하고 재생 버튼, 혹은 ctrl + Enter를 하면 제 데이터가 생성됩니다.

잘 생성되었는지 보고 싶다면 Playground에 새 탭을 켜서 다음 커맨드를 실행해보세요.

```js
query {
    seeUser(username: "slee333") {
        id
        username
    }
}
```
아마 방금 만든 유저의 데이터가 뜰겁니다.

데이터베이스는 위 방법만이 아니라 Prisma console을 통해서도 직접 확인할 수 있어요. **1.3** 에서 dhh-workspace 내에 있는 hground-backend를 클릭해서 들어가시면 보실 수 있습니다.

질문 있으시면 알려주세요!

---
# 2 폴더/파일 설명

안에 있는 폴더/파일들이 무슨 역할 하는지 간략히 설명하자면:

## 2.1 메인 폴더 내 파일들 (밖에 나와있는 애들)

#### 2.1.1 nodemon.json

저희가 node js로 서버를 실행합니다.

그런데 그냥 node만 쓰면 뭔가 업데이트를 할 때 마다 새로 터미널로 가서 서버를 끄고 재시작해줘야해요. 

그럴 일 없게 저희가 쓰는 파일이 바뀔 때 마다 서버를 재실행해주는 라이브러리가 nodemon이고, nodemon.json은 어떤 확장자를 가진 파일들이 바뀔 시 서버를 재시작할지 정의합니다. 

지금은 .js (자바스크립트)와 .graphql 이 들어있네요.

#### 2.1.2 package.json

*dependenceis*: 저희가 쓰는 모든 package들이 담겨있습니다. yarn 이나 npm으로 add (package) 할 때 자동으로 업데이트되요.

*scripts*: 
```json
"scripts": {
    "dev": "nodemon --exec babel-node src/server.js",
    "deploy": "prisma deploy",
    "generate": "prisma generate",
    "prisma": "yarn run deploy && yarn run generate"
}
```
원래는 서버를 실행할 때 아래와 같이 쳐야합니다.


    yarn nodemon --exec babel-node src/server.js


src 디렉토리 내의 server js를 관리자 (--exec) 권한으로 nodemon과 babel-node를 사용해서 실행한다는 의미인데요. 너무 깁니다.

(babel-node는 modern Javascript의 깔끔한 ES6 문법을 옛날에 쓰던 복잡하고 못생긴(..) Javascript로 바꾸어주는 역할을 한다 합니다. ES6가 비교적 최근에 나왔는데 이걸 지원하지 않는 모듈들도 존재해서 이걸 쓰는거같아요.)

script 내에 dev를 저렇게 정리해놓으면 서버를 실행할 때 저 긴 명령어 대신 아래와 같이 치면 됩니다.


    yarn dev


깔끔하죠!

deploy는 저희가 데이터타입을 업데이트해서 해당 사항을 새로 prisma에 업데이트 할 때 씁니다.
generate는 그럼 업데이트된 prisma 서버를 참고해서 새로 자바스크립트 프리즈마 클라이언트를 *./generate*에 만들어주고요.


#### 2.1.3 datamodel.prisma: 

말 그대로 데이터모델을 정의합니다. 여기서 정의된 GraphQL 데이터모델을 기반으로 Prisma가 DB 관리 기능들을 생성해줍니다. 안에 내용 보면 이런 식입니다.
```javascript
    type User {
        id: ID! @id
        userName: String! @unique
        name: String
        email: String! @unique
        bio: String
        threads: [Thread!]!
        likes: [Like!]!
        comments: [Comment!]!
        followers: [User!]! @relation(name:"FollowRelation")
        following: [User!]! @relation(name:"FollowRelation")
        loginSecret: String
    }

    type Like {
        id: ID! @id
        user: User!
        thread: Thread!  // 어떤 포스트(스레드)에 달린 라이크인지를 알려줍니다. 
    }
```

User의 예를 들어서 데이터모델을 살펴보며 Prisma 데이터모델 문법을 간단히 살펴보겠습니다. 

대부분 GraphQL 문법이랑 동일하고 **@** 표시 다음에 나오는 문법들만 프리즈마 문법들이에요. GraphQL 문법은 **2.2**를 참고해주세요.

- type User: 데이터타입 'User'를 정의합니다.
- id: ID! @id -> Prisma에 새로운 유저가 추가될 때 마다 각 유저 고유의 아이디를 생성합니다. 꼭 유저 뿐만이 아니라 모든 데이터 객체는 고유의 id를 가집니다.
- userName: String! @unique -> userName이란 필드엔 String이 들어가야 한다는 소리입니다. 
    - **!** 표시는 해당 항목이 required란 소리입니다. (이 항목을 정의하지 않으면 User 객체를 만들 수 없습니다)
    - **@unique** 는 해당 항목이 고유해야 한다는 소리입니다. 사용자명은 중복되면 안되니까요?
- likes: Like란 데이터타입의 Array로 이루어져 있습니다.
    - Array 안에는 Like라는 데이터타입만이 들어가야합니다.
    - Array 자체의 존재는 필수입니다.
    - [Like!]! 이 형태를 보고 Like도 Array도 필수로 들어가야하니, userName처럼 Like도 User를 만들 때 정의해줘야하지 않나 싶으실텐데요. 실제로 user를 만들 때엔 이 항목은 필수가 아니고 그냥 [] 이렇게 빈 array가 생성됩니다.
- followers: 이게 되게 신기한데요. @relation(name:"FollowRelation")을 통해 following 항목과 연계가 됩니다.
    - 보시면 followers는 User의 array입니다.
    - 유저 A와 B가 있다고 칠게요
    - 유저 A의 *팔로워*에 B를 추가합니다.
    - 그러면 (사전에 정의된 관계 때문에) B의 *팔로잉*에 A가 추가됩니다!
    - followers와 following이 같은 relation 이름을 공유하기 때문에 이렇게 된다고 하네요.

말고도 제가 정의해놓은 다른 데이터타입들이 있는데, 저 혼자 구성하면서 만든거라 이런거 만들었구나~ 참고만 해주세요.
기획란에서 자세히 말씀드리겠습니다.

#### 2.1.4 기타 파일들

.gitignore: 다들 아시겠지만 git에서 어떤 파일들을 ignore할지 정합니다. prisma.yml, node_modules, generated 같은 파일/디렉토리들을 무시하도록 해놓았어요.
.babelrc: ./src/.env 파일 내에 저희가 코드 내에 직접적으로 쓰면 안되는 수치들을 정의해놓았어요. 이것과 관련된 파일입니다.
yarn.lock: 자동 생성되는 파일입니다. 뭐하는 앤진 잘 모르겠네요 ㅜㅜ


## 2.2 ./src/api 폴더 내 파일들

#### 2.2.1 GraphQL

먼저 GraphQL에 대해 간단히 소개드릴게요.
GraphQL은 간단히 말하면 데이터베이스 내 데이터를 색인(query) 하고 바꾸는 (mutation) 과정을 쉽게해줍니다.

GraphQL 서비스엔 크게 두가지가 필요합니다. 1) Type과 하위 field들. 그리고 Resolver라 불리는 함수들인데요. 간단히 살펴볼게요.

##### 2.1.1.1 Type and fields

*api/Users/allUsers.graphql* 파일엔 다음과 같은 내용이 있습니다.
```js
type Query {
    allUsers: [User!]! // Query "allUsers"는 User들의 array를 return받습니다.
}

// 이 아래는 제가 임의로 추가했습니다. 원래 파일엔 없어요
type User {
    id: ID
    name: String
}
```
type을 정의함으로서 우리는 데이터 구조를 짜게 됩니다.

User란 데이터타입 안에는 ID와 name이란 field들이 있습니다. User 고유의 ID와 유저의 이름이 String으로 저장되지요. (ID는 기본적으로 String입니다.) 

Query란 type은 기본적으로 GraphQL에 내장되어 있어요. 위에서 보이는 Query인 allUser의 경우 실행시 User들의 array를 return합니다.

여기서 주의할점은, 우린 여기서 type들이 어떤 field들로 구성되어 있고 각 field들 안에는 어떤 데이터가 입력되어야하는지 그 구조만 정의하는겁니다.

실제로 allUsers라는 query가 모든 유저를 받아오게 하려면 allUsers라는 query가 실행되었을 때 실행되는 자바스크립트 함수를 만들어야 하는데 그게 resolver입니다.

##### 2.1.1.2 Resolvers

*api/Users/allUsers.js*를 보겠습니다. 

```javascript
import { prisma } from "../../../../generated/prisma-client";
// 1. 아까 1에서 prisma client를 설명드렸죠? prisma-client로부터 prisma를 import해 옵니다.
// 그럼 이제 prisma를 통해 서버에 접근 할수 있어요.

// 2. export default는 이 자바스크립트 파일에서 기본값으로 export할 object를 정의해줍니다.
// Resolver들은 이런 형태에요.
export default {
    // 3. 아까 allUsers.graphql에서 우리가 allUsers라는 Query를 정의했죠? 
    // 그래서 여기 들어가는 값도 query가 됩니다.
    Query: {
        // allUsers라는 명령에 대해 prisma.users()를 return합니다 
        // (모든 유저를 return하는 샘입니다)
        allUsers: () => prisma.users()
    }
}
```

allUsers라는 query가 실행되었을때 이런 resolver가 실행되게 됩니다. 

아까 type에서 allUsers란 query는 User들의 Array를 받아야 한다 정의했습니다. prisma.users()를 통해 유저들의 array를 줄 땐 정상적으로 돌아가지만, 만일 우리가 prisma.likes() 같은걸 돌려주면 유저들의 리스트 대신 라이크의 리스트를 받기 때문에 에러가 뜰 겁니다.


```js
allUsers: () => prisma.users()    
```

이 부분이 좀 햇갈리실 수 있어요. 최신 자바스크립트(ES6)에서 함수를 define하는 방식입니다. 아래에 적힌 두 코드는 기본적으로 같은 코드에요.        
        
```js
var foo = (x)=>10+x 

function foo2(x) {
    return (10+x)
}
```

구글 크롬에서 F12 눌러서 자바스크립트 콘솔을 여신 다음 이 두 함수를 시험해보시면 foo(10) 과 foo2(10)이 같은 value를 return할겁니다.

이상으로 resolver의 간단한 리뷰였습니다. 


더 복잡한 리졸버들도 ./src/api 폴더 안에 많은데, 좀 더 복잡한 유형의 리졸버들에 해선 api 폴더 내의 README 파일을 참조해주세요.

#### 2.2.2 api 내 파일들

되게 쉽고 별거 없어요. 앞서 설명드린 리졸버들인데, 어차피 오픈소스를 이용하게 되면 다시 만들고 지우고 할테니 엄청 자세하게는 안적을게요.

- api
    - Users: 유저들과 관련된 리졸버들을 저장합니다. addUser, deleteUser 같은걸 만들어 넣어놓을 수 있죠. 꼭 이런 구조일 필요는 없습니다. 정리를 위해 만들었어요.
        - createAccount: 유저를 추가합니다. 
        - requestSecret: 유저가 로그인을 하려 했을때, 유저의 이메일로 Secret을 보내고, 해당 Secret을 데이터베이스 안에 저장합니다. 
          유저는 이메일에 적힌 secret을 입력해서 로그인 할 수 있죠. (비밀번호 기능을 아직 못 만들어서 이래요.)
        - **confirmSecret**: 유저가 앞서 말한 secret을 치고 들어왔을 때 이를 확인합니다. 이메일로 DB 내 유저를 찾아 해당 유저의 Secret을 찾고, 유저가 입력한 secret이 이와 일치하는지 확인합니다. 확인되면, JSON Web Token (JWT Token)을 발행합니다.
            - 이 토큰은 향후 유저가 뭔가 행동을 하면, 그 행동이 해당 유저가 행한 행동이란걸 명시하기 위해 쓰입니다. 자세한건 아래에 passport.js 란에서 설명할게요.
    - **models.graphql**: 우리가 GraphQL에서 사용하는 type들(User, Post, Like, 등등)을 정의합니다.
        - 아까 2.1.3에서 본 datamodel.prisma와 사실상 같습니다. datamodel.prisma에서 프리즈마 문법들을 뺀거에요
        - GraphQL이 prisma 문법이 섞인걸 읽질 못해 이렇게 따로 만들어줘야합니다.
        - **바꿔 말하자면 데이터모델을 바꾸기 위해 datamodel.prisma를 수정했다면 이 파일 models.graphql도 같이 수정해줘야 합니다.**

## 2.3 ./src 폴더 내 파일들

#### 2.3.1 env.js , .env

위에서도 언급했지만 저희가 코드 내에 직접적으로 쓰면 안되는 수치들을 .env 파일 안에 정의해놓았습니다.
제가 slack으로 따로 보내드릴텐데요, 어떤 내용이 있는지만 간단히 보시면:

```json
PORT = 1234
SENDGRID_USERNAME = "USERNAME"
SENDGRID_PASSWORD = "PASSWORD"
JWT_SECRET = "SSSSSEEEEECCCCRETTT"
```

이런 식으로 구성되어 있어요.
1. 저희 서버가 굴러가는 PORT의 번호 (ex. 4000)
2. SendGrid는 이메일 보내주는 라이브러리에요. 이메일 보낼 때 로그인을 해야해서 그걸 여기다 적어놓았었구요.
3. JWT_SECRET: 
    - 유저가 로그인에 성공하면 자바스크립트 토큰이 발행됩니다. 
    - 이 토큰은 유저의 데이터베이스 내 ID의 암호화 버젼입니다. 여기서 암호화/비암호화에 쓰이는게 JWT_SECRET입니다.
    - 이걸 직접 코드에 써놓으면 당연히 ID를 해독할 수 있으니 여기다 넣어놓았어요.
    - (이따 passport.js에서 더 설명하겠지만) 여기서 발행된 TOKEN은 해당 유저가 글을 올리던 질문을 올리던 해서 서버에 Request를 보낼 때 그 request가 어떤 유저에 의해 만들어졌는지를 특정하는 역할을 합니다.

env.js는 이 .env파일을 불러오는 역할을 합니다.


#### 2.3.2 schema.js

**2.2** 에서 api 폴더 내에는 GraphQL 파일들이 있다고 했잖아요. 얘네들을 한데 묶어서 읽도록 해줍니다.

원랜 하나의 커다란 .graphql 파일 안에 type들을 정의하고 또 다른 큰 .js파일 안에 resolver들을 정의하는데 그럴 필요가 없도록 해주죠.

#### 2.3.3 utils.js

메일을 보낸다던가, 시크릿 토큰을 만든다던가 하는 활동을 수행하는 함수들을 담아놓았어요. 자세한 설명은 추후 추가하겠습니다.

#### 2.3.4 passport.js

아까 **2.2.2**에서 유저가 로그인하면 토큰을 발행한다고 했습니다. (*confirmSecret*)

이 토큰을 해당 유저가 실행하는 request에 header로 붙입니다. 이로서 request가 어떤 유저에 의해 만들어졌는지 특정할 수 있습니다.
passport.js는 이 과정을 위한 코드입니다. 

밑에 코드와 코멘트들을 참조해주세요.

```js
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}; // JSON web token의 옵션들을 결정합니다. 
// Header의 Bearer에 Token이 붙어져있구요, 
// Jwt token을 해독하는 secret은 .env파일에서 불러옵니다.

/* 
    * verifyUser; callback function of passport.use
        Request가 생기면 토큰을 decode해서 유저 id를 얻고, 해당 유저가 존재하는지를 찾는다.
*/
const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      // We found user!
      return done(null, user);
    } else {
      // User not found. Return false, or make a new user account.
      return done(null, false);
    }
  } catch (error) {
    // Could not execute prisma to find user. 프리즈마쪽 문제. Returning error.
    return done(error, false);
  }
};

/*
    1. authenticateJwt를 하면 passport.authenticate가 실행된다.
    2. 이때 verifyUser가 실행되고, 유저가 존재할 시 (null, user)를, 에러가 있을 시 user 자리에 false를 넘긴다.
    {session: false}는 선택적 명령어로 캐시를 저장하지 않는다는 소리다.
*/

export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
    // if (error) {
    //   console.log("Error in authentication:", error);
    // }

    // 3. user를 넘겨받았다면 request에 user를 붙입니다.
    // 방금 verifyUser에서 token을 해석해서 user를 해석했는데 왜 user를 또 붙이느냐 궁금하실 수 있습니다.
    // 지금 user를 붙인 request는 유저 특정이 필요한 GraphQL resolver들에 input으로 들어가게 됩니다.
    // 예를 들어 글을 남길 때 request에 user를 붙여 넘김으로서 어떤 유저가 글을 남기는지 특정할 수 있는거죠.
    //  server.js를 참고해주세요.
    if (user) {
      // We got user from verifyUser. Attaching user to request
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();

```

#### 2.3.5 server.js

가장 먼저 실행되는 파일이자 서버 파일입니다. 여러가지 모듈들이 import되어 있는데 각 모듈들의 기능을 설명하겠습니다.

```js
import "./env"; // env.js을 이용해 .env 파일을 import합니다. 제일 상위 파일인 서버에서 얘를 import했으니 하위 파일들에선 별도의 import 없이 .env에 저장된 variable을 사용할 수 있습니다.
import { GraphQLServer } from "graphql-yoga"; //GraphQL 서버를 불러오구요
import logger from "morgan"; // 로그 만들어주는 모듈입니다
import schema from "./schema"; // schema.js를 불러옵니다. 스키마는 GraphQL이 인식하는 모든 type들과 resolver들을 담고 있습니다.

// 사용자 인증용 모듈인 passport와 2.3.4에서 정의한 authenticateJwt를 불러옵니다.
import "./passport";
import { authenticateJwt } from "./passport";

// 포트를 정의합니다. default는 4000입니다.
const PORT = process.env.PORT || 4000;

// GraphQL 서버를 만듭니다. 스키마와 context 기반으로요.
// Context는 간단히 설명하면 GraphQL operation들에서 공통적으로 공유되는 무언가입니다.
// 아까 passport에서 request에 user를 붙였죠? 그렇게 user가 붙은 request를 context를 통해 여러 resolver들에서 공유할 수 있습니다.
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request })
});

server.express.use(logger("dev")); // 로그를 하구요
server.express.use(authenticateJwt); // 서버에 들어오는 모든 request가 authenticateJwt를 지나도록 합니다

// 서버를 시작하고, 콘솔에 로그창을 띄웁니다.
server.start({ port: PORT }, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);

```

---

# 3. Heroku에 Deploy:

Heroku에 어떻게 deploy했는지 과정을 설명드릴게요.

Heroku 계정과 비밀번호는 이미 Slack에 올려두었고 링크를 통해 접속하실 수 있어요.

어떤 과정을 통해 Heroku에 올라갔는지 알고 싶으시거나, 혼자 따로 한번 올려보고 싶으시면 아래 과정을 따라가시면 되겠습니다.



## 3.0 준비

package.json에서 script 부분을 볼게요.

```javascript
"scripts": {
    "deploy": "prisma deploy",
    "generate": "prisma generate",
    "prisma": "yarn run deploy && yarn run generate",
    "dev": "nodemon --exec babel-node src/server.js",
    "prebuild": "yarn run generate",
    "build": "babel src -d build",
    "postbuild": "cd src && npx copy ./api/**/*.graphql ../build/api/",
    "start": "node build/server.js"
  }

```
여기 보면 여러 스크립트들이 있는데 하나씩 설명하도록 하겠습니다.




1. **build**

src 폴더 내에 있는 자바스크립트 파일들을 heroku는 이해하지 못합니다. (신형? 자바스크립트라서)

때문에 *package.json* 내에 있는 "babel src -d build" 커맨드를 통해 build 폴더를 생성합니다. 이 폴더는 기본적으로 src와 동일합니다. 차이가 있다면 구식 자바스크립트를 사용한다는 것입니다. babel은 신형 JS를 구형 JS로 변환시켜주는 모듈이니까요.

그런데 여기서 한가지 문제가 생기는데, babel은 자바스크립트 파일들만 신경쓰기 때문에 src 폴더 내 GraphQL 파일들이 복사되지 않는다는 겁니다.




2. **postbuild**


때문에 package.json/script에 postbuild를 보시면 "postbuild": "cd src && npx copy ./api/**/*.graphql ../build/api/" 라는 스크립트가 있습니다. 이 커맨드를 이용해 ./src 내의 GraphQL 파일들을 ./build 폴더 내로 복사합니다

- 제가 윈도우라 커맨드가 "npx copy ./api/..." 이런식인데 **MacOS**에선 npx를 뺴고 "copy ./api/..."로 하면 되는 것 같습니다. 리눅스는 잘 모르겠네요.. 맥과 비슷하지 않을지..?




3. **prebuild**


근데 이것만 하면 서버파일들이 작동하지 않는데, prisma client가 없기 때문입니다. prisma-client가 들어있는 generated 폴더나 모듈들이 들어있는 node_modules 폴더는 git에 업로드하지 않으니 이 부분들은 저희가 서버에서 따로 만들어주게 됩니다. package.json을 heroku가 감지해서 node_modules는 자동으로 만들어주는데 generated 폴더는 만들어주지 않으니 이걸 해주는 코드를 추가해야 하고, 그게 "prebuild" 부분입니다.

따라서 "prebuild": "yarn run generate"를 script 안에 넣어줍니다. 이러면 yarn run generate가 build 전에 실행되서 prisma client를 만들어줍니다.


여기에는 prisma.yml파일이 필요합니다. 지난번에는 제가 prisma.yml 파일 내에 prisma endpoint 주소가 있어 직접 업로드를 하지 않는다고 말씀드렸는데요, 여기 오픈소스에서 가져온 버젼에는


```js
endpoint: ${env:PRISMA_ENDPOINT}
datamodel: datamodel.prisma
```


이런식으로 prisma endpoint 주소를 환경변수로 빼준걸 확인하실수 있습니다.

작업할때야 .env 파일에 이 변수들을 지정해둘 수 있지만 .env파일을 git을 통해 올리면 안되니 이 변수들은 나중에 heroku에서 config vars 섹션을 이용해 지정해줍니다.




4. **start**

"node build/server.js" 커맨드를 통해 서버를 build하고 시작합니다. 여기까지 무사히 마치게 되면 heroku에 서버가 성공적으로 deploy 되겠죠.


--- 


이 다음부턴 Heroku에 deploy하는 과정입니다.


이미 deploy 자체는 되어있습니다. 어떤 과정을 통해 deploy됬는지만 나열할게요.


## 3.1 Heroku CLI 설치

[Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line) 설치 사이트에서 Heroku Cli를 설치합니다.


---
## 3.2 Heroku에 로그인

Heroku에 로그인합니다.
저희 프로젝트 Heroku 계정과 비밀번호는 Slack의 백엔드방을 참고해주세요.

[Heroku](https://dashboard.heroku.com/apps) 웹사이트에서 로그인하신 뒤 아래 커맨드를 터미널에 입력해주세요. (git bash던 terminal이던 powershell이던 상관없지싶어요)

```
heroku login
```

그러면 heroku에 로그인 할 수 있도록 인터넷 창이 하나 뜰겁니다. 로그인 버튼을 누르면 터미널에서 로그인이 완료된 모습을 보실 수 있습니다. 


이제 heroku 대시보드에 들어가면 hground-backend라는 앱이 보일거에요.


---
## 3.3 git 이용해 heroku에 deploy하기

이 과정은 대시보드 - hground-backend - deploy에서도 문서로 확인하실 수 있어요.

우선


    heroku git:remote -a hground-backend


터미널에서 위 커맨드를 입력해줍니다. 그러면

```
see git remote heroku to https://git.heroku.com/hground-backend.git
```

이 메시지가 뜰겁니다. 이후

```
git push heroku master
```

커맨드를 입력해주면 heroku로 deploy가 시작됩니다. 


package.json.script에 정의한 순서대로 prebuild - build - postbuild - start가 진행됨을 알 수 있습니다.


그런데 이대로만 하면 에러가 뜰겁니다.

```

[WARNING] in /tmp/build_5dd6e7bac854f94a2752131859f626f9/prisma.yml: A
remote:  ▸    valid environment variable to satisfy the declaration
remote:  ▸    'env:PRISMA_ENDPOINT' could not be found.

```

아마 이런 메시지가 뜰건데요. .env 파일에 들어있는 PRISMA_ENDPOINT가 prisma.yml 파일로 전달되지 않아서 그렇습니다.


Heroku 앱으로 돌아가서 - Setting - config vars 로 가서 기존에 .env 파일 안에 들어있던 내용들을 다 입력해줍니다.


이렇게 하면 vars를 업데이트 할 때 마다 heroku가 알아서 재시작하면서 prisma generate까지 문제없이 완료되며 deploy가 끝났습니다.


---

## 3.4 Prisma demo 서버를 heroku로 변경 (TO DO)


이건 아직 못한 부분입니다. Prisma에서 원래 Add a new server 버튼을 통해 새 히로쿠 서버를 만들고 연결시킬수 있는데 현재는 create server 버튼이 비활성화되어있네요.


*Creating a new Heroku server is currently disabled.* 라는걸로 봐서 향후 다시 풀리지 않을까 싶긴 합니다.


또 이 과정이 사실 불필요할 수도 있는게, 해커톤에서 프로토타입을 보여줄땐 실제 유저들을 받는게 아니니까 데모 서버만 써도 충분하지 않을까 싶기도 합니다.


---


## To-Do-List

README.MD에서 체크리스트를 남기는 방법인데 편해보이네용. 우리도 이렇게 해도 되지않을까요?

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
