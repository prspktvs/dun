import { SQLite } from '@hocuspocus/extension-sqlite'
import sqlite3 from 'sqlite3'

export class ExtendedSQLite extends SQLite {
  constructor(configuration) {
    super(configuration)
    this.initializeDatabase()
  }

  async onConfigure() {}

  initializeDatabase() {
    this.db = new sqlite3.Database(this.configuration.database, (err) =>
      err
        ? console.log(`[x] Database error: ${err}`)
        : console.log(`> Database connected to ${this.configuration.database}`),
    )
    this.db.run(this.configuration.schema, (err) => {
      if (err) console.log(`[x] Schema error: ${err}`)
    })
  }
}
