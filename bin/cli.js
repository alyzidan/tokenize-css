#!/usr/bin/env node

import { program } from 'commander';
import StyleDictionary from 'style-dictionary';
import chalk from 'chalk';
import { createTokenStudioConfig } from '../src/config/token-studio.js';

program
  .name('tokenize-css')
  .description('Convert Design Tokens to CSS variables')
  .version('0.1.0')
  .requiredOption('-i, --input <path>', 'Input tokens file')
  .requiredOption('-o, --output <path>', 'Output directory')
  .option('-s, --source <type>', 'Source type (token-studio, figma-variables)', 'token-studio')
  .action(async (options) => {
    console.log(chalk.blue.bold('\n🎨 tokenize-css\n'));
    console.log(chalk.gray(`Source: ${options.source}`));
    console.log(chalk.gray(`Input: ${options.input}`));
    console.log(chalk.gray(`Output: ${options.output}\n`));

    let config;

    if (options.source === 'token-studio') {
      config = createTokenStudioConfig(options.input, options.output);
    } else {
      console.error(chalk.red(`❌ Source "${options.source}" not supported yet`));
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
  });

program.parse();
