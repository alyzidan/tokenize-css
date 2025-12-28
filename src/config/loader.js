import { existsSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { defaultConfig } from './defaults.js';

const CONFIG_FILES = [
  'tokenize.config.js',
  'tokenize.config.mjs'
];

export async function loadConfig(customPath) {
  const cwd = process.cwd();
  
  // Custom path provided
  if (customPath) {
    const fullPath = resolve(cwd, customPath);
    if (!existsSync(fullPath)) {
      throw new Error(`Config file not found: ${customPath}`);
    }
    const userConfig = await import(pathToFileURL(fullPath));
    return { ...defaultConfig, ...userConfig.default };
  }

  // Search for config file
  for (const fileName of CONFIG_FILES) {
    const fullPath = resolve(cwd, fileName);
    if (existsSync(fullPath)) {
      const userConfig = await import(pathToFileURL(fullPath));
      return { ...defaultConfig, ...userConfig.default, configPath: fullPath };
    }
  }

  return null;
}
