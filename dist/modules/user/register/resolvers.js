"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
const User_1 = require("../../../entity/User");
const formatYupError_1 = require("../../../utils/formatYupError");
const errorMessages_1 = require("./errorMessages");
const yupSchema_1 = require("../../../yupSchema");
const createConfirmEmailLink_1 = require("./createConfirmEmailLink");
const sendEmail_1 = require("../../../utils/sendEmail");
const schema = yup.object().shape({
    email: yup
        .string()
        .min(3, errorMessages_1.emailNotLongEnough)
        .max(255)
        .email(errorMessages_1.invalidEmail),
    password: yupSchema_1.registerPasswordValidation,
});
exports.resolvers = {
    Mutation: {
        register: (_, args, { redis, url }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield schema.validate(args, { abortEarly: false });
            }
            catch (err) {
                return formatYupError_1.formatYupError(err);
            }
            const { email, password } = args;
            const userAlreadyExists = yield User_1.User.findOne({
                where: { email },
                select: ['id'],
            });
            if (userAlreadyExists) {
                return [
                    {
                        path: 'email',
                        message: errorMessages_1.duplicateEmail,
                    }
                ];
            }
            const user = User_1.User.create({
                email,
                password,
            });
            yield user.save();
            if (process.env.NODE_ENV !== 'test') {
                yield sendEmail_1.sendEmail(email, yield createConfirmEmailLink_1.createConfirmEmailLink(url, user.id, redis));
            }
            return null;
        })
    }
};
//# sourceMappingURL=resolvers.js.map