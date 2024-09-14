import DatabaseWPP from '../db/wpp.js';

import Model from './model.js';

class ModelWPP extends Model {
  protected poolWPP = DatabaseWPP.getPool();
}

export default ModelWPP;
