getChatList()
let currentChat = null;
let currentChatId = null;

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
            }
        })
    })
}

function createYourBubble(message) {
    const anchor = $('#bubble-container');
    anchor.append(`
        <div class="your-bubble">
            <p>${message}</p>
        </div>
    `)
}

function createTheirBubble(message) {
    const anchor = $('#bubble-container');
    anchor.append(`
        <div class="their-bubble">
            ${message}
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
        })
    } catch (error) {
        // lmao
    }
}