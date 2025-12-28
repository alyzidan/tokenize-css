#!/usr/bin/env node

import { program } from 'commander';
import StyleDictionary from 'style-dictionary';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { resolve } from 'path';
import { createTokenStudioConfig } from '../src/config/token-studio.js';
import { loadConfig } from '../src/config/loader.js';

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

async function run(inputPath, outputPath, options) {
  console.log(chalk.blue.bold('\n🎨 tokenize-css\n'));
  console.log(chalk.gray(`Source: ${options.source}`));
  console.log(chalk.gray(`Input: ${inputPath}`));
  console.log(chalk.gray(`Output: ${outputPath}`));
  
  if (options.watch) {
    console.log(chalk.yellow(`\n👀 Watching for changes...\n`));
  } else {
    console.log('');
  }

  const success = await build(inputPath, outputPath, options.source);
  
  if (success) {
    console.log(chalk.green('\n✅ Build complete!\n'));
  }

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
}

program
  .name('tokenize')
  .description('Convert Design Tokens to CSS variables')
  .version('0.2.1');

program
  .argument('[input]', 'Input tokens file')
  .argument('[output]', 'Output directory')
  .option('-c, --config <path>', 'Path to config file')
  .option('-s, --source <type>', 'Source type (token-studio, figma-variables)', 'token-studio')
  .option('-w, --watch', 'Watch for changes and rebuild automatically')
  .action(async (input, output, options) => {
    let inputPath, outputPath, source, watch;

    // Try to load config file
    const config = await loadConfig(options.config);

    if (config) {
      console.log(chalk.gray(`Using config: ${config.configPath || options.config}\n`));
      inputPath = resolve(process.cwd(), input || config.input);
      outputPath = resolve(process.cwd(), output || config.output);
      source = options.source || config.source;
      watch = options.watch || config.watch;
    } else if (input && output) {
      inputPath = resolve(process.cwd(), input);
      outputPath = resolve(process.cwd(), output);
      source = options.source;
      watch = options.watch;
    } else {
      console.error(chalk.red('❌ Error: No config file found and no input/output provided.'));
      console.log(chalk.gray('\nUsage: tokenize <input> <output>'));
      console.log(chalk.gray('   or: create tokenize.config.js\n'));
      process.exit(1);
    }

    await run(inputPath, outputPath, { source, watch });
  });

program.parse();
