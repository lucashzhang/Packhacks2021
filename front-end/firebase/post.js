var firebaseConfig = { apiKey: "AIzaSyA3j9W9C6xyr2i90LOmzfp2rLMxLkqtGHc", authDomain: "packhacks2021.firebaseapp.com", projectId: "packhacks2021", storageBucket: "packhacks2021.appspot.com", messagingSenderId: "233589867920", appId: "1:233589867920:web:c7e1bdf16c479516a05f15" };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();



function writeUserData(this_user, this_post, post_ID) {
    var postcount = db.collection("posts").doc("postcount");
    var is_comment = false;
    if (post_ID != -1) {
        is_comment = true;
    }    
    postcount.get().then((doc) => {
        if (doc.exists) {
            
        
            if (!is_comment) {
                var currcount = doc.data();
                currcount = currcount.postcount;
                var nextcount = currcount + 1;
                postcount.set({postcount: nextcount})
                var post = db.collection("posts").doc(this_user + currcount);
                post.set({
                    alldata: [this_user, this_post, 0]
                })
                // even numbers (0 inclusive) are the user IDS of comments, the odd number following an even number is the actual post
            } else {
                var post = db.collection("posts").doc(post_ID);
                post.get().then((doc2) => { 
                    var post_arr = doc2.data().alldata;
                    post_arr[post_arr.length] = this_user;
                    post_arr[post_arr.length] = this_post;
                    post.set({
                        alldata: post_arr,
                    })
                })
            }
           
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    }); 
  }

//   writeUserData("david_lu", "I am really dumb can u help me answer what 1+1 is?", -1)
//   writeUserData("lucaszhang69", "i love you", "david_lu3")

function likePost(post_ID) {
    var post = db.collection("posts").doc(post_ID);
        post.get().then((doc) => { 
            var post_arr = doc.data().alldata;
            post_arr[2] = post_arr[2] + 1;
            post.set({
                alldata: post_arr,
            })
        })
}

// likePost('david_lu3')

function displayPost(post_ID) {
    var this_post = db.collection("posts").doc(post_ID);


    this_post.get().then((doc) => {
        var this_thread = doc.data().alldata;
        var user = this_thread[0];
        var post = this_thread[1];
        var likes = this_thread[2];
        // CODE HERE TO DISPLAY USER, POST, AND LIKES



        
        var comments = []
        for (var i =  3; i < this_thread.length; i += 2) {
            // CODE HERE TO APPEND COMMENTS TO THE PAGE
            var comment_user = this_thread[i];
            var comment = this_thread[i+1]
        }
    })

}
displayPost('david_lu3')