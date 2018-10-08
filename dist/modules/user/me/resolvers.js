"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../../entity/User");
const createMiddleware_1 = require("../../../utils/createMiddleware");
const middleware_1 = require("./middleware");
exports.resolvers = {
    Query: {
        me: createMiddleware_1.createMiddleware(middleware_1.default, (_, __, { session }) => User_1.User.findOne({ where: { id: session.userId } })),
    },
};
//# sourceMappingURL=resolvers.js.map