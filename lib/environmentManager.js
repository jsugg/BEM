import {
  mkdirSync,
  existsSync,
  rmdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  unlinkSync,
} from "fs";
import path from "path";
import { handleErrors } from "./errorHandler.js";
import { execSync } from "child_process";
import { getConfig, setConfig } from "./configManager.js";

const ENV_DIR = path.join(process.cwd(), ".bunenvs");
const VERSIONS_DIR = path.join(ENV_DIR, "versions");
const PLUGINS_DIR = path.join(ENV_DIR, "plugins");
const GLOBAL_VERSION_FILE = path.join(ENV_DIR, "version");

function ensureEnvDir() {
  if (!existsSync(ENV_DIR)) {
    mkdirSync(ENV_DIR);
  }
}

export function createEnvironment(name) {
  handleErrors(() => {
    ensureEnvDir();
    const envPath = path.join(ENV_DIR, name);
    if (!existsSync(envPath)) {
      mkdirSync(envPath);
      console.log(`Environment ${name} created.`);
    } else {
      throw new Error(`Environment ${name} already exists.`);
    }
  }, "Failed to create environment");
}

export function activateEnvironment(name) {
  handleErrors(() => {
    const envPath = path.join(ENV_DIR, name);
    if (existsSync(envPath)) {
      process.env.PATH = `${envPath}:${process.env.PATH}`;
      console.log(`Environment ${name} activated.`);
    } else {
      throw new Error(`Environment ${name} does not exist.`);
    }
  }, "Failed to activate environment");
}

export function deactivateEnvironment() {
  handleErrors(() => {
    if (process.env.PATH.startsWith(ENV_DIR)) {
      process.env.PATH = process.env.PATH.substring(ENV_DIR.length + 1);
      console.log("Environment deactivated.");
    } else {
      throw new Error("No environment is currently active.");
    }
  }, "Failed to deactivate environment");
}

export function deleteEnvironment(name) {
  handleErrors(() => {
    const envPath = path.join(ENV_DIR, name);
    if (existsSync(envPath)) {
      rmdirSync(envPath, { recursive: true });
      console.log(`Environment ${name} deleted.`);
    } else {
      throw new Error(`Environment ${name} does not exist.`);
    }
  }, "Failed to delete environment");
}

export function installDependency(envName, packageName) {
  handleErrors(() => {
    const envPath = path.join(ENV_DIR, envName);
    if (!existsSync(envPath)) {
      throw new Error(`Environment ${envName} does not exist.`);
    }
    const libPath = path.join(envPath, "lib");
    if (!existsSync(libPath)) {
      mkdirSync(libPath);
    }
    // Simulate dependency installation
    const packagePath = path.join(libPath, packageName);
    writeFileSync(packagePath, `Contents for ${packageName}`);
    console.log(`Package ${packageName} installed in environment ${envName}.`);
  }, "Failed to install dependency");
}

export function listDependencies(envName) {
  handleErrors(() => {
    const libPath = path.join(ENV_DIR, envName, "lib");
    if (!existsSync(libPath)) {
      throw new Error(`No dependencies found for environment ${envName}.`);
    }
    const dependencies = readdirSync(libPath);
    console.log(`Dependencies for ${envName}:\n${dependencies.join(", ")}`);
    return `${envName}: ${dependencies.join(", ")}`
  }, "Failed to list dependencies");
}

export function getDependencies(envName) {
  handleErrors(() => {
    const libPath = path.join(ENV_DIR, envName, "lib");
    if (!existsSync(libPath)) {
      throw new Error(`No dependencies found for environment ${envName}.`);
    }
    const dependencies = readdirSync(libPath);
    console.log(`Dependencies for ${envName}:\n${dependencies.join(", ")}`);
    return `${envName}: ${dependencies.join(", ")}`
  }, false);
}

export function switchVersion(version) {
  handleErrors(() => {
    const versionPath = path.join(VERSIONS_DIR, version);
    if (!existsSync(versionPath)) {
      throw new Error(`Version ${version} is not installed.`);
    }
    writeFileSync(GLOBAL_VERSION_FILE, version);
    console.log(`Switched to Bun version ${version} globally.`);
  }, "Failed to switch version");
}

export function loadPlugin(action, pluginName) {
  handleErrors(() => {
    const pluginPath = path.join(PLUGINS_DIR, pluginName);
    switch (action) {
      case "install":
        // Logic to install plugin
        break;
      case "remove":
        if (existsSync(pluginPath)) {
          rmdirSync(pluginPath, { recursive: true });
          console.log(`Plugin ${pluginName} removed.`);
        } else {
          throw new Error(`Plugin ${pluginName} does not exist.`);
        }
        break;
      // Add more cases for other plugin actions
      default:
        throw new Error("Invalid plugin action.");
    }
  }, "Failed to manage plugin");
}

export function selfUpdate() {
  handleErrors(() => {
    // Assuming the latest version info is available at a specific URL
    const latestReleaseUrl =
      "https://api.github.com/repos/jsugg/bem/releases/latest";
    const response = fetch(latestReleaseUrl).then((res) => res.json());

    const latestVersion = response.tag_name;
    const asset = response.assets.find((asset) => asset.name === "bem.zip");

    if (!asset) {
      throw new Error("No assets found for the latest release.");
    }

    // Download the latest version
    const downloadLink = asset.browser_download_url;
    const downloadResponse = fetch(downloadLink);
    const buffer = downloadResponse.arrayBuffer();

    // Replace the current executable with the new one
    const fs = require("fs");
    const os = require("os");
    const path = require("path");
    const { execSync } = require("child_process");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bun-env-update-"));
    const zipPath = path.join(tempDir, "bem.zip");
    fs.writeFileSync(zipPath, Buffer.from(buffer));

    // Assuming the zip contains the bun-env executable at the root
    const unzipPath = path.join(tempDir, "bun-env");
    execSync(`unzip -o ${zipPath} -d ${unzipPath}`);
 
    // Replace the old executable with the new one
    const currentExecutablePath = process.argv[1];
    fs.copyFileSync(path.join(unzipPath, "bun-env"), currentExecutablePath);

    console.log(`Updated to Bun environment manager version ${latestVersion}.`);
  }, "Failed to update");
}
