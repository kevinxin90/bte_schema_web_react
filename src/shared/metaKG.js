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
