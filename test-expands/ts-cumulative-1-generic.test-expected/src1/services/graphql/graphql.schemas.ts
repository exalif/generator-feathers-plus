
// tslint:disable:no-trailing-whitespace
// Define the combined GraphQL schema. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let moduleExports = `
type Nedb1 {
  id: ID
  _id: ID
  nedb2Id: ID
  itemType: String
  relatedItem: JSON
  nedb2: Nedb2!
}
 
type Nedb2 {
  id: ID
  _id: ID
  nedb1Id: ID
  itemType: String
  nedb1: Nedb1!
}
 

type Query {
  getNedb1(key: JSON, query: JSON, params: JSON): Nedb1
  findNedb1(query: JSON, params: JSON): [Nedb1]!
  getNedb2(key: JSON, query: JSON, params: JSON): Nedb2
  findNedb2(query: JSON, params: JSON): [Nedb2]!
}
`;

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
