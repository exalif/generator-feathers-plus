
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
              "HardWare",
              "wood",
              "toy"
            ],
            bsonType: "string"
          },
          additionalTypes: {
            items: {
              enum: [
                "offer",
                "bid",
                "auction"
              ],
              type: "string"
            },
            bsonType: "array"
          },
          itemSizeWithoutKeys: {
            enum: [
              1,
              2,
              3
            ],
            bsonType: "number"
          },
          itemSize: {
            enum: [
              1,
              2,
              3
            ],
            enumKeys: [
              "small",
              "medium",
              "large"
            ],
            bsonType: "number"
          },
          additionalSizes: {
            items: {
              type: "number",
              enum: [
                1,
                2,
                3
              ],
              enumKeys: [
                "wide",
                "tall",
                "narrow"
              ]
            },
            bsonType: "array"
          },
          additionalSizesWithoutKeys: {
            items: {
              type: "number",
              enum: [
                1,
                2,
                3
              ]
            },
            bsonType: "array"
          },
          existingTypeWithRelativePath: {
            enum: [
              "one",
              "two"
            ],
            useExistingEnum: "ExistingEnum",
            existingEnumPath: "existing/type.enum",
            existingEnumPathRelativeToModels: true,
            bsonType: "string"
          },
          existingTypeWithAbsolutePath: {
            enum: [
              1,
              2,
              3
            ],
            useExistingEnum: "ExistingEnumWithAbs",
            existingEnumPath: "@someAlias/existing.enum",
            existingEnumPathRelativeToModels: false,
            bsonType: "number"
          },
          existingEnumArray: {
            items: {
              type: "number",
              enum: [
                1,
                2,
                3
              ],
              useExistingEnum: "ExistingEnumInArray",
              existingEnumPath: "existing/array-type.enum"
            },
            bsonType: "array"
          },
          existingEnumArrayAbs: {
            items: {
              type: "number",
              enum: [
                1,
                2,
                3
              ],
              useExistingEnum: "ExistingEnumInArrayAbs",
              existingEnumPath: "@existing/array-type-abs.enum",
              existingEnumPathRelativeToModels: false
            },
            bsonType: "array"
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
