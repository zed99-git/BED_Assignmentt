class Question {
    constructor(id, question, option_a, option_b, option_c, option_d, correct_option) {
        this.id = id;
        this.question = question;
        this.option_a = option_a;
        this.option_b = option_b;
        this.option_c = option_c;
        this.option_d = option_d;
        this.correct_option = correct_option;
    }

    static fromRequestBody(body) {
        return new Question(null, body.question, body.option_a, body.option_b, body.option_c, body.option_d, body.correct_option);
    }
}

module.exports = Question;
