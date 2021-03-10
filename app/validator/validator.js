const { Rule, LinValidator } = require('@core/lin-validator-v2');
const { User } = require('@models/user');
const { LoginType, ArtType } = require('@lib/enum');

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super();
        // 声明 isInt，会对参数做类型转换
        this.id = [new Rule('isInt', '参数为正整数', { min: 1 })];
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super();
        this.email = [new Rule('isEmail', '不符合Email规范')];

        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 24
            }),
            new Rule(
                'matches',
                '密码不符合规范',
                "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,.#%'+*-:;^_`]+$)[,.#%'+*-:;^_`0-9A-Za-z]{6,20}$"
            )
        ];

        this.password2 = this.password1;

        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 4,
                max: 32
            })
        ];
    }

    validatePassword(vals) {
        const { password1, password2 } = vals.body;

        if (password1 !== password2) {
            throw new Error('两个密码不一致');
        }
    }

    async validateEmail(vals) {
        const { email } = vals.body;
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (user) {
            throw new Error('邮箱已存在');
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super();
        this.account = [
            new Rule('isLength', '不符合账户规则', {
                min: 4,
                max: 32
            })
        ];

        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength', '至少6个字符', {
                min: 6,
                max: 128
            })
        ];
    }

    validateLoginType(vals) {
        if (!vals.body.type) {
            throw new Error('type不能为空');
        }
        if (!LoginType.isLoginType(vals.body.type)) {
            throw new Error('type参数不合法');
        }
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super();
        this.token = [new Rule('isLength', 'token不能为空', { min: 1 })];
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super();
        this.validateType = checkArtType;
    }
}

class ClassicValidator extends LikeValidator {}

function checkArtType(vals) {
    let type = vals.body.type || vals.path.type;
    if (!type) {
        throw new Error('type不能为空');
    }
    type = parseInt(type);
    if (!ArtType.isLoginType(type)) {
        throw new Error('type参数不合法');
    }
}

class SearchValidator extends LinValidator {
    constructor() {
        super();
        this.q = [new Rule('isLength', '搜索关键字不能为空', { min: 0, max: 16 })];
        this.start = [
            new Rule('isInt', '不符合规范', { min: 0, max: 60000 }),
            new Rule('isOptional', '', 0) // 默认值
        ];
        this.count = [
            new Rule('isInt', '不符合规范', { min: 1, max: 20 }),
            new Rule('isOptional', '', 20) // 默认值
        ];
    }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
    constructor() {
        super();
        this.content = [
            new Rule('isLength', '内容不符合长度规范', {
                min: 1,
                max: 12
            })
        ];
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator,
    ClassicValidator,
    SearchValidator,
    AddShortCommentValidator
};
