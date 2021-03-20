//lazy loads meta kg package (for better initial loading)
import MetaKG from "@biothings-explorer/smartapi-kg";

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

  return categories;
}
