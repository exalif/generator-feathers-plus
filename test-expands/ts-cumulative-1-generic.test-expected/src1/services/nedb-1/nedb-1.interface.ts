
// Define TypeScript interface for service `nedb1`. (Can be re-generated.)
// Import required enums
import { ItemTypeEnum, RelatedItemItemTypeEnum, ItemSizeEnum, AdditionalSizesEnum } from '../../models/enums';

import { ExistingEnum } from '../../models/existing/type.enum';

import { ExistingEnumWithAbs } from '../../models/@someAlias/existing.enum';

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
  existingTypeWithAbsolutePath: ExistingEnumWithAbs
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
