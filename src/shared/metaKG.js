//lazy loads meta kg package (for better initial loading)
import MetaKG from "@biothings-explorer/smartapi-kg";
import _ from 'lodash';

const meta_kg = new MetaKG();
let constructed = false;

//gets meta kg object
export default function getMetaKG() {
  if (!constructed) {
    meta_kg.constructMetaKGSync();
    constructed = true;
  }
  return meta_kg;
}

let categories;
//get array of all possible categories (input/output types)
export function getCategories() {
  if (categories == null) {
    categories = new Set();
    getMetaKG().ops.forEach((op) => {
      categories.add(op.association.input_type);
      categories.add(op.association.output_type);
    });
  }

  categories = Array.from(categories);
  categories.sort();

  return categories;
}

//get array of all possible predicates
export function getPredicates(input_type, output_type, values_to_include=[]) {
  let predicates = new Set();
  values_to_include.forEach((value) => predicates.add(value));

  getMetaKG().filter(_.pickBy({ input_type: input_type, output_type: output_type }, _.size)).forEach((op) => {
    predicates.add(op.association.predicate);
  });

  predicates = Array.from(predicates);
  predicates.sort();

  return predicates;
}
