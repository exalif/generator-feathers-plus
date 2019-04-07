const { capitalize, isEqual } = require('lodash');

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
            let enumName = `${capitalize(name)}${enumSuffix}`; // PropertyAttributeEnum
            let enumValues = property.enum;
            let identicalEnumsInGlobalArray = typescriptGlobalEnumsArr.filter((enumItem => enumItem.name === enumName));
            console.error('identical in global array: ', identicalEnumsInGlobalArray, 'compared to: ', { name: enumName, values: enumValues })

            if (identicalEnumsInGlobalArray.length === 0) {
              console.error('pushed no identical', enumName);
              typescriptEnums.push({
                name: enumName,
                values: [...enumValues]
              });
            } else {
              identicalEnumsInGlobalArray.forEach(enumItem => {
                console.error('checking', enumItem, 'compared to: ', { name: enumName, values: enumValues });
                if (!isEqual(enumItem.values, enumValues)) {
                  console.error('values different!');
                  let tryName = enumName;
                  let identicalWithSameValueFound = false;

                  for (i = 0; i < propertyPath.length; i++) {
                    tryName = `${propertyPath[i]}${tryName}`;
                    let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === tryName));

                    if (identicalNewEnumsInArray.length === 0) {
                      console.error('pushed after identical check', tryName);
                      typescriptEnums.push({
                        name: tryName,
                        values: [...enumValues]
                      });
                      enumName = tryName;
                    } else {
                      identicalNewEnumsInArray.forEach(enumItem => {
                        if (isEqual(enumItem.values, enumValues)) {
                          console.error('identical with same value found');
                          identicalWithSameValueFound = true;
                        }
                      });
                    }
                  }

                  if (identicalWithSameValueFound) {
                    console.log('pushed same value', tryName);
                    enumName = tryName;
                  }
                }
              });
            }

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
