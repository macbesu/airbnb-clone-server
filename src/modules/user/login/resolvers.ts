import * as bcrypt from 'bcryptjs';

import { ResolverMap } from "../../../types/graphql-utils";
import { User } from '../../../entity/User';
import { invalidLogin, confirmEmailError, forgotPasswordLockedError } from './errorMessages';
import { userSessionIdPrefix } from '../../../constants';

const errMsgResponse = [{
  path: 'email',
  message: invalidLogin,
}];

export const resolvers: ResolverMap = {Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session, redis, req }
    ) => {
      const user = await User.findOne({ where: { email, } });

      if (!user) {
        return errMsgResponse;
      }

      if (!user.confirmed) {
        return [{
          path: 'email',
          message: confirmEmailError,
        }]
      }

      if (user.forgotPasswordLocked) {
        return [{
          path: 'email',
          message: forgotPasswordLockedError,
        }]
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        return errMsgResponse;
      }

      // login successful
      session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    }
  }
};