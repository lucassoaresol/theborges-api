/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  interface Request {
    metadata: {
      accountId: string | undefined;
    };
  }
}
