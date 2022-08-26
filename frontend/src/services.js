MEDIA_URL = "http://127.0.0.1:8000/api/media/";

function infoService(callback) {
	axios.get("http://127.0.0.1:8000/info/")
		.then(function (response) {
			callback(response.data);
		});
};

function typeInfoService({callback, pk}) {
	var url = `http://127.0.0.1:8000/type-info/`;

	if (pk) {
		url += `${pk}/`;
	}

	axios.get(url)
		.then(function (response) {
			callback(response.data);
		});
};

function typeActionService({callback, pk}) {
	var url = `http://127.0.0.1:8000/type-action/`;

	if (pk) {
		url += `${pk}/`;
	}

	axios.get(url)
		.then(function (response) {
			callback(response.data);
		});
};

function relationService(callback) {
	axios.get("http://127.0.0.1:8000/relation/")
		.then(function (response) {
			callback(response.data);
		});
};

function ticketService() {
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
