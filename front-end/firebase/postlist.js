var firebaseConfig = { apiKey: "AIzaSyA3j9W9C6xyr2i90LOmzfp2rLMxLkqtGHc", authDomain: "packhacks2021.firebaseapp.com", projectId: "packhacks2021", storageBucket: "packhacks2021.appspot.com", messagingSenderId: "233589867920", appId: "1:233589867920:web:c7e1bdf16c479516a05f15" };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var url = window.location.href
var urlIDX = url.indexOf("post_ID") + 8
var post_ID = ""
var this_user = "A_ZALA23"
for (var i = urlIDX; i < url.length; i++) {
    post_ID = post_ID + url[i]
}

// var user = firebase.auth();
// if (user) {
//     this_user = user.uid; 
// }

displayAllPosts()

function displayAllPosts() {
    document.querySelectorAll('.postListContainer').forEach(e => e.remove());
    var posts = db.collection('posts');
    posts.get().then((querySnapshot) => {
        var post_div = document.createElement("div");
        querySnapshot.forEach((doc) => {        
            if (doc.id !== "postcount") {
                var this_thread = doc.data().alldata;
                var user = this_thread[0];
                var post = this_thread[1];
                var likes = this_thread[2];
                post_div.innerHTML = post_div.innerHTML + "<div class='postListContainer'><a href=post.html?post_ID=" +  doc.id +  " id='postList'>"+ user +  " [" + likes + " likes] " + post  +"</a></div>"
                console.log(doc.id, " => ", doc.data());
            }
            
                
        });
        document.body.appendChild(post_div)
});
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
                alldata: [this_user, document.getElementById('addCommentTxt').value, 0]
            })
            displayAllPosts()
        } 
        
    })
    
  }