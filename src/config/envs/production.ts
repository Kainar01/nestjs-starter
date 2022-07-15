import type { AppEnvConfig } from '../config.interface';

export const config: AppEnvConfig = {
  db: {
    type: 'postgres',
    synchronize: false,
    logging: false,
    replication: {
      master: {
        host: process.env.DB_HOST || 'masterHost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER || 'username',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'dbname',
      },
      slaves: [
        {
          // fix if necessary
          host: 'slaveHost',
          port: 3306,
          username: 'username',
          password: 'password',
          database: 'dbname',
        },
      ],
    },
    extra: {
      connectionLimit: 30,
    },
    autoLoadEntities: true,
  },
  auth: {
    cookieSecure: true,
  },
};
