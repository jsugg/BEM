import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { handleErrors } from './errorHandler.js';

const ENV_DIR = path.join(process.cwd(), '.bunenvs');

export function getConfig(envName) {
  handleErrors(() => {
    const configPath = path.join(ENV_DIR, envName, 'config.json');
    if (existsSync(configPath)) {
      const configData = readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } else {
      return {};
    }
  }, 'Failed to get configuration');
}

export function setConfig(envName, config) {
  handleErrors(() => {
    const configPath = path.join(ENV_DIR, envName, 'config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  }, 'Failed to set configuration');
}
