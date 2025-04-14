export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}
