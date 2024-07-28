class Leaderboard {
    constructor(id, username, score) {
        this.id = id;
        this.username = username;
        this.score = score;
    }

    static fromRequestBody(body) {
        return new Leaderboard(null, body.username, body.score);
    }
}

module.exports = Leaderboard;
