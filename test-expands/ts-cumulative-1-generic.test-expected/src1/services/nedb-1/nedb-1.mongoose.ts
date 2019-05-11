
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
    itemType: {
      type: String,
      enum: [
        "offer",
        "bid",
        "auction"
      ]
    },
    relatedItem: {
      itemType: {
        type: String,
        enum: [
          "HardWare",
          "wood",
          "toy"
        ]
      },
      additionalTypes: [
        {
          type: String,
          enum: [
            "offer",
            "bid",
            "auction"
          ]
        }
      ],
      itemSizeWithoutKeys: {
        type: Number,
        enum: [
          1,
          2,
          3
        ]
      },
      itemSize: {
        type: Number,
        enum: [
          1,
          2,
          3
        ]
      },
      additionalSizes: [
        {
          type: Number,
          enum: [
            1,
            2,
            3
          ]
        }
      ],
      additionalSizesWithoutKeys: [
        {
          type: Number,
          enum: [
            1,
            2,
            3
          ]
        }
      ],
      existingTypeWithRelativePath: {
        type: String,
        enum: [
          "one",
          "two"
        ]
      },
      existingTypeWithAbsolutePath: {
        type: Number,
        enum: [
          1,
          2,
          3
        ]
      },
      existingEnumArray: [
        {
          type: Number,
          enum: [
            1,
            2,
            3
          ]
        }
      ],
      existingEnumArrayAbs: [
        {
          type: Number,
          enum: [
            1,
            2,
            3
          ]
        }
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
