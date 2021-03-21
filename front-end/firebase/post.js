var firebaseConfig = { apiKey: "AIzaSyA3j9W9C6xyr2i90LOmzfp2rLMxLkqtGHc", authDomain: "packhacks2021.firebaseapp.com", projectId: "packhacks2021", storageBucket: "packhacks2021.appspot.com", messagingSenderId: "233589867920", appId: "1:233589867920:web:c7e1bdf16c479516a05f15" };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var url = window.location.href
var urlIDX = url.indexOf("post_ID") + 8
var post_ID = ""


var this_user = "Anonymous"
console.log(firebase.auth())
var user = firebase.auth();
console.log(user)
if (user) {
    this_user = user.uid; 
}
console.log(this_user)

for (var i = urlIDX; i < url.length; i++) {
    post_ID = post_ID + url[i]
}






function writeUserData() {
    var postcount = db.collection("posts").doc("postcount");
    postcount.get().then((doc) => {
        if (doc.exists) {
                var currcount = doc.data();
                currcount = currcount.postcount;
                var nextcount = currcount + 1;
                postcount.set({postcount: nextcount})
                var post = db.collection("posts").doc(this_user + currcount);
                post.set({
                    alldata: [this_user, this_post, 0]
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
    var post = db.collection("posts").doc(post_ID);
        post.get().then((doc) => { 
            var post_arr = doc.data().alldata;
            post_arr[2] = post_arr[2] + 1;
            post.set({
                alldata: post_arr,
            })
            displayPost() 
        })
    
}

// likePost('david_lu3')
function writeComment() {
    var post = db.collection("posts").doc(post_ID);
                post.get().then((doc2) => { 
                    var post_arr = doc2.data().alldata;
                    post_arr[post_arr.length] = document.getElementById('commentName').value;
                    post_arr[post_arr.length] = document.getElementById('addCommentTxt').value;
                    document.getElementById('addCommentTxt').value = "";
                    post.set({
                        alldata: post_arr,
                    })
                    displayPost()
                })

}

function displayPost() {
    var this_post = db.collection("posts").doc(post_ID);
    document.querySelectorAll('.userPostContainer').forEach(e => e.remove());
    document.querySelectorAll('.commentContainer').forEach(e => e.remove());
    
    this_post.get().then((doc) => {
        
        var this_thread = doc.data().alldata;
        var user = this_thread[0];
        var post = this_thread[1];
        var likes = this_thread[2];
        var post_div = document.createElement("div");
        post_div.innerHTML = "<div class='userPostContainer'>" + "<div class='userPost'>  User: " + user  + "</div>" + "<div class='userPost'>  Question: " + post  + "</div>" + "<div class='userPost'> Likes: " + likes + "<button class='likebtn' onclick='likePost()'></button>" +"</div><div class='userPost'><hr>Comments<hr><input id='commentName' placeholder='Name' style='width: 10%'> |  <input id='addCommentTxt' placeholder='Comment' class='addCommentTxt' type='text'><button class='addCommentBtn' onclick='writeComment()'>Add Comment</button></div></div> " 

        document.body.appendChild(post_div)
        // CODE HERE TO DISPLAY USER, POST, AND LIKES
        
        var comment_div = document.createElement("div")
        for (var i =  3; i < this_thread.length; i += 2) {
            // CODE HERE TO APPEND COMMENTS TO THE PAGE
            var comment_user = this_thread[i];
            var comment = this_thread[i+1]

            comment_div.innerHTML = comment_div.innerHTML + "<div class='commentContainer'>" + "<div class='comment'>  User: " + comment_user  + "</div>" + "<div class='comment'>  Comment: " + comment  + "</div>" + "</div>" 
        }
        document.body.appendChild(comment_div)

    })

}


displayPost(post_ID)