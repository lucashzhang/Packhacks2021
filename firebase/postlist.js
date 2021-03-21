let url = window.location.href
let urlIDX = url.indexOf("post_ID") + 8
let post_ID = ""
let this_user = null;
let this_user_id = null;
for (let i = urlIDX; i < url.length; i++) {
    post_ID = post_ID + url[i]
}

auth.onAuthStateChanged((user) => {
    const uid = user.uid;
    this_user_id = uid;
    console.log(uid)
    db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        this_user = email.substring(0, email.indexOf('@'))
    })
});
displayAllPosts()


function displayAllPosts() {
    document.querySelectorAll('.postListContainer').forEach(e => e.remove());
    let posts = db.collection('posts');
    posts.get().then((querySnapshot) => {
        let post_div = document.createElement("div");
        querySnapshot.forEach((doc) => {        
            if (doc.id !== "postcount") {
                let this_thread = doc.data().alldata;
                let user = this_thread[0];
                let post = this_thread[1];
                let likes = this_thread[2];
                post_div.innerHTML = post_div.innerHTML + "<div class='postListContainer'><a href=post.html?post_ID=" +  doc.id +  " id='postList'>" + " [" + likes + " likes] "  + user + ": "+ post  +"</a></div>"
                console.log(doc.id, " => ", doc.data());
            }
            
                
        });
        document.body.appendChild(post_div)
});
}



function writeUserData() {
    let postcount = db.collection("posts").doc("postcount");
    postcount.get().then((doc) => {
        if (doc.exists && this_user) {
            let currcount = doc.data();
            currcount = currcount.postcount;
            let nextcount = currcount + 1;
            postcount.set({postcount: nextcount})
            let post = db.collection("posts").doc(this_user + currcount);
            console
            post.set({
                user_id: this_user_id,
                alldata: [this_user, document.getElementById('addCommentTxt').value, 0],
                
            })
            displayAllPosts()
        } 
        
    })
    
  }