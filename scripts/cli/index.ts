import { terminal } from 'terminal-kit';
import { paramCase } from '../../src/utils/string';
import { FolderAlreadyCreatedException } from '../../src/utils/dir/exceptions';
import { createFolder } from '../../src/utils/dir';
import * as path from 'path';

function getArgs() {
  const ARGS = process.argv.slice(2).shift();
  return ARGS;
}

async function createApp() {
  console.log('Creating app');
  terminal('Name:');
  let name = await terminal.inputField({}).promise;

  terminal.nextLine(1);

  if (!name) {
    throw new Error('Name is required');
  }

  name = paramCase(name);

  try {
    const pathRoot = path.join(__dirname, '../../');
    const dirApp = `${pathRoot}/src/apps/${name}`;

    createFolder(dirApp);
  } catch (err) {
    if (err instanceof FolderAlreadyCreatedException) {
      throw new Error('This app already been created');
    }
    throw err;
  }

  terminal.green(`The app ${name} was create 👏👏👏`);
}

async function main() {
  const ARGS = getArgs();

  switch (ARGS) {
    case 'create:app':
      return createApp();

    default:
      throw new Error('Missing or invalid argument');
  }
}

main()
  .then(() => terminal.processExit(0))
  .catch((err) => {
    terminal.error(err.stack);
    terminal.processExit(1);
  });
