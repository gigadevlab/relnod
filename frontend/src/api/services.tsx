import axios from "axios";

const API_BASE = "http://0.0.0.0:8000";

export const MEDIA_URL = API_BASE + "/api/media/";


const setToken = (tokenType: "Token", token: string) => {
  localStorage.setItem('token', `${tokenType} ${token}`);
};

const getToken = () => {
  let token = localStorage.getItem("token");
  if(token && token.trim())
    return token;
  return "";
};

const getHeaderWithToken = () => {
  return {
    headers: {
      'Authorization': getToken(),
    }
  };
};

export function nodeInfoService({callback, type, key}: any) {
  var url = API_BASE + `/node-info/${type}/${key}/`;

  axios.get(url, getHeaderWithToken())
    .then(function (response) {
      callback(response.data);
    });
};

export function typeInfoService({callback, pk}: any) {
  var url = API_BASE + `/type-info/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url, getHeaderWithToken())
    .then(function (response) {
      callback(response.data);
    });
};

export function typeActionService({callback, pk}: any) {
  var url = API_BASE + `/type-action/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url, getHeaderWithToken())
    .then(function (response) {
      callback(response.data);
    });
};

export function actionService({callback, name, nodes, filter}: any) {
  var url = API_BASE + `/action/${name}/?nodes=${JSON.stringify(nodes)}&filters=${JSON.stringify(filter)}`;

  axios.get(url, getHeaderWithToken())
    .then(function (response) {
      callback(response.data);
    });
};

export function tokenService({callback}: any) {
  axios.get(API_BASE + "/token/")
    .then(function (response) {
      setToken("Token", response.data.token);
      callback(true)
    })
    .catch(function (error) {
      callback(false)
    })
};
