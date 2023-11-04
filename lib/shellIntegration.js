import { switchVersion, ENV_DIR } from './environmentManager.js';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { setConfig, getConfig } from './configManager.js';

export function initShellIntegration() {
  handleErrors(() => {
    const shell = process.env.SHELL;

    if (!shell) {
      throw new Error('Could not detect the shell environment.');
    }

    const shellConfigFiles = {
      '/bin/bash': '.bashrc',
      '/bin/dash': '.profile',
      '/bin/zsh': '.zshrc',
      '/usr/bin/fish': 'config.fish', // Fish shell config is in a different directory
      '/bin/sh': '.profile',
      '/bin/ksh': '.kshrc',
      '/bin/tcsh': '.tcshrc',
      '/bin/csh': '.cshrc',
    };

    // Resolve the full path to the shell configuration file
    const getShellConfigPath = (shell) => {
      const configFile = shellConfigFiles[shell];
      if (configFile) {
        // Special handling for fish shell which has its config in a different directory
        if (shell === '/usr/bin/fish') {
          return path.join(process.env.HOME, '.config', 'fish', configFile);
        }
        return path.join(process.env.HOME, configFile);
      }
      return null;
    };

    const shellConfigPath = getShellConfigPath(shell);

    if (!shellConfigPath) {
      throw new Error(`Unsupported shell: ${shell}`);
    }

    const integrationScript = {
      '/usr/bin/fish': `
# Bun Environment Manager Integration
set -gx BUN_ENV_MANAGER_DIR "${ENV_DIR}"
if test -f "$BUN_ENV_MANAGER_DIR/bun-env"
  set -gx PATH "$BUN_ENV_MANAGER_DIR" $PATH
end

# Automatically switch Bun versions when moving between projects
function bunenv_auto_switch --on-variable PWD
  if test -f ".bun-version"
    set BUN_VERSION (cat .bun-version)
    bun-env use $BUN_VERSION
  end
end
`,
      'default': `
# Bun Environment Manager Integration
export BUN_ENV_MANAGER_DIR="${ENV_DIR}"
if [ -f "$BUN_ENV_MANAGER_DIR/bun-env" ]; then
  export PATH="$BUN_ENV_MANAGER_DIR:$PATH"
fi

# Automatically switch Bun versions when moving between projects
bunenv_auto_switch() {
  if [ -f ".bun-version" ]; then
    BUN_VERSION=$(cat .bun-version)
    bun-env use $BUN_VERSION
  fi
}
alias cd="cd; bunenv_auto_switch"
`
    };

    // Choose the correct script based on the shell or use the default
    const scriptToUse = integrationScript[shell] || integrationScript['default'];

    const configContent = readFileSync(shellConfigPath, 'utf8');

    if (!configContent.includes('# Bun Environment Manager Integration')) {
      writeFileSync(shellConfigPath, configContent + scriptToUse, 'utf8');
      console.log(`Bun environment manager integration added to ${shellConfigPath}.`);
    } else {
      console.log(`Bun environment manager integration already exists in ${shellConfigPath}.`);
    }
  }, 'Failed to initialize shell integration');
}


export function autoSwitchVersion() {
  const versionFilePath = path.join(process.cwd(), '.bun-version');
  if (existsSync(versionFilePath)) {
    const version = readFileSync(versionFilePath, 'utf8').trim();
    switchVersion(version);
  }
}
