const loginForm = document.querySelector("#login-form");

loginForm.addEventListener('submit', (e) => {
	e.preventDefault();

	$("#login-error").css("display", "none");

	const email = loginForm['email'].value;
	const password = loginForm['password'].value;
	const remember = loginForm['remember'].checked;

	var state = firebase.auth.Auth.Persistence.SESSION;

	if (remember) {
		state = firebase.auth.Auth.Persistence.LOCAL;
	}

	login(email, password, state);
});

var userSignedIn = false;

function login(email, password, state) {
	firebase.auth().setPersistence(state).then(function () {
		auth.signInWithEmailAndPassword(email, password).then((cred) => {
			userSignedIn = true;
		}).catch(err => {
			$("#login-error").css("display", "block");
			$("#login-error").html(err.message);
		});
	});
}

auth.onAuthStateChanged((user) => {
	if (user) {
		if (!userSignedIn) {
			document.location.replace('chat.html');
			console.log("User signed in");
		} else {
			if(!user.emailVerified) {
				$("#login-error").css("display", "block");
				$("#login-error").html("Your email has not been verified. Please click <span onclick='sendEmail();' style='text-decoration:underline;cursor:pointer;'>here</span> if you would like another verification email.");
			} else {
				document.location.replace('chat.html');
			}
		}
	}
});

function sendEmail() {
	auth.currentUser.sendEmailVerification().then(() => {
		console.log("sent");
	});
	auth.signOut();
}
