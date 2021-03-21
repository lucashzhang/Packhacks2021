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
					console.log('success')
					console.log(res);
					setText(res);
				},
				error: function(res) {
					if (typeof res.responseText === "string" && res.responseText.length > 0) {
						console.log('lmao')
						console.log(res.responseText);
						setText(res.responseText);
					} else {
						console.log('error')
					}
				}
			});
		}
	});
});

function setText(string) {
	document.getElemenetById("chat-text").value = string;
}
