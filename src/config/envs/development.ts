import type { AppEnvConfig } from '../config.interface';

export const config : AppEnvConfig = {
  db: {
    type: 'postgres',
    synchronize: false,
    logging: true,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'change-in-production',
    database: process.env.DB_NAME || 'depop',
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
};
