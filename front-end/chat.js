$("#image-upload").on("change", function(e) {
	var file = $(this)[0].files[0];

	var that = this; var formData = new FormData();
	formData.append("file", file, file.name);
	formData.append("filename", file.name);
	formData.append("upload_file", true);

	$.ajax({ type: "POST", url: "https://aszala.com:3000/parse_img", xhr: function () {
		var myXhr = $.ajaxSettings.xhr();

		return myXhr;
	}, success: function (data) {
		console.log(data);
	}, error: function (error) {

	},
	async: true, data: formData, cache: false, contentType: false, processData: false, timeout: 60000 });
});
