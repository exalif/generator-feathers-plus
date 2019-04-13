const { upperFirst, isEqual } = require('lodash');

const EOL = '\n';
const enumSuffix = 'Enum';

module.exports = function serviceSpecsToTypescript (specsService, feathersSpec, feathersExtension, depth = 1, propertyPath = [], typescriptGlobalEnumsArr, typescriptEnums = [], typescriptEnumsImports = [], generateTypeScriptEnums) {
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
          arrayElementType = itemsType;
        } else if ((itemsType === 'ID' || itemsType === idName) && primitiveArrayTypes.includes(idType)) {
          arrayElementType = idType;
        }

        typescriptTypes.push(`${name}: ${arrayElementType}[]`);
        break;
      case 'object':
        propertyPath.unshift(name);
        subTypes = serviceSpecsToTypescript(specsService, property, feathersExtension, ++depth, propertyPath, typescriptGlobalEnumsArr, typescriptEnums, typescriptEnumsImports, generateTypeScriptEnums);
        subTypesStr = subTypes.typescriptTypes.map(str => `  ${str}`).join(`;${EOL}`);
        typescriptTypes.push(`${name}: {${EOL}${subTypesStr}${EOL}}`);
        break;
      default:
        if (property.type !== 'ID') {
          if (property.type === 'string' && !!property.enum && property.enum.length > 0) {
            const enumName = extractEnumsTypes(name, property, typescriptGlobalEnumsArr, typescriptEnums, propertyPath);

            typescriptEnumsImports.push(enumName);
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

function extractEnumsTypes(name, property, typescriptGlobalEnumsArr, typescriptEnums, propertyPath) {
  let enumName = `${upperFirst(name)}${enumSuffix}`;
  let enumValues = property.enum;
  let identicalEnumsInGlobalArray = typescriptGlobalEnumsArr.filter((enumItem => enumItem.name === enumName));

  if (identicalEnumsInGlobalArray.length === 0) {
    console.log('found no identical in global array');
    let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === enumName));

    if (identicalNewEnumsInArray.length === 0) {
      console.log('found no identical local array', enumName, typescriptEnums);

      typescriptEnums.push({
        name: enumName,
        values: [...enumValues]
      });
    } else {
      enumName = handleExistingEnumInArray(identicalNewEnumsInArray, enumName, enumValues, propertyPath, typescriptEnums);
    }
  } else {
    enumName = handleExistingEnumInArray(identicalEnumsInGlobalArray, enumName, enumValues, propertyPath, typescriptEnums);
  }

  return enumName;
}

function handleExistingEnumInArray(identicalArray, enumName, enumValues, propertyPath, typescriptEnums) {
  identicalArray.forEach(enumItem => {
    if (!isEqual(enumItem.values, enumValues)) {
      let tryName = enumName;
      let breakLoop = false;

      for (i = 0; i < propertyPath.length; i++) {
        if (!breakLoop) {
          tryName = `${upperFirst(propertyPath[i])}${tryName}`;
          let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === tryName));

          if (identicalNewEnumsInArray.length === 0) {
            typescriptEnums.push({
              name: tryName,
              values: [...enumValues]
            });

            enumName = tryName;
            breakLoop = true;
          } else {
            identicalNewEnumsInArray.forEach(enumItem => {
              if (isEqual(enumItem.values, enumValues)) {
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
