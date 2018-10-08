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
const createTypeormConn_1 = require("../../../utils/createTypeormConn");
const User_1 = require("../../../entity/User");
const TestClient_1 = require("../../../utils/TestClient");
let userId;
let conn;
const email = 'ivan@gmail.com';
const password = 'jiqirenbinbgi';
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    conn = yield createTypeormConn_1.createTypeormConn();
    const user = yield User_1.User.create({
        email,
        password,
        confirmed: true,
    }).save();
    userId = user.id;
}));
afterAll(() => __awaiter(this, void 0, void 0, function* () {
    conn.close();
}));
describe('me', () => __awaiter(this, void 0, void 0, function* () {
    test('return null if no cookie', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        const res = yield client.me();
        expect(res.data.me).toBeNull();
    }));
    test('get current user', () => __awaiter(this, void 0, void 0, function* () {
        const client = new TestClient_1.TestClient(process.env.TEST_HOST);
        yield client.login(email, password);
        const res = yield client.me();
        expect(res.data).toEqual({
            me: {
                id: userId,
                email,
            }
        });
    }));
}));
//# sourceMappingURL=me.test.js.map