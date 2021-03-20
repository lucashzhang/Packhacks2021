getChatList()

function getChatList() {
    auth.onAuthStateChanged((user) => {
        const uid = user.uid;
        db.collection("users").doc(uid).onSnapshot(doc => {
            const chats = doc.data().chats;
            const anchor = $("#tutor-list")
            anchor.html("");
            createTutorCard('bot')
            for (let chat of chats) {
                const ids = chat.chatId.split("<=>")
                if (`${ids[0]}` !== 'bot' && `${ids[1]}` !== 'bot') {
                    createTutorCard(chat.user)
                }
            }
        })
    });
}

function createTutorCard(name) {
    const anchor = $("#chat-list")
    anchor.append(`
        <div class="chat-list-card">
        <div class="chat-list-profile" style="background-color: hsl(350, 100%, 50%)">${name.charAt(0).toUpperCase()}</div>
        ${name}
        </div>
    `)
}