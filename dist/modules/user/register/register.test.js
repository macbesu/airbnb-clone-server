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
const User_1 = require("../../../entity/User");
const faker = require("faker");
const errorMessages_1 = require("./errorMessages");
const createTypeormConn_1 = require("../../../utils/createTypeormConn");
const TestClient_1 = require("../../../utils/TestClient");
const email = faker.internet.email();
const password = faker.internet.password();
let conn;
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    conn = yield createTypeormConn_1.createTypeormConn();
}));
afterAll(() => __awaiter(this, void 0, void 0, function* () {
    conn.close();
}));
describe("Register user", () => __awaiter(this, void 0, void 0, function* () {
    it('check for duplicate emails', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        const res = yield client.register(email, password);
        expect(res.data).toEqual({ register: null });
        const users = yield User_1.User.find({ where: { email } });
        expect(users).toHaveLength(1);
        const user = users[0];
        expect(user.email).toEqual(email);
        expect(user.password).not.toEqual(password);
        const res2 = yield client.register(email, password);
        expect(res2.data.register).toHaveLength(1);
        expect(res2.data.register[0]).toEqual({
            path: 'email',
            message: errorMessages_1.duplicateEmail,
        });
    }));
    it('check bad email', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        const res3 = yield client.register("b", password);
        expect(res3.data).toEqual({
            register: [
                {
                    path: 'email',
                    message: errorMessages_1.emailNotLongEnough,
                },
                {
                    path: 'email',
                    message: errorMessages_1.invalidEmail,
                },
            ],
        });
    }));
    it('check bad password', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        const res4 = yield client.register(email, 'ad');
        expect(res4.data).toEqual({
            register: [
                {
                    path: 'password',
                    message: errorMessages_1.passwordNotLongEnough,
                },
            ],
        });
    }));
    it('check bad email and bad password', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        const res5 = yield client.register('em', 'ad');
        expect(res5.data).toEqual({
            register: [
                {
                    path: 'email',
                    message: errorMessages_1.emailNotLongEnough,
                },
                {
                    path: 'email',
                    message: errorMessages_1.invalidEmail,
                },
                {
                    path: 'password',
                    message: errorMessages_1.passwordNotLongEnough,
                },
            ],
        });
    }));
}));
//# sourceMappingURL=register.test.js.map