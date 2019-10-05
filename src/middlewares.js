import axios from "axios";

export const isAuthenticated = request => {
  if (!request.user) {
    throw Error("You need to log in to perform this action");
  }
  return;
};

export const getGeoCode = async address => {
  // Naver API로부터 주소의 Geocode를 가져옵니다.
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": process.env.NCP_GEO_ID,
    "X-NCP-APIGW-API-KEY": process.env.NCP_GEO_SECRET
  };
  const params = {
    query: address
  };
  const config = { headers, params };
  const {
    data: { addresses }
  } = await axios
    .get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", config)
    .catch(error => console.log(error));

  return addresses;
};
