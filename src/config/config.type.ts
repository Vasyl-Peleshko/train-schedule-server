import { Algorithm } from 'jsonwebtoken';

export type CONFIG_TYPES = {
  JWT: {
    SECRET_KEY: string;
    ACCESS_EXP: string;
    REFRESH_EXP: string;
    ALGORITHM: Algorithm;
    ISS: string;
    SUB: string;
  };
  BCRYPT: {
    SALT: number;
  };
};
