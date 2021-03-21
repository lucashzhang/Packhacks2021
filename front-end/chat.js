$("#upload-image-form").submit(function(e) {
	e.preventDefault();

	$.ajax({
		url: "https://api.aszala.com:3000/upload_img",
		type: 'post',
		data: new FormData($("#upload-image-form")[0]),
		processData: false,
		contentType: false,
		success: function(res) {
			$.ajax({
				url: "https://api.aszala.com:3000/parse_img?filename=" + res,
				type: 'get',
				dataType: 'json',
				success: function(res) {
					console.log(res);
				}
			});
		}
	});
});
