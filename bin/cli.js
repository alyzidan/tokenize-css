#!/usr/bin/env node

import { program } from 'commander';
import StyleDictionary from 'style-dictionary';
import chalk from 'chalk';
import { resolve } from 'path';
import { createTokenStudioConfig } from '../src/config/token-studio.js';

async function build(input, output, source = 'token-studio') {
  console.log(chalk.blue.bold('\n🎨 tokenize-css\n'));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Input: ${input}`));
  console.log(chalk.gray(`Output: ${output}\n`));

  let config;

  if (source === 'token-studio') {
    config = createTokenStudioConfig(input, output);
  } else {
    console.error(chalk.red(`❌ Source "${source}" not supported yet`));
    process.exit(1);
  }

  try {
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();
    console.log(chalk.green('✅ Done!\n'));
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}

program
  .name('tokenize')
  .description('Convert Design Tokens to CSS variables')
  .version('0.1.0');

program
  .argument('<input>', 'Input tokens file')
  .argument('<output>', 'Output directory')
  .option('-s, --source <type>', 'Source type (token-studio, figma-variables)', 'token-studio')
  .action(async (input, output, options) => {
    const inputPath = resolve(process.cwd(), input);
    const outputPath = resolve(process.cwd(), output);
    await build(inputPath, outputPath, options.source);
  });

program.parse();
