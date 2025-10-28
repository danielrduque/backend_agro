const fs = require('fs');
const path = require('path');

function findDtoFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(findDtoFiles(full));
    } else {
      if (full.endsWith('.ts') && full.includes(path.sep + 'dto' + path.sep)) {
        results.push(full);
      }
    }
  });
  return results;
}

function addApiPropertyToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("@ApiProperty") && content.includes("@nestjs/swagger")) {
    console.log('Skipping (already has ApiProperty):', filePath);
    return;
  }

  const lines = content.split(/\r?\n/);

  // Insert import for ApiProperty after the last import
  let importInserted = false;
  if (!content.includes("@nestjs/swagger")) {
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*import\s.+from\s.+;/.test(lines[i])) lastImportIdx = i;
    }
    const insertLine = "import { ApiProperty } from '@nestjs/swagger';";
    lines.splice(lastImportIdx + 1, 0, insertLine);
    importInserted = true;
  }

  // For each property line, insert @ApiProperty() before first decorator or property
  const propRegex = /^\s*([a-zA-Z0-9_]+)\??:\s*[^;]+;/;
  for (let i = 0; i < lines.length; i++) {
    if (propRegex.test(lines[i])) {
      // find start of decorators block (consecutive lines above starting with @)
      let j = i - 1;
      while (j >= 0 && lines[j].trim() === '') j--;
      let insertAt = j + 1;
      // if there are decorator lines, move insertAt to before them
      while (insertAt - 1 >= 0 && lines[insertAt - 1].trim().startsWith('@')) {
        insertAt--;
      }

      // check if there's already ApiProperty nearby
      const nearby = lines.slice(Math.max(0, insertAt - 2), i + 1).join('\n');
      if (nearby.includes('@ApiProperty')) continue;

      const indentMatch = lines[i].match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const optional = lines[i].includes('?');
      const apiLine = `${indent}@ApiProperty({ required: ${optional ? 'false' : 'true'} })`;
      lines.splice(insertAt, 0, apiLine);
      i++; // skip the inserted line
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log('Updated:', filePath, importInserted ? '(import added)' : '');
}

function main() {
  const root = path.resolve(__dirname, '..');
  const dtoFiles = findDtoFiles(root + path.sep + 'src');
  console.log('Found DTO files:', dtoFiles.length);
  dtoFiles.forEach(addApiPropertyToFile);
}

main();

// Exit
process.exit(0);
