function isLoginType(val) {
    for (const key in this) {
        if (this[key] === val) {
            return true;
        }
    }
    return false;
}

const LoginType = {
    USER_MINI_PROGRAM: 100,
    USER_EMAIL: 101,
    USER_MOBILE: 102,
    ADMIN_EMAIL: 200,
    isLoginType
};

const ArtType = {
    Movie: 100,
    Music: 200,
    Sentence: 300,
    BOOK: 400,
    isLoginType
}

module.exports = {
    LoginType,
    ArtType
};
