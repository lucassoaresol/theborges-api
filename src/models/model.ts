import Database from '../db/pg.js';

class Model {
  protected pool = Database.getPool();
}

export default Model;
