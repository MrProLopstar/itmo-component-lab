import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ISU = '563858';

async function walk(dir) {
  let files = 0;
  let dirs = 0;
  let size = 0;

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      dirs += 1;
      const sub = await walk(full);
      files += sub.files;
      dirs += sub.dirs;
      size += sub.size;
    } else if (entry.isFile()) {
      files += 1;
      size += (await stat(full)).size;
    }
  }

  return { files, dirs, size };
}

const { files, dirs, size } = await walk(process.env.DATA_DIR ?? '/data');
process.stdout.write(`${ISU}-${files}-${dirs}-${size}\n`);
