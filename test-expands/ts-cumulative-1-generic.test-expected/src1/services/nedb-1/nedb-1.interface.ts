
// Define TypeScript interface for service `nedb1`. (Can be re-generated.)
// Import required enums
import { ItemTypeEnum, RelatedItemItemTypeEnum, ItemSizeEnum, AdditionalSizesEnum } from '../../models/enums';

import { ExistingEnum } from '../../models/existing/type.enum';

import { ExistingEnumWithAbs } from '@someAlias/existing.enum';

import { ExistingEnumInArray } from '../../models/existing/array-type.enum';

import { ExistingEnumInArrayAbs } from '@existing/array-type-abs.enum';

// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface Nedb1Base {
  // !<DEFAULT> code: interface
  _id: unknown;
  nedb2Id: unknown;
  itemType: ItemTypeEnum;
  relatedItem: {
  itemType: RelatedItemItemTypeEnum;
  additionalTypes: ItemTypeEnum[];
  itemSizeWithoutKeys: number;
  itemSize: ItemSizeEnum;
  additionalSizes: AdditionalSizesEnum[];
  additionalSizesWithoutKeys: number[];
  existingTypeWithRelativePath: ExistingEnum;
  existingTypeWithAbsolutePath: ExistingEnumWithAbs;
  existingEnumArray: ExistingEnumInArray[];
  existingEnumArrayAbs: ExistingEnumInArrayAbs[]
};
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface Nedb1 extends Nedb1Base {
  // !<DEFAULT> code: more
  _id: any; // change if needed
  nedb2Id: any; // change if needed
  // !end
}

// !code: funcs // !end
// !code: end // !end
