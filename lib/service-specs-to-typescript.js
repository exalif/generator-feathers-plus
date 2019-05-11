const { upperFirst, isEqual } = require('lodash');

const EOL = '\n';
const enumSuffix = 'Enum';

module.exports = function serviceSpecsToTypescript(specsService, feathersSpec, feathersExtension, generateTypeScriptEnums, reuseIdenticalEnums, typescriptGlobalEnumsArr, depth = 1, propertyPath = [], typescriptEnums = [], typescriptEnumsImports = new Set()) {
  const properties = feathersSpec.properties || {};
  const serviceName = feathersSpec.title || '';
  const typescriptTypes = [];
  const typescriptExtends = [];

  const { idName, idType } = feathersExtension.primaryKey;

  const schemaTypesToTypeScript = {
    ID: idType,
    integer: 'number',
  };
  const primitiveArrayTypes = ['string', 'number', 'boolean'];

  if (depth === 1) {
    propertyPath.unshift(serviceName);
  }

  Object.keys(properties).forEach(name => {
    const property = properties[name];
    if (name !== idName && (name === 'id' || name === '_id')) return;

    let subTypes, subTypesStr, arrayElementType, itemsType;
    switch (property.type) {
      case 'array':
        itemsType = property.items.type || undefined ;
        arrayElementType = 'any';

        if (primitiveArrayTypes.includes(itemsType)) {
          if (isValidEnumSchema(property.items)) {
            const enumName = extractEnumsTypes(name, property.items.enum, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums, property.items.enumKeys || []);

            typescriptEnumsImports.add(enumName);
            arrayElementType = enumName;
          } else {
            arrayElementType = itemsType;
          }
        } else if ((itemsType === 'ID' || itemsType === idName) && primitiveArrayTypes.includes(idType)) {
          arrayElementType = idType;
        }

        typescriptTypes.push(`${name}: ${arrayElementType}[]`);
        break;
      case 'object':
        propertyPath.unshift(name);
        subTypes = serviceSpecsToTypescript(specsService, property, feathersExtension, generateTypeScriptEnums, reuseIdenticalEnums, typescriptGlobalEnumsArr, ++depth, propertyPath, typescriptEnums, typescriptEnumsImports);

        subTypesStr = subTypes.typescriptTypes.map(str => `  ${str}`).join(`;${EOL}`);
        typescriptTypes.push(`${name}: {${EOL}${subTypesStr}${EOL}}`);
        break;
      default:
        if (property.type !== 'ID') {
          if (isValidEnumSchema(property)) {
            const enumName = extractEnumsTypes(name, property.enum, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums, property.enumKeys || []);

            typescriptEnumsImports.add(enumName);
            typescriptTypes.push(`${name}: ${generateTypeScriptEnums ? enumName : property.type}`);
          } else {
            typescriptTypes.push(`${name}: ${schemaTypesToTypeScript[property.type] || property.type}`);
          }
        } else {
          typescriptTypes.push(`${name}: unknown`);
          typescriptExtends.push(`${name}: any`);
        }
        break;
    }
  });

  return { typescriptTypes, typescriptExtends, typescriptEnums, typescriptEnumsImports };
};

function extractEnumsTypes(name, propertyEnums, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums, numberEnumKeys = []) {
  let enumName = `${upperFirst(name)}${enumSuffix}`;
  let enumValues = propertyEnums;

  let identicalEnumsInGlobalArrayByValues = typescriptGlobalEnumsArr.filter(enumItem => isIdenticalEnum(enumItem, enumValues, numberEnumKeys));

  if (reuseIdenticalEnums && !!identicalEnumsInGlobalArrayByValues.length) {
    enumName = identicalEnumsInGlobalArrayByValues[0].name;
  }

  let identicalEnumsInGlobalArray = typescriptGlobalEnumsArr.filter((enumItem => enumItem.name === enumName));

  if (!identicalEnumsInGlobalArray.length) {
    let identicalNewEnumsInArrayByValues = typescriptEnums.filter(enumItem => isIdenticalEnum(enumItem, enumValues, numberEnumKeys));

    if (reuseIdenticalEnums && !!identicalNewEnumsInArrayByValues.length) {
      enumName = identicalNewEnumsInArrayByValues[0].name
    }

    let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === enumName));

    if (!identicalNewEnumsInArray.length) {
      typescriptEnums.push({
        name: enumName,
        values: [...enumValues],
        keys: [...numberEnumKeys]
      });
    } else {
      enumName = handleExistingEnumInArray(identicalNewEnumsInArray, enumName, enumValues, propertyPath, typescriptEnums);
    }
  } else {
    enumName = handleExistingEnumInArray(identicalEnumsInGlobalArray, enumName, enumValues, propertyPath, typescriptEnums);
  }

  return enumName;
}

function handleExistingEnumInArray(identicalArray, enumName, enumValues, propertyPath, typescriptEnums, numberEnumKeys = []) {
  identicalArray.forEach(enumItem => {
    if (isDifferentEnum(enumItem, enumValues, numberEnumKeys)) {
      let tryName = enumName;
      let breakLoop = false;

      for (i = 0; i < propertyPath.length; i++) {
        if (!breakLoop) {
          tryName = `${upperFirst(propertyPath[i])}${tryName}`;
          let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === tryName));

          if (!identicalNewEnumsInArray.length) {
            typescriptEnums.push({
              name: tryName,
              values: [...enumValues],
              keys: [...numberEnumKeys]
            });

            enumName = tryName;
            breakLoop = true;
          } else {
            identicalNewEnumsInArray.forEach(enumItem => {
              if (isIdenticalEnum(enumItem, enumValues, numberEnumKeys)) {
                enumName = enumItem.name;
                breakLoop = true;
              }
            });
          }
        }
      }
    }
  });

  return enumName;
}

function isValidEnumSchema(propertyItem) {
  return !!propertyItem.enum
    && !!propertyItem.enum.length
    && (isValidNumberEnum(propertyItem) || isValidStringEnum(propertyItem));
}

function isValidStringEnum(propertyItem) {
  return propertyItem.type === 'string';
}

function isValidNumberEnum(propertyItem) {
  return propertyItem.type === 'number'
    && !!propertyItem.enumKeys
    && propertyItem.enumKeys.length === propertyItem.enum.length;
}

function isIdenticalEnum(enumItem, enumValues, numberEnumKeys) {
  return !!numberEnumKeys.length
  ? isEqual(enumItem.values, enumValues) && isEqual(enumItem.keys, numberEnumKeys)
  : isEqual(enumItem.values, enumValues);
}

function isDifferentEnum(enumItem, enumValues, numberEnumKeys) {
  return !!numberEnumKeys.length
    ? !isEqual(enumItem.values, enumValues) && !isEqual(enumItem.keys, numberEnumKeys)
    : !isEqual(enumItem.values, enumValues);
}
