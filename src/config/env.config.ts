import { ConfigService } from '@nestjs/config';
import { CONFIG_TYPES } from './config.type';

const createAppConfig = (configService: ConfigService): CONFIG_TYPES => ({
  JWT: {
    SECRET_KEY: configService.get<string>('JWT_SECRET_KEY', 'o5XpTBetGW'),
    ACCESS_EXP: configService.get<string>('JWT_ACCESS_EXP', '24h'),
    REFRESH_EXP: configService.get<string>('JWT_REFRESH_EXP', '10d'),
    ALGORITHM: 'HS256',
    ISS: 'Train Schedule',
    SUB: 'Authorization & Authentication',
  },
  BCRYPT: {
    SALT: 10,
  },
});

export default createAppConfig;
