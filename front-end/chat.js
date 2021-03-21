$("#image-upload").on("change", function(e) {
	var file = $(this)[0].files[0];
	var data = new FormData();

	data.append('file', file);

	$.ajax({
		url: "https://aszala.com:3000/upload_img",
		type: 'post',
		data: data,
		contentType: false,
		processData: false,
		success: function (response) {
			console.log(response);
		},
		error: function (res) {
			console.log(res);
		}
	});
/*
	that = this;
	formData = new FormData();
	formData.append("filename", file.name);

	$.ajax({ type: "POST", url: "https://aszala.com:3000/prase_img", xhr: function () {
		var myXhr = $.ajaxSettings.xhr();

		return myXhr;
	}, success: function (data) {
		console.log(data);
	}, error: function (error) {

	},
	async: true, data: formData, cache: false, contentType: false, processData: false, timeout: 60000 });*/
});
