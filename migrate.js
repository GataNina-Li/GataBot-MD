import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {Low, JSONFile} from 'lowdb'
import Datastore from '@seald-io/nedb';
import PQueue from 'p-queue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CARPETA DONDE ESTÁN LOS DATOS ANTIGUOS (LOWDB)
const lowdbBase = path.join(__dirname, 'databaseAnter');

// CATEGORÍAS A MIGRAR
const lowdbCategories = {
  users: path.join(lowdbBase, 'users'),
  chats: path.join(lowdbBase, 'chats'),
  settings: path.join(lowdbBase, 'settings'),
};

const nedbBase = path.join(__dirname, 'database');
if (!fs.existsSync(nedbBase)) fs.mkdirSync(nedbBase);

// DEFINIMOS UNA COLECCIÓN POR CATEGORÍA
const collections = {
  users: new Datastore({ filename: path.join(nedbBase, 'users.db'), autoload: true }),
  chats: new Datastore({ filename: path.join(nedbBase, 'chats.db'), autoload: true }),
  settings: new Datastore({ filename: path.join(nedbBase, 'settings.db'), autoload: true }),
};

// Object.values(collections).forEach(db =>
//   db.persistence.setAutocompactionInterval(60000)
// );

const queue = new PQueue({ concurrency: 500 });
const sanitizeId = id => id.replace(/\./g, '_');
const unsanitizeId = id => id.replace(/_/g, '.');

// Sanitizar objetos (para claves anidadas)
const sanitizeObject = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[sanitizeId(key)] =
      typeof value === 'object' && value !== null ? sanitizeObject(value) : value;
  }
  return sanitized;
};

const unsanitizeObject = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const unsanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    unsanitized[unsanitizeId(key)] =
      typeof value === 'object' && value !== null ? unsanitizeObject(value) : value;
  }
  return unsanitized;
};

// --------------------------------
// FUNCIONES PARA LEER DE LOWDB
// --------------------------------
function getLowDBFilePath(category, id) {
  return path.join(lowdbCategories[category], `${id}.json`);
}

async function readLowDBFile(category, id) {
  const filePath = getLowDBFilePath(category, id);
  const adapter = new JSONFile(filePath);
  const db = new Low(adapter);
  await db.read();
  db.data = db.data || {};
  return db.data;
}

// --------------------------------
// FUNCIONES PARA ESCRIBIR EN NEDB
// --------------------------------
async function writeToNeDB(category, id, data) {
  const sanitizedId = sanitizeId(id);
  const sanitizedData = sanitizeObject(data);
  return new Promise((resolve, reject) => {
    collections[category].update(
      { _id: sanitizedId },
      { _id: sanitizedId, data: sanitizedData },
      { upsert: true, multi: false },
      (err) => {
        if (err) {
          console.error(`Error escribiendo ${category}/${id}:`, err);
          return reject(err);
        }
        // IMPORTANTE: NO compactamos aquí para no ralentizar.
        resolve();
      }
    );
  });
}

// --------------------------------
// SCRIPT DE MIGRACIÓN
// --------------------------------
async function migrate() {
  const categories = Object.keys(lowdbCategories); // ['users', 'chats', 'settings']
  let totalMigrated = 0;

  for (const category of categories) {
    if (!fs.existsSync(lowdbCategories[category])) {
      console.warn(`La carpeta ${lowdbCategories[category]} no existe. Se omite ${category}.`);
      continue;
    }
    const files = fs.readdirSync(lowdbCategories[category]);

    for (const file of files) {
      const id = path.basename(file, '.json');
      if (category === 'users' && (id.includes('@newsletter') || id.includes('lid'))) continue;
      if (category === 'chats' && id.includes('@newsletter')) continue;

      try {
        const data = await queue.add(() => readLowDBFile(category, id));
        await queue.add(() => writeToNeDB(category, id, data));
        console.log(`Migrado: ${category}/${id}`);
        totalMigrated++;
      } catch (err) {
        console.error(`Error migrando ${category}/${id}:`, err);
      }
    }
  }

  for (const category of categories) {
    if (collections[category]) {
      await new Promise((resolve, reject) => {
        collections[category].persistence.compactDatafile();
        setTimeout(resolve, 500);
      });
    }
  }

  console.log(`Migración completada. Total migrados: ${totalMigrated}`);
  process.exit(0);
}

// EJECUTAR LA MIGRACIÓN
migrate().catch(err => {
  console.error('Error durante la migración:', err);
  process.exit(1);
});
