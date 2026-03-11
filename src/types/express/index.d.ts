declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        roles: string[];
        active: boolean;
      };
    }
  }
}
export {};
