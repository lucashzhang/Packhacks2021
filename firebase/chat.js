getChatList()
let currentChat = null;
let currentChatId = null;


let url = window.location.href
let urlIDX = url.indexOf("chat_ID") + 8
let chat_ID = "";
for (let i = urlIDX; i < url.length; i++) {
    chat_ID = chat_ID + url[i]
}
let firebaseChatID = chat_ID.replace("%3C=%3E","<=>")


console.log(firebaseChatID)

function createChatId(uid1, uid2) {
    return uid1 > uid2 ? `${uid1}<=>${uid2}` : `${uid1}<=>${uid2}`;
}

function getChatList() {
    auth.onAuthStateChanged((user) => {
        const uid = auth.currentUser.uid;
        db.collection("users").doc(uid).onSnapshot(doc => {
            const chats = doc.data().chats;
            const anchor = $("#tutor-list")
            anchor.html("");
            createTutorCard('Spud The Bot', 'SpudTheB0t', createChatId(uid, 'SpudTheB0t'));
            for (let chat of chats) {
                const ids = chat.chatId.split("<=>");
                const id = ids[0].trim() === `${uid}` ? `${ids[1]}` : `${ids[0]}`;
                if (id !== 'SpudTheB0t') {
                    createTutorCard(chat.user, id, chat.chatId)
                }
                console.log(ids)
            }
        })
    });
}

function createTutorCard(name, id, chatId) {
    const anchor = $("#chat-list")
    let saturation = 0;
    let level = 0;
    for (let i = 0; i < 10; i++) {
        saturation += id.charCodeAt(i) || 0;
    }
    for (let i = 0; i < name.length; i++) {
        level += name.charCodeAt(i) || 0;
    }
    saturation = 50 + saturation % 50;
    level = 50 + level % 50;

    anchor.append(`
        <div class="chat-list-card" id="${id}-chat-card">
        <div class="chat-list-profile" style="background-color: hsl(0, ${saturation}%, ${level}%)">${name.charAt(0).toUpperCase()}</div>
        ${name}
        </div>
    `)
    $(`#${id}-chat-card`).click(() => {
		$(".chat-input").css("display", "block");
        readChat(chatId)
    })
}

function readChat(chatId) {
    if (currentChat) currentChat();
    currentChatId = chatId;
    currentChat = db.collection("chats").doc(chatId).collection("messages").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        $('#bubble-container').html('')
        snapshot.docs.map(doc => {
            const data = doc.data();
            if (data.author === `${auth.currentUser.uid}`.trim()) {
                createYourBubble(data.content)
            } else {
                createTheirBubble(data.content)
            }

			$('#bubble-container').scrollTop($('#bubble-container')[0].scrollHeight);
        })
    })
}

function createYourBubble(message) {
    const anchor = $('#bubble-container');
    anchor.append(`
        <div class="your-bubble">
            <div>${message}</div>
        </div>
    `)
}

function createTheirBubble(message) {
    const anchor = $('#bubble-container');
    anchor.append(`
        <div class="their-bubble">
            <div>${message}</div>
        </div>
    `)
}

function sendMessage(e) {
    e.preventDefault();
    const message = $('#chat-text').val();
    $('#chat-text').val('');
    if (message.length === 0 || !currentChatId) return;
    console.log(message)
    try {
        db.collection("chats").doc(currentChatId).collection("messages").add({
            content: message,
            author: auth.currentUser.uid,
            timestamp: firebase.firestore.Timestamp.now()
        });
        useModel(message)

    } catch (error) {
        // lmao
    }
}

function useModel(message) {

    function postAsBot(response) {
        db.collection("chats").doc(currentChatId).collection("messages").add({
            content: response,
            author: 'SpudTheB0t',
            timestamp: firebase.firestore.Timestamp.now()
        });
    }

    $.ajax({
        url: "https://api.aszala.com:3000/?cmd=" + encodeURIComponent(message),
        type: 'get',
        dataType: 'json',
        success: function (res) {
            console.log('success')
            console.log(res);
            postAsBot(res);
        },
        error: function (res) {
            if (res.responseText && typeof res.responseText === "string" && res.responseText.length > 0) {
                console.log('lmao')
                console.log(res.responseText)
                postAsBot(res.responseText);
            } else {
                console.log('error')
            }
        }
    });
}

function createChat(uid) {
    const ownId = auth.currentUser.uid
    const chatId = createChatId(ownId, uid)
    db.collection("chats").doc(chatId).collection('messages').add({})
    db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        let this_user = email.substring(0, email.indexOf('@'))
        db.collection("users").doc(uid).update({
            chats: [{
                chatId: chatId,
                user: this_user
            }]
        }, { merge: true });
    });
    db.collection("users").doc(ownId).get().then(doc => {
        if (!doc.exists) return;
        let email = doc.data().email;
        let this_user = email.substring(0, email.indexOf('@'))
        db.collection("users").doc(ownId).update({
            chats: [{
                chatId: chatId,
                user: this_user
            }]
        }, { merge: true });
    });

}
