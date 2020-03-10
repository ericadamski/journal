import Airtable from "airtable";

// Airtable.configure({ apiKey: process.env.AIRTABLE_API });
Airtable.configure({ apiKey: "keyjQPg8aDnzROe9k" });

let _base;

function base() {
  if (!_base) {
    _base = Airtable.base("appuq0XlYQW4EzQMj");
  }

  return _base("journal");
}

function list(page) {
  return new Promise((resolve, reject) =>
    base()
      .select({
        view: "Grid view"
      })
      .eachPage(function(records) {
        resolve(records.map(record => record._rawJson));
      })
  );
}

function add({ rating, entry }) {
  return new Promise((resolve, reject) => {
    base().create(
      [
        {
          fields: {
            rating,
            entry,
            date: Date.now()
          }
        }
      ],
      (err, [record]) => {
        if (err) return reject(err);
        resolve(record._rawJson);
      }
    );
  });
}

export default { list, add };
