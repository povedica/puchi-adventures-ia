export default class FirebaseManager {
    constructor() {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyASSEoYYNf-jb5FlSbq9Fj5CNxj4X-69_I",
            authDomain: "puchis-adventure.firebaseapp.com",
            projectId: "puchis-adventure",
            storageBucket: "puchis-adventure.appspot.com",
            messagingSenderId: "836031237974",
            appId: "1:836031237974:web:81d54b55d78025b39cd0f7"
        };
        firebase.initializeApp(firebaseConfig);

        this.db = firebase.firestore();
    }

    async addScore(initials, score) {
        try {
            await this.db.collection("scores").add({
                initials,
                score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding score to Firebase", error);
        }
    }

    async getScores() {
        try {
            const scoresSnapshot = await this.db.collection("scores")
                .orderBy("score", "desc")
                .limit(50)
                .get();

            return scoresSnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error("Error fetching scores from Firebase", error);
            return [];
        }
    }
}
