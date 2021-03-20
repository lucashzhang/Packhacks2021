const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	$("#signup-error").html("");

	const email = signupForm['email'].value;
	const password = signupForm['password'].value;
	const confirmPassword = signupForm['confirm-password'].value;

	if (password !== confirmPassword) {
		$("#signup-error").html("Passwords do not match");
	} else {
		createUser(email, password);
	}
});

function createUser(email, password) {
	if (auth.currentUser != null) {
		auth.signOut().then(() => {
			createUser(email, password);
		});
	} else {
		auth.createUserWithEmailAndPassword(email, password).then((cred) => {
			auth.currentUser.sendEmailVerification().then(() => {
				db.collection("users").doc(auth.currentUser.uid).set({
					uid: auth.currentUser.uid,
					email: email,
					tutor: signupForm['tutor'].value,
					profilePic: 'default.png',
					tags: [],
					friends: []
				}).then(() => {
					auth.signOut().then(() => {
						console.log("sent");
						drawCheck();
					});
				});
			});

		}).catch(err => {
			$("#signup-error").html(err.message);
		});;
	}
}
