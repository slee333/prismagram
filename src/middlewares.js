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
    "X-NCP-APIGW-API-KEY-ID": "oseghom2se",
    "X-NCP-APIGW-API-KEY": "CIS3zyaShaDOlQV9RjY0aQT6DHEbnTIjDl98o9tI"
  };
  const params = {
    query: address
  };
  const config = { headers, params };
  const stringAddress = await axios
    .get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", config)
    .then(({ data: { addresses } }) => {
      // console.log(addresses);
      // setLongitude(addresses[0].x);
      // setLatitude(addresses[0].y);
      // setJibunAddress(addresses[0].jibunAddress);
      // setRoadAddress(addresses[0].roadAddress);

       const addressObj = {
         Longitude: addresses[0].x,
         Latitude: addresses[0].y,
         jibunAddress: addresses[0].jibunAddress,
         roadAddress: addresses[0].jibunAddress,
       }

      return JSON.stringify( addressObj );
    })
    .catch(error => console.log(error))

  return stringAddress
};
