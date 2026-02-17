import * as fs from 'fs';
import { join } from 'path';
import { prompt } from 'inquirer';
import { upperFirst } from 'lodash';

const { log, info, warn } = console;

// DRY config settings for file handling
const encoding: BufferEncoding = 'utf-8';
const READ_WRITE_CONFIG = { encoding };

const OVERWRITE_WARNING =
  'This already exists, do you wish to continue and overwrite?';

const TEMPLATE_DIRECTORY = join(__dirname, 'templates');
const OUTPUT_DIRECTORY = join(__dirname, '..', 'src');

const whatToMakeOptions = {
  svg: 'svg',
  screen: 'screen',
  component: 'component',
  context: 'context',
};

const processName = (name: string) => {
  const trimmed = String(name).trim();
  return upperFirst(trimmed);
};

const writeSVG = async (name: string) => {
  const directory = `${OUTPUT_DIRECTORY}/components/svg`;
  const componentPath = `${directory}/Svg${name}.tsx`;

  if (fs.existsSync(componentPath)) {
    const { shouldContinue } = await prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: OVERWRITE_WARNING,
      },
    ]);

    if (!shouldContinue) {
      info(' ');
      warn('⚠️  Skipped creating component:', `"${name}"`);
      info(' ');
      return;
    }
  }

  const componentTemplate = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/svg/SVG.tsx.template`,
    READ_WRITE_CONFIG
  );
  const componentToWrite = componentTemplate.replace(/{{NAME}}/g, name);

  fs.writeFileSync(componentPath, componentToWrite, READ_WRITE_CONFIG);

  info(' ');
  log('✅ Created component:', `"${name}"`);
  info(' ');
};

const writeComponent = async (name: string) => {
  const directory = `${OUTPUT_DIRECTORY}/components`;
  const componentPath = `${directory}/${name}.tsx`;

  if (fs.existsSync(componentPath)) {
    const { shouldContinue } = await prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: OVERWRITE_WARNING,
      },
    ]);

    if (!shouldContinue) {
      info(' ');
      warn('⚠️  Skipped creating component:', `"${name}"`);
      info(' ');
      return;
    }
  }

  const componentTemplate = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/component/Component.tsx.template`,
    READ_WRITE_CONFIG
  );

  const componentToWrite = componentTemplate.replace(/{{NAME}}/g, name);

  fs.writeFileSync(componentPath, componentToWrite, READ_WRITE_CONFIG);

  info(' ');
  log('✅ Created component:', `"${name}"`);
  info(' ');
};

const writeScreen = async (name: string) => {
  const directory = `${OUTPUT_DIRECTORY}/screens/${name}`;

  try {
    fs.mkdirSync(directory);
  } catch (error) {
    const { shouldContinue } = await prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: OVERWRITE_WARNING,
      },
    ]);

    if (!shouldContinue) {
      info(' ');
      warn('⚠️  Skipped creating screen:', `"${name}"`);
      info(' ');
      return;
    }
  }

  // Load the templates
  const index = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/screen/index.ts.template`,
    READ_WRITE_CONFIG
  );
  const container = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/screen/Container.tsx.template`,
    READ_WRITE_CONFIG
  );
  const presentational = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/screen/Presentational.tsx.template`,
    READ_WRITE_CONFIG
  );

  const indexPath = `${directory}/index.ts`;
  const containerPath = `${directory}/${name}Screen.container.tsx`;
  const presentationalPath = `${directory}/${name}Screen.tsx`;

  fs.writeFileSync(
    indexPath,
    index.replace(/{{NAME}}/g, name),
    READ_WRITE_CONFIG
  );
  fs.writeFileSync(
    containerPath,
    container.replace(/{{NAME}}/g, name),
    READ_WRITE_CONFIG
  );
  fs.writeFileSync(
    presentationalPath,
    presentational.replace(/{{NAME}}/g, name),
    READ_WRITE_CONFIG
  );

  info(' ');
  log('✅ Created screen:', `"${name}"`);
  info(' ');
};

const writeContext = async (name: string) => {
  const directory = `${OUTPUT_DIRECTORY}/data/context`;
  const componentPath = `${directory}/${name.toLowerCase()}.tsx`;

  if (fs.existsSync(componentPath)) {
    const { shouldContinue } = await prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: OVERWRITE_WARNING,
      },
    ]);

    if (!shouldContinue) {
      info(' ');
      warn('⚠️  Skipped creating context:', `"${name}"`);
      info(' ');
      return;
    }
  }

  const contextTemplate = fs.readFileSync(
    `${TEMPLATE_DIRECTORY}/context/context.tsx.template`,
    READ_WRITE_CONFIG
  );

  const componentToWrite = contextTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{name}}/g, name.toLowerCase());

  fs.writeFileSync(componentPath, componentToWrite, READ_WRITE_CONFIG);

  info(' ');
  log('✅ Created context:', `"${name}"`);
  info(' ');
};

const scaffold = async () => {
  const curDir = join(__dirname, '../');
  log(' ');
  info('You are running scaffold from', curDir);
  log(' ');

  const { whatToMake } = await prompt([
    {
      type: 'list',
      name: 'whatToMake',
      message: 'What would you like to make?',
      paginated: false,
      choices: Object.keys(whatToMakeOptions),
    },
  ]);

  const { name: nameRaw } = await prompt([
    {
      type: 'input',
      name: 'name',
      message: `What should the ${whatToMake} be called?`,
    },
  ]);

  const name = processName(nameRaw);

  if (whatToMake === whatToMakeOptions.svg) {
    writeSVG(name);
  }
  if (whatToMake === whatToMakeOptions.component) {
    writeComponent(name);
  }
  if (whatToMake === whatToMakeOptions.screen) {
    writeScreen(name);
  }
  if (whatToMake === whatToMakeOptions.context) {
    writeContext(name);
  }
};

scaffold();
