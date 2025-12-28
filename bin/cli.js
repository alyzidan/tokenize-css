#!/usr/bin/env node

import { program } from 'commander';
import StyleDictionary from 'style-dictionary';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { resolve } from 'path';
import { createTokenStudioConfig } from '../src/config/token-studio.js';

async function build(input, output, source = 'token-studio') {
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
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    return false;
  }
}

program
  .name('tokenize')
  .description('Convert Design Tokens to CSS variables')
  .version('0.2.0');

program
  .argument('<input>', 'Input tokens file')
  .argument('<output>', 'Output directory')
  .option('-s, --source <type>', 'Source type (token-studio, figma-variables)', 'token-studio')
  .option('-w, --watch', 'Watch for changes and rebuild automatically')
  .action(async (input, output, options) => {
    const inputPath = resolve(process.cwd(), input);
    const outputPath = resolve(process.cwd(), output);

    console.log(chalk.blue.bold('\n🎨 tokenize-css\n'));
    console.log(chalk.gray(`Source: ${options.source}`));
    console.log(chalk.gray(`Input: ${inputPath}`));
    console.log(chalk.gray(`Output: ${outputPath}`));
    
    if (options.watch) {
      console.log(chalk.yellow(`\n👀 Watching for changes...\n`));
    } else {
      console.log('');
    }

    // Initial build
    const success = await build(inputPath, outputPath, options.source);
    
    if (success) {
      console.log(chalk.green('\n✅ Build complete!\n'));
    }

    // Watch mode
    if (options.watch) {
      const watcher = chokidar.watch(inputPath, { persistent: true });

      watcher.on('change', async () => {
        console.log(chalk.yellow(`\n🔄 File changed, rebuilding...\n`));
        const success = await build(inputPath, outputPath, options.source);
        if (success) {
          console.log(chalk.green('✅ Build complete!\n'));
        }
      });

      process.on('SIGINT', () => {
        console.log(chalk.gray('\n\n👋 Stopping watch mode...\n'));
        watcher.close();
        process.exit(0);
      });
    }
  });

program.parse();
