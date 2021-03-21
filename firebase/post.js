let url = window.location.href
let urlIDX = url.indexOf("post_ID") + 8
let post_ID = ""

for (let i = urlIDX; i < url.length; i++) {
    post_ID = post_ID + url[i]
}

let this_user = null;
// console.log(firebase.auth())
// let user = firebase.auth();
// console.log(user)
// if (user) {
//     this_user = user.uid;
// }
// console.log(this_user)
var this_user_ID;

auth.onAuthStateChanged((user) => {
    const uid = user.uid;
    this_user_ID = uid;
    db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        this_user = email.substring(0, email.indexOf('@'))
    })
});




function writeUserData() {
    let postcount = db.collection("posts").doc("postcount");
    postcount.get().then((doc) => {
        if (doc.exists && this_user) {
            let currcount = doc.data();
            currcount = currcount.postcount;
            let nextcount = currcount + 1;
            postcount.set({ postcount: nextcount })
            let post = db.collection("posts").doc(this_user + currcount);
            post.set({
                alldata: [this_user, this_post, 0],
                user_id: this_user_ID,

            })
            // even numbers (0 inclusive) are the user IDS of comments, the odd number following an even number is the actual post
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

//   writeUserData("david_lu", "I am really dumb can u help me answer what 1+1 is?", -1)
//   writeUserData("lucaszhang69", "i love you", "david_lu3")

function likePost() {
    let post = db.collection("posts").doc(post_ID);
    post.get().then((doc) => {
        let post_arr = doc.data().alldata;
        post_arr[2] = post_arr[2] + 1;
        post.set({
            alldata: post_arr,
            user_id: this_user_ID,
        })
        displayPost()
    })

}

// likePost('david_lu3')
function writeComment() {
    let post = db.collection("posts").doc(post_ID);
    post.get().then((doc2) => {
        if (!this_user) return;
        console.log(doc2.data())
        let post_arr = doc2.data().alldata;
        let this_user_ID = doc2.data().user_id;
        console.log(this_user_ID)
        post_arr[post_arr.length] = this_user;
        post_arr[post_arr.length] = document.getElementById('addCommentTxt').value;
        document.getElementById('addCommentTxt').value = "";
        post.set({
            alldata: post_arr,
            user_id: this_user_ID,
        })
        displayPost()
    })

}

function displayPost() {
    let this_post = db.collection("posts").doc(post_ID);
    document.querySelectorAll('.userPostContainer').forEach(e => e.remove());

    this_post.get().then((doc) => {

        let this_thread = doc.data().alldata;
        let user = this_thread[0];
        let post = this_thread[1];
        let likes = this_thread[2];
		let comments = (this_thread.length -3) / 2;
        let post_div = $("#post-container");
        post_div.html(`<div class='userPostContainer'>
							<a href='postlist.html' class="back-button">< Back</a>
							<br><br>
							<div class='post-title'>${post}</div>
							<div class='post-author-click profile_Click' onclick='profileClick()'><span>Asked by ${user}</span></div>
							<div class="likes" onclick='likePost()' style='cursor:pointer;'>${likes}<span class="heart">&hearts;</span> ${comments} <span class="comment-icon"><i class='fas fa-comment' style='font-size:20px'></i></span></div>
							<div class='userPost'>
								<hr>
								<h3>Answers</h3>
								<br>
								<input id='addCommentTxt' placeholder='Write your answer...' class='textfield' type='text'>
								<button class='button' onclick='writeComment()'>Answer</button>
							</div>
						</div>`);
        // CODE HERE TO DISPLAY USER, POST, AND LIKES

        let comment_div = $("#comment-container")

		if ((this_thread.length -3) / 2 > 1 ) {
			comment_div.html("");
		}

        for (let i = 3; i < this_thread.length; i += 2) {
            // CODE HERE TO APPEND COMMENTS TO THE PAGE
            let comment_user = this_thread[i];
            let comment = this_thread[i + 1];

            //comment_div.innerHTML = comment_div.innerHTML + "<div class='commentContainer'>" + "<div class='comment'>" + comment_user + " says: " + comment + "</div>" + "</div>"
			comment_div.append(`<div class='commentContainer'><div class='comment'><span class="comment-author">${comment_user}</span> says: ${comment}</div></div>`);
	    }

    })

}

function profileClick() {
    let this_post = db.collection("posts").doc(post_ID);
    this_post.get().then((doc) => {
        let this_post_user_ID = doc.data().user_id;
        // GO TO THE CHAT WITH this_user_ID (YOU) and this_post_user_ID (OTHER PARTY)
        createChat(this_post_user_ID)
        console.log("post User: " + this_post_user_ID + "\n logged in user: " + this_user)
        window.location.href = "./chat.html?chat_ID=" + this_user_ID + "<=>" + this_post_user_ID
    })


}

function createChat(uid) {

    function createChatId(uid1, uid2) {
        return uid1 > uid2 ? `${uid1}<=>${uid2}` : `${uid1}<=>${uid2}`;
    }

    function filterChat(chat, chatArray) {
        if (!chatArray.length) return [chat]
        chatArray = chatArray.filter(value => `${value.chatId}` !== `${chat.chatId}`);
        return [...chatArray, chat];
    }

    const ownId = auth.currentUser.uid
    const chatId = createChatId(ownId, uid)
    db.collection("chats").doc(chatId).collection('messages').get().then(doc => {
        if (doc.exists) db.collection("chats").doc(chatId).collection('messages').add({})
    })
    db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        let that_user = email.substring(0, email.indexOf('@'));
        let chats = filterChat({
            chatId: chatId,
            user: that_user
        }, doc.data().chats);
        db.collection("users").doc(ownId).update({
            chats: chats
        });
    });
    db.collection("users").doc(ownId).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        let that_user = email.substring(0, email.indexOf('@'));
        let chats = filterChat({
            chatId: chatId,
            user: that_user
        }, doc.data().chats);
        db.collection("users").doc(uid).update({
            chats: chats
        });
    });

}

displayPost(post_ID)
