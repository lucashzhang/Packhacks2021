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

function createChatId(uid1, uid2) {
	return uid1 > uid2 ? `${uid1}<=>${uid2}` : `${uid1}<=>${uid2}`;
}

function createUser(email, password) {
	if (auth.currentUser != null) {
		auth.signOut().then(() => {
			createUser(email, password);
		});
	} else {
		auth.createUserWithEmailAndPassword(email, password).then((cred) => {
			auth.currentUser.sendEmailVerification().then(() => {
				const chatId = createChatId(auth.currentUser.uid, "SpudTheB0t");
				db.collection("users").doc(auth.currentUser.uid).set({
					uid: auth.currentUser.uid,
					email: email,
					tutor: signupForm['tutor'].value,
					profilePic: 'default.png',
					tags: [],
					chats: [{
						user: 'Spud The Bot',
						chatId
					}],
					friends: []
				}).then(() => {
					auth.signOut().then(() => {
						console.log("sent");
						drawCheck();
					});
				});
				db.collection("chats").doc(chatId).set({
					messages: []
				})
			});

		}).catch(err => {
			$("#signup-error").html(err.message);
		});;
	}
}
