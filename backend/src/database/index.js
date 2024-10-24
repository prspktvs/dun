// index.js
import { ExtendedSQLite } from './ExtendedSQLite.js';
import { CREATE_TASKS_TABLE_QUERY, CREATE_CARDS_TABLE_QUERY, CREATE_ALL_INDEXES } from './queries.js';

const schema = `
  ${CREATE_CARDS_TABLE_QUERY};
  ${CREATE_TASKS_TABLE_QUERY};
  ${CREATE_ALL_INDEXES.join('; ')}
`;

export const sqliteExtension = new ExtendedSQLite({
  database: 'sqlite.db',
  schema: schema,
});

export const db = sqliteExtension.db;

export async function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    console.log(query, params);
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

export async function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    console.log(query, params);
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export async function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    console.log(query, params);
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}