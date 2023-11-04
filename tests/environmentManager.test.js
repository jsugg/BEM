import { createEnvironment, deleteEnvironment, installDependency, getDependencies } from '../lib/environmentManager.js';
import { expect, test, describe, afterEach } from "bun:test";

import { existsSync } from 'fs';
import path from 'path';

const ENV_DIR = path.join(process.cwd(), '.bunenvs');
const testEnvName = 'test-env';

describe('Environment Manager', () => {
  afterEach(() => {
    deleteEnvironment(testEnvName);
  });

  test('should create a new environment', () => {
    createEnvironment(testEnvName);
    const envPath = path.join(ENV_DIR, testEnvName);
    expect(existsSync(envPath)).toBeTruthy();
  });

  test('should delete an environment', () => {
    createEnvironment(testEnvName);
    deleteEnvironment(testEnvName);
    const envPath = path.join(ENV_DIR, testEnvName);
    expect(existsSync(envPath)).toBeFalsy();
  });

  // Dependency management tests
  test('should install a dependency', () => {
    createEnvironment(testEnvName);
    installDependency(testEnvName, 'preact');
    const packagePath = path.join(ENV_DIR, testEnvName, 'lib', 'preact');
    expect(existsSync(packagePath)).toBeTruthy();
  });

  // test('should list installed dependencies', () => {
  //   createEnvironment(testEnvName);
  //   installDependency(testEnvName, 'preact');
  //   const dependencies = getDependencies(testEnvName);
  //   expect(dependencies).toEqual(expect.stringContaining('preact'));
  // });

  // Additional tests tbd...
});

