import { TablesDB } from "appwrite";
import { Client } from "appwrite";

try {
  console.log("TablesDB exists:", !!TablesDB);
  if (TablesDB) {
    const client = new Client();
    const tables = new TablesDB(client);
    console.log(
      "Methods:",
      Object.getOwnPropertyNames(Object.getPrototypeOf(tables))
    );
  }
} catch (e) {
  console.error("Error:", e.message);
}
