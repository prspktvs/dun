// ExtendedSQLite.js
import { SQLite } from '@hocuspocus/extension-sqlite';
import sqlite3 from 'sqlite3';

export class ExtendedSQLite extends SQLite {
  constructor(configuration) {
    super(configuration);
    this.initializeDatabase();
  }

  async onConfigure() {}

  initializeDatabase() {
    this.db = new sqlite3.Database(this.configuration.database, (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to database');
        this.db.run(this.configuration.schema, (err) => {
          if (err) {
            console.error('Could not initialize database schema', err);
          } else {
            console.log('Database schema initialized successfully');
          }
        });
      }
    });
  }
}