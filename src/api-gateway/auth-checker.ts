import { Context } from "./api-gateway";

export const customAuthChecker = ({ context }: { context: Context }) => {
  const { userId } = context;
  if (!userId) {
    throw new Error("Access denied! Please login to continue!");
  }
  return true; // or false if access is denied
};
