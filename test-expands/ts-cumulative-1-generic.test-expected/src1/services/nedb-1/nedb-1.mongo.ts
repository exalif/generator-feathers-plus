
/* tslint:disable:quotemark */
// Defines the MongoDB $jsonSchema for service `nedb1`. (Can be re-generated.)
import merge from 'lodash.merge';
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      nedb2Id: {
        bsonType: "objectId"
      },
      itemType: {
        enum: [
          "offer",
          "bid",
          "auction"
        ],
        bsonType: "string"
      },
      relatedItem: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          itemType: {
            enum: [
              "hardware",
              "wood",
              "toy"
            ],
            bsonType: "string"
          }
        }
      }
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
