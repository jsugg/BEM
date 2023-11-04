# BEM: Bun Environment Manager

A powerful tool to manage Bun JavaScript runtime environments, similar to `pyenv` for Python or `rbenv` for Ruby. It allows you to install multiple versions of Bun, manage virtual environments, and switch between them seamlessly.

BEM is currently in early development stage. See [Contributing](#contributing) for more details.

## Features

- Create, activate, deactivate, and delete Bun environments.
- Install and manage Bun packages within environments.
- Switch between different Bun versions globally or per project.
- [To-do] Plugin system to extend functionality.
- Self-update mechanism to upgrade the environment manager.
- Shell integration for automatic version switching.
- Configuration management for environment-specific settings.

## Installation

```bash
bun install -g bun-bem

```

## Usage

### Create a new environment
`bun-env create my-env [version]`

### Activate an environment
`bun-env activate my-env`

### Deactivate the current environment
`bun-env deactivate`

### Delete an environment
`bun-env delete my-env`

### Install a package in the specified environment
`bun-env install my-env package-name`

### List all packages in the specified environment
`bun-env list my-env`

### Switch to a specific Bun version globally
`bun-env use version-number`

### Manage plugins
`bun-env plugin [install|remove] plugin-name`

### Update the Bun environment manager to the latest version
`bun-env self-update`

### Set or get configuration for an environment
`bun-env config my-env key [value]`

## Contributing
Thank you for considering contributing to this project! Contributions are welcome in the form of bug reports, feature requests, or pull requests.

To contribute, please follow these steps:

1. Fork the repository and clone it locally.
2. Create a new branch for your changes.
3. Make your changes and test them thoroughly.
4. Commit your changes and push them to your forked repository.
5. Open a pull request and provide a detailed description of your changes.

Please note that all contributions are subject to review and may require some adjustments before they are merged.

If you have any questions or need further assistance, please feel free to reach out to us.

Happy contributing!
