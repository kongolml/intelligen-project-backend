import bcrypt from 'bcrypt';
import { DefaultAuthProvider } from 'adminjs';

import { componentLoader } from './component-loader.js';
import { DEFAULT_ADMIN } from './constants.js';

const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    if (email !== DEFAULT_ADMIN.email) {
      return null;
    }

    const isValid = await bcrypt.compare(password, DEFAULT_ADMIN.passwordHash);
    if (!isValid) {
      return null;
    }

    return { email };
  },
});

export default provider;
