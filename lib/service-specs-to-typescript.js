const { upperFirst, isEqual } = require('lodash');

const EOL = '\n';
const enumSuffix = 'Enum';

module.exports = function serviceSpecsToTypescript (specsService, feathersSpec, feathersExtension, depth = 1, propertyPath = [], typescriptGlobalEnumsArr) {
  const properties = feathersSpec.properties || {};
  const serviceName = feathersSpec.title || '';
  const typescriptTypes = [];
  const typescriptExtends = [];
  const typescriptEnums = [];
  const typescriptEnumsImports = [];

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
        subTypes = serviceSpecsToTypescript(specsService, property, feathersExtension, ++depth, propertyPath.unshift(name), typescriptGlobalEnumsArr);
        subTypesStr = subTypes.typescriptTypes.map(str => `  ${str}`).join(`;${EOL}`);
        typescriptTypes.push(`${name}: {${EOL}${subTypesStr}${EOL}}`);
        break;
      default:
        if (property.type !== 'ID') {
          if (property.type === 'string' && !!property.enum && property.enum.length > 0) {
            const enumName = extractEnumsTypes(name, property, typescriptGlobalEnumsArr, typescriptEnums, propertyPath);

            typescriptEnumsImports.push(enumName);
            typescriptTypes.push(`${name}: ${enumName}`);
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
    typescriptEnums.push({
      name: enumName,
      values: [...enumValues]
    });
  } else {
    identicalEnumsInGlobalArray.forEach(enumItem => {
      if (!isEqual(enumItem.values, enumValues)) {
        let tryName = enumName;

        for (i = 0; i < propertyPath.length; i++) {
          tryName = `${upperFirst(propertyPath[i])}${tryName}`;
          let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === tryName));

          if (identicalNewEnumsInArray.length === 0) {
            typescriptEnums.push({
              name: tryName,
              values: [...enumValues]
            });

            enumName = tryName;
          } else {
            identicalNewEnumsInArray.forEach(enumItem => {
              if (isEqual(enumItem.values, enumValues)) {
                enumName = enumItem.name;
              }
            });
          }
        }
      }
    });
  }

  return enumName;
}
