
// Define the Feathers schema for service `nedb1`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Nedb1',
  description: 'Nedb1 database.',
  // !end
  // !code: schema_definitions // !end
  required: [
    // !code: schema_required // !end
  ],
  properties: {
    // !code: schema_properties
    id: { type: 'ID' },
    _id: { type: 'ID' },
    nedb2Id: { type: 'ID' },
    itemType: {
      type: 'string',
      enum: ['offer', 'bid', 'auction']
    },
    relatedItem: {
      type: 'object',
      properties: {
        itemType: {
          type: 'string',
          enum: ['HardWare', 'wood', 'toy']
        },
        additionalTypes: {
          type: 'array',
          items: {
            enum: ['offer', 'bid', 'auction']
          }
        },
        itemSizeWithoutKeys: {
          type: 'number',
          enum: [1, 2, 3]
        },
        itemSize: {
          type: 'number',
          enum: [1, 2, 3],
          enumKeys: ['small', 'medium', 'large']
        },
        additionalSizes: {
          type: 'array',
          items: {
            type: 'number',
            enum: [1, 2, 3],
            enumKeys: ['wide', 'tall', 'narrow']
          }
        },
        additionalSizesWithoutKeys: {
          type: 'array',
          items: {
            type: 'number',
            enum: [1, 2, 3]
          }
        },
        existingTypeWithRelativePath: {
          type: 'string',
          enum: ['one', 'two'],
          useExistingEnum: 'ExistingEnum',
          existingEnumPath: 'existing/type.enum',
          existingEnumPathRelativeToModels: true
        },
        existingTypeWithAbsolutePath: {
          type: 'number',
          enum: [1, 2, 3],
          useExistingEnum: 'ExistingEnumWithAbs',
          existingEnumPath: '@someAlias/existing.enum',
          existingEnumPathRelativeToModels: false
        },
        existingEnumArray: {
          type: 'array',
          items: {
            type: 'number',
            enum: [1, 2, 3],
            useExistingEnum: 'ExistingEnumInArray',
            existingEnumPath: 'existing/array-type.enum'
          }
        },
        existingEnumArrayAbs: {
          type: 'array',
          items: {
            type: 'number',
            enum: [1, 2, 3],
            useExistingEnum: 'ExistingEnumInArrayAbs',
            existingEnumPath: '@existing/array-type-abs.enum',
            existingEnumPathRelativeToModels: false
          }
        }
      }
    }
    // !end
  },
  // !code: schema_more // !end
};

let extensions = {
  graphql: {
    // !code: graphql_header
    name: 'Nedb1',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'Nedb1',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !code: graphql_add
      nedb2: { type: 'Nedb2!', args: false, relation: { ourTable: 'nedb2Id', otherTable: '_id' } },
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
