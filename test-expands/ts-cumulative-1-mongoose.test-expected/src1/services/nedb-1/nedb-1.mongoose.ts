
/* tslint:disable:quotemark */
// Defines Mongoose model for service `nedb1`. (Can be re-generated.)
import merge from 'lodash.merge';
// tslint:disable-next-line:no-unused-variable
import mongoose from 'mongoose';
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    nedb2Id: mongoose.Schema.Types.ObjectId,
    type: {
      type: String,
      enum: [
        "some",
        "value"
      ]
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
