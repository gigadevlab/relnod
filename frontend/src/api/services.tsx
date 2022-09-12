import axios from "axios";

const API_BASE = "http://0.0.0.0:8000";

export const MEDIA_URL = API_BASE + "/api/media/";

export function infoService(callback: any) {
  axios.get(API_BASE + "/info/")
    .then(function (response: any) {
      callback(response.data);
    });
};

export function typeInfoService({callback, pk}: any) {
  var url = API_BASE + `/type-info/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function typeActionService({callback, pk}: any) {
  var url = API_BASE + `/type-action/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function actionService({callback, name, nodes, filter}: any) {
  var url = API_BASE + `/action/${name}/?nodes=${JSON.stringify(nodes)}&filters=${JSON.stringify(filter)}`;

  // if (filter) {
  //   url += `${Object.keys(filter).map((key) => `&${key}=${filter[key]}`)}`
  // }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function relationService(callback: any) {
  axios.get(API_BASE + "/relation/")
    .then(function (response) {
      callback(response.data);
    });
};

export function ticketService() {
  axios.get(API_BASE + "/ticket/")
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
};
