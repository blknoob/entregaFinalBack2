import bcrypt from "bcrypt";

export const createHash = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const isValidPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
