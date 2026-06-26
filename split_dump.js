const fs = require('fs');

const dumpContent = fs.readFileSync('db_dump.sql', 'utf8');

const schemaLines = [];
const seedLines = [];

let inCreateTable = false;
let currentTableName = '';

const lines = dumpContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('CREATE TABLE')) {
    // Extract table name
    const match = line.match(/CREATE TABLE `?([^ `(]+)`?/);
    if (match) {
      currentTableName = match[1];
    }
    
    // Ignore internal D1/sqlite tables
    if (!currentTableName.startsWith('d1_') && !currentTableName.startsWith('sqlite_') && currentTableName !== '_cf_METADATA') {
      schemaLines.push(line.replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS'));
      inCreateTable = true;
    }
  } else if (inCreateTable) {
    schemaLines.push(line);
    if (line.trim() === ');') {
      inCreateTable = false;
    }
  } else if (line.startsWith('INSERT INTO')) {
    // Extract table name
    const match = line.match(/INSERT INTO "?`?([^ "`]+)"?`?/);
    if (match) {
      const tableName = match[1];
      if (!tableName.startsWith('d1_') && !tableName.startsWith('sqlite_') && tableName !== '_cf_METADATA') {
        seedLines.push(line);
      }
    }
  }
}

fs.writeFileSync('final_schema.sql', schemaLines.join('\n'));
fs.writeFileSync('final_seed.sql', seedLines.join('\n'));

console.log('Successfully created final_schema.sql and final_seed.sql');
