import jwt from "jsonwebtoken";
export const generateToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string);
  return token;
};
