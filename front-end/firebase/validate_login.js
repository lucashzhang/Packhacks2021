auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else if (document.location === "signup.html" || document.location === "login.html") {
		document.location.replace("/post.html")
	}
});

function logOut() {
	auth.signOut().then(function () {
		document.location.replace("/login.html");
	}).catch((error) => {
		console.err("User could not be signed out.", error);
	});
}
