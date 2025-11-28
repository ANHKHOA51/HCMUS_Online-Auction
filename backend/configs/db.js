import knex from 'knex';
import config from '../knexFile.js';

export const db = knex(config.development);

