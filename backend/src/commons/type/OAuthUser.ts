export interface IOAuthUser {
  user: {
    email: string;
    hashedPwd: string;
    name: string;
    address: string;
  };
}
