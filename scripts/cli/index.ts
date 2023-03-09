import { terminal } from 'terminal-kit';
import { paramCase } from '../../src/utils/string';
import { FolderAlreadyCreatedException } from '../../src/utils/dir/exceptions';
import { createFolder } from '../../src/utils/dir';
import { renderTemplate } from '../../src/utils/cli';
import * as path from 'path';
import { TEMPLATE_API, TEMPLATE_CONFIG_APP } from './etc/const';

function getArgs() {
  const ARGS = process.argv.slice(2).shift();
  return ARGS;
}

function getRootPath() {
  return path.join(__dirname, '../../');
}

async function createApp() {
  terminal('Name:');

  let name = await terminal.inputField({}).promise;

  terminal.nextLine(1);

  if (!name) {
    throw new Error('Name is required');
  }

  name = paramCase(name);

  try {
    const pathRoot = getRootPath();
    const dirApp = `${pathRoot}/src/apps/${name}`;

    createFolder(dirApp);
    await createTemplateApi(name, dirApp);
  } catch (err) {
    if (err instanceof FolderAlreadyCreatedException) {
      throw new Error('This app already been created');
    }
    throw err;
  }

  terminal.green(`The app ${name} was create 👏👏👏`);
}

async function createTemplateApi(appName: string, dirApp: string) {
  const pathRoot = getRootPath();

  await renderTemplate(
    `${pathRoot}/${TEMPLATE_API}`,
    { name: appName },
    dirApp,
    'index.js',
  );

  await renderTemplate(
    `${pathRoot}/${TEMPLATE_CONFIG_APP}`,
    { name: appName, type: 'api', handle: 'index.handle' },
    dirApp,
    'application.json',
  );
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
