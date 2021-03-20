auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else {
		if (!user.emailVerified) {
			logOut();
		}
	}
});

function logOut() {
	auth.signOut().then(function() {
		document.location.replace("/login.html");
	}).catch((error) => {
		console.err("User could not be signed out.");
	});
}
