export const CREATE_CARDS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  createdAt TEXT,
  updatedAt TEXT,
  chatIds TEXT,
  users TEXT,
  author TEXT,
  project_id TEXT,
  public INTEGER DEFAULT 0
)`

export const CREATE_TASKS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  isDone INTEGER,
  text TEXT,
  users TEXT,
  author TEXT DEFAULT '',
  priority TEXT DEFAULT 'Low',
  status TEXT DEFAULT 'Planned',
  createdAt TEXT,
  position INTEGER DEFAULT 1000,
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

export const CREATE_PUSH_TOKENS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS push_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  subscription TEXT
)`

export const CREATE_MENTIONS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS mentions (
  id TEXT PRIMARY KEY,
  text TEXT,
  user_id TEXT
)`

export const CREATE_ALL_INDEXES = [
  'CREATE INDEX IF NOT EXISTS card_id_index ON tasks (card_id)',
  'CREATE INDEX IF NOT EXISTS project_id_index ON cards (project_id)',
  'CREATE INDEX IF NOT EXISTS card_id_index ON files (card_id)',
  'CREATE INDEX IF NOT EXISTS user_id_index ON push_tokens (user_id)',
  'CREATE INDEX IF NOT EXISTS user_id ON push_tokens (user_id)',
  'CREATE INDEX IF NOT EXISTS user_id ON mentions (user_id)',
]

export const CREATE_TABLES_QUERIES = [
  CREATE_CARDS_TABLE_QUERY,
  CREATE_TASKS_TABLE_QUERY,
  CREATE_FILES_TABLE_QUERY,
  CREATE_PUSH_TOKENS_TABLE_QUERY,
  CREATE_MENTIONS_TABLE_QUERY,
]

export const INSERT_NEW_CARD_QUERY = `
  INSERT INTO cards (id, title, description, createdAt, chatIds, users, author, project_id, public)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`

export const INSERT_TASK_QUERY = `
  INSERT OR REPLACE INTO tasks (id, isDone, text, priority, status, author, users, card_id, createdAt, position)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

export const INSERT_FILES_QUERY = `
  INSERT OR REPLACE INTO files (id, type, url, card_id)
  VALUES (?, ?, ?, ?)
`

export const INSERT_MENTION_QUERY = `
  INSERT OR REPLACE INTO mentions (id, text, user_id)
  VALUES (?, ?, ?)
`

export const INSERT_NEW_USERS_TO_CARD_QUERY = `
  UPDATE cards SET users = ? WHERE id = ?
`

export const UPDATE_CARD_CHAT_IDS_QUERY = `
  UPDATE cards SET chatIds = ? WHERE id = ?
`

export const UPDATE_CARD_QUERY = `
  UPDATE cards SET description = ?, updatedAt = ? WHERE id = ?
`

export const SELECT_USER_TASKS_QUERY = `
  SELECT tasks.* FROM tasks
  JOIN cards ON tasks.card_id = cards.id
  WHERE cards.project_id = ? AND tasks.users LIKE ?
  ORDER BY tasks.position ASC
`
export const SELECT_PROJECT_TASKS_QUERY = `
  SELECT tasks.* FROM tasks
  JOIN cards ON tasks.card_id = cards.id
  WHERE cards.public = 1 AND cards.project_id = ? AND tasks.isDone = ?
  ORDER BY tasks.position ASC
  LIMIT ?, ?
`

export const SELECT_ALL_CARDS_BY_IDS_QUERY = `
  SELECT
    cards.*,
    COALESCE((
        SELECT
          json_group_array(
            json_object('id', files.id, 'type', files.type, 'url', files.url)
          )
        FROM files
        WHERE cards.id = files.card_id
      ), '[]'
    ) AS files,
    COALESCE((
      SELECT json_group_array(json_object(
        'id', tasks.id,
        'isDone', tasks.isDone,
        'text', tasks.text,
        'users', tasks.users,
        'author', tasks.author,
        'priority', tasks.priority,
        'status', tasks.status
      ))
      FROM tasks WHERE cards.id = tasks.card_id), '[]') AS tasks
  FROM cards
  LEFT JOIN files ON cards.id = files.card_id
  WHERE cards.project_id = ? AND cards.id in ($IDS)
  GROUP BY cards.id
`

export const SELECT_ALL_CARDS_BY_PROJECTID_QUERY = (orderBy) => `
  SELECT cards.*,
    COALESCE((
      SELECT json_group_array(
        json_object(
          'id', files.id,
          'type', files.type,
          'url', files.url
        )
      )
      FROM files WHERE cards.id = files.card_id), '[]') AS files,
    COALESCE((
      SELECT json_group_array(json_object(
        'id', tasks.id,
        'isDone', tasks.isDone,
        'text', tasks.text,
        'users', tasks.users,
        'author', tasks.author,
        'priority', tasks.priority,
        'status', tasks.status
      ))
      FROM tasks WHERE cards.id = tasks.card_id), '[]') AS tasks
  FROM cards
  LEFT JOIN files ON cards.id = files.card_id
  WHERE cards.project_id = ?
    AND (cards.public = 1 OR cards.author = ? OR EXISTS (
      SELECT 1
      FROM json_each(cards.users)
      WHERE json_each.value = ?
    ))
    AND (
      cards.title <> '' OR cards.description <> '[]' OR EXISTS (
        SELECT 1
        FROM tasks
        WHERE tasks.card_id = cards.id
      ) <> '[]' OR EXISTS (
        SELECT 1
        FROM files
        WHERE files.card_id = cards.id
      )
    )
  GROUP BY cards.id
  ORDER BY ${orderBy} DESC
`

export const SELECT_CARD_BY_ID_QUERY = `
  SELECT
    cards.*,
    COALESCE((
      SELECT json_group_array(
        json_object('id', files.id, 'type', files.type, 'url', files.url)
      )
      FROM files
      WHERE cards.id = files.card_id
    ), '[]') AS files,
    COALESCE((
      SELECT json_group_array(
        json_object(
          'id', tasks.id,
          'isDone', tasks.isDone,
          'text', tasks.text,
          'users', tasks.users,
          'author', tasks.author,
          'priority', tasks.priority,
          'status', tasks.status
        )
      )
      FROM tasks
      WHERE cards.id = tasks.card_id
    ), '[]') AS tasks
  FROM cards
  WHERE cards.id = ?
`

export const SELECT_CARD_BY_CHAT_ID = 'SELECT * FROM cards WHERE chatIds LIKE ?'

export const SELECT_CARD_WITH_FILES_QUERY = `
  SELECT cards.*,
    COALESCE((
      SELECT json_group_array(json_object('id', files.id, 'type', files.type, 'url', files.url))
      FROM files WHERE cards.id = files.card_id), '[]') AS files
  FROM cards
  WHERE cards.id = ?
`

export const SELECT_ALL_CARD_TASKS_QUERY = 'SELECT * FROM tasks WHERE card_id = ?'

export const SELECT_MENTIONS_QUERY = (placeholders) => `
  SELECT * FROM mentions WHERE id IN (${placeholders})
`

export const DELETE_UNUSED_TASKS_QUERY = (placeholders) => `
  DELETE FROM tasks WHERE id IN (${placeholders})
`

export const DELETE_UNUSED_FILES_QUERY = (placeholders) => `
  DELETE FROM files WHERE id IN (${placeholders})
`

export const DELETE_CARD_QUERY = 'DELETE FROM cards WHERE id = ?'

export const SAVE_PUSH_TOKEN = `
  INSERT OR REPLACE INTO push_tokens (id, user_id, subscription)
  VALUES (?, ?, ?)
`

export const DELETE_PUSH_TOKEN = `
  DELETE FROM push_tokens WHERE user_id = ? AND id = ?
`

export const DELETE_PUSH_TOKEN_BY_ID = 'DELETE FROM push_tokens WHERE id = ?'

export const GET_PUSH_TOKENS = 'SELECT * FROM push_tokens WHERE user_id = ?'
