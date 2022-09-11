import axios from "axios";

export const MEDIA_URL = "http://127.0.0.1:8000/api/media/";

export function infoService(callback: any) {
  axios.get("http://127.0.0.1:8000/info/")
    .then(function (response: any) {
      callback(response.data);
    });
};

export function typeInfoService({callback, pk}: any) {
  var url = `http://127.0.0.1:8000/type-info/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function typeActionService({callback, pk}: any) {
  var url = `http://127.0.0.1:8000/type-action/`;

  if (pk) {
    url += `${pk}/`;
  }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function actionService({callback, name, nodes, filter}: any) {
  var url = `http://127.0.0.1:8000/action/${name}/?nodes=${JSON.stringify(nodes)}&filters=${JSON.stringify(filter)}`;

  // if (filter) {
  //   url += `${Object.keys(filter).map((key) => `&${key}=${filter[key]}`)}`
  // }

  axios.get(url)
    .then(function (response) {
      callback(response.data);
    });
};

export function relationService(callback: any) {
  axios.get("http://127.0.0.1:8000/relation/")
    .then(function (response) {
      callback(response.data);
    });
};

export function ticketService() {
  axios.get("http://127.0.0.1:8000/ticket/")
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
