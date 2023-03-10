import { terminal } from 'terminal-kit';
import { paramCase } from '../../src/utils/string';
import { FolderAlreadyCreatedException } from '../../src/utils/dir/exceptions';
import { createFolder } from '../../src/utils/dir';
import { renderTemplate } from '../../src/utils/cli';
import * as path from 'path';
import * as fsSync from 'fs/promises';
import * as fs from 'fs';
import {
  TEMPLATE_API,
  TEMPLATE_CONFIG_APP,
  TEMPLATE_SERVERLESS,
} from './etc/const';
import { ConfigApp, ServerlessConfig } from './etc/types';

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
    { name: appName, type: 'api', handler: 'index.handler' },
    dirApp,
    'application.json',
  );

  await addConfigAppOnServerless(dirApp);
}

async function mountConfigServerlessApp(pathApp: string) {
  let dataConfigApp = await fsSync.readFile(
    `${pathApp}/application.json`,
    'utf8',
  );

  if (!dataConfigApp) {
    throw new Error(`Config app not found: ${pathApp}`);
  }

  const appConfig = JSON.parse(dataConfigApp) as ConfigApp;

  const content = `
  ${appConfig.name}:
    handler: src/apps/${appConfig.name}/${appConfig.handler}
    events:
      - httpApi:
          method: "*"
          cors: true
          path: /${appConfig.name}/{proxy+}
    `;

  return content;
}

async function createBaseServerlessConfigBase() {
  const rootPath = getRootPath();

  const { CONFIG_SERVERLESS: serverlessConfig } =
    require(`${rootPath}/config/serverless.config`) as {
      CONFIG_SERVERLESS: ServerlessConfig;
    };

  await renderTemplate(
    `${rootPath}/${TEMPLATE_SERVERLESS}`,
    {
      name: serverlessConfig.name,
      frameworkVersion: serverlessConfig.frameworkVersion,
      provider: serverlessConfig.provider,
      runtime: serverlessConfig.runtime,
      region: serverlessConfig.region,
    },
    rootPath,
    'serverless.yml',
  );
}

async function addConfigAppOnServerless(pathApp: string) {
  const content = await mountConfigServerlessApp(pathApp);
  const rootPath = getRootPath();

  if (!fs.existsSync(`${rootPath}/serverless.yml`)) {
    await createBaseServerlessConfigBase();
  }

  await fsSync.appendFile(`${rootPath}/serverless.yml`, content);
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
