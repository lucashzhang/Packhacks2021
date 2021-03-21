$("#upload-image-form").submit(function(e) {
	e.preventDefault();

	$.ajax({
		url: "https://api.aszala.com:3000/upload_img",
		type: 'post',
		data: $("#upload-image-form").serialize(),
		success: function() {
			console.log("dawjjdwkljkl");
		}
	});
});
