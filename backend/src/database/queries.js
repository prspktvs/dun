export const CREATE_CARDS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  createdAt TEXT,
  chatIds TEXT,
  project_id TEXT
)`

export const CREATE_TASKS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  isDone INTEGER,
  text TEXT,
  users TEXT,
  card_id TEXT,
  FOREIGN KEY (card_id) REFERENCES cards(id)
)`

export const CREATE_FILES_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  type TEXT,
  url TEXT,
  card_id TEXT,
  FOREIGN KEY (card_id) REFERENCES cards(id)
)`

export const INSERT_NEW_CARD_QUERY =
  'INSERT INTO cards (id, title, description, createdAt, chatIds, project_id) VALUES (?, ?, ?, ?, ?, ?)'

export const INSERT_TASK_QUERY = `INSERT OR REPLACE INTO tasks (id, isDone, text, users, card_id) VALUES (?, ?, ?, ?, ?)`

export const INSERT_FILES_QUERY = `INSERT OR REPLACE INTO files (id, type, url, card_id) VALUES (?, ?, ?, ?)`

export const UPDATE_CARD_DESCRIPTION_QUERY = 'UPDATE cards SET description = ? WHERE id = ?'

export const SELECT_USER_TASKS_QUERY = `SELECT tasks.* FROM tasks JOIN cards ON tasks.card_id = cards.id WHERE cards.project_id = ? AND tasks.users LIKE ?`

export const SELECT_TASKS_BY_IDS_QUERY = `SELECT * FROM tasks WHERE id IN (?)`

export const SELECT_ALL_CARDS_BY_PROJECTID_QUERY = `SELECT cards.*, COALESCE((SELECT json_group_array(json_object('id', files.id, 'type', files.type, 'url', files.url)) FROM files WHERE cards.id = files.card_id), '[]') AS files FROM  cards LEFT JOIN files ON cards.id = files.card_id WHERE cards.project_id = ? GROUP BY cards.id`

export const SELECT_CARD_BY_ID_QUERY = 'SELECT * FROM cards WHERE id = ?'

export const SELECT_CARD_WITH_FILES_QUERY = `SELECT cards.*, COALESCE((SELECT json_group_array(json_object('id', files.id, 'type', files.type, 'url', files.url)) FROM files WHERE cards.id = files.card_id), '[]') AS files FROM cards WHERE cards.id = ?`

export const SELECT_ALL_CARD_TASKS_QUERY = `SELECT * FROM tasks WHERE card_id = ?`

export const DELETE_UNUSED_TASKS_QUERY = (placeholders) =>
  `DELETE FROM tasks WHERE id IN (${placeholders})`

export const DELETE_UNUSED_FILES_QUERY = (placeholders) =>
  `DELETE FROM files WHERE id IN (${placeholders})`

export const DELETE_CARD_QUERY = 'DELETE FROM cards WHERE id = ?'
