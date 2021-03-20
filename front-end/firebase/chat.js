getChatList()

function getChatList() {
    auth.onAuthStateChanged((user) => {
        const uid = auth.currentUser.uid;
        db.collection("users").doc(uid).onSnapshot(doc => {
            const chats = doc.data().chats;
            const anchor = $("#tutor-list")
            anchor.html("");
            createTutorCard('Spud The Bot', 'SpudTheB0t');
            for (let chat of chats) {
                const ids = chat.chatId.split("<=>");
                const id = ids[0].trim() === `${uid}` ? `${ids[1]}` : `${ids[0]}`;
                if (id !== 'SpudTheB0t') {
                    createTutorCard(chat.user, id)
                }
            }
        })
    });
}

function createTutorCard(name, id) {
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
        <div class="chat-list-card">
        <div class="chat-list-profile" style="background-color: hsl(0, ${saturation}%, ${level}%)">${name.charAt(0).toUpperCase()}</div>
        ${name}
        </div>
    `)
}