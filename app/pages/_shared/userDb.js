import { STORAGE_KEY } from './constants.js';

class UserDb {
  static insert(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  static get() {
    const result = localStorage.getItem(STORAGE_KEY);

    return JSON.parse(result || '{}');
  }
}

export default UserDb;
