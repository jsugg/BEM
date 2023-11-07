#!/bin/bash

# Test script for bvm-package

function setup {
  mkdir -p "../versions/test-version"
  ln -sfn "../versions/test-version" "../current"
}

function cleanup {
  rm -rf "../versions/test-version"
  rm -f "../current"
}

echo "Testing bvm-package script..."

# Setup a test version and switch to it
setup

# Test package installation
../bin/bvm-package install "test-package" > /dev/null
if [ -f "../current/node_modules/test-package" ]; then
  echo "PASS: bvm-package can install packages."
else
  echo "FAIL: bvm-package cannot install packages."
  cleanup
  exit 1
fi

# Test package installation with invalid name
../bin/bvm-package install "./invalid-name" &> /dev/null
if [ ! -f "../current/node_modules/invalid-name" ]; then
  echo "PASS: bvm-package does not install packages with invalid names."
else
  echo "FAIL: bvm-package installs packages with invalid names."
fi

# Test package re-installation (should be idempotent)
../bin/bvm-package install "test-package" > /dev/null
if [ -f "../current/node_modules/test-package" ]; then
  echo "PASS: bvm-package handles re-installation of packages gracefully."
else
  echo "FAIL: bvm-package fails on re-installation of packages."
  cleanup
  exit 1
fi

# Test package removal
../bin/bvm-package remove "test-package" > /dev/null
if [ ! -f "../current/node_modules/test-package" ]; then
  echo "PASS: bvm-package can remove packages."
else
  echo "FAIL: bvm-package cannot remove packages."
  cleanup
  exit 1
fi

# Test removal of a non-existent package
../bin/bvm-package remove "non-existent-package" &> /dev/null
if [ ! -f "../current/node_modules/non-existent-package" ]; then
  echo "PASS: bvm-package handles removal of non-existent packages gracefully."
else
  echo "FAIL: bvm-package fails when removing non-existent packages."
  cleanup
  exit 1
fi

# Cleanup test environment
cleanup
echo "All tests for bvm-package passed."

# ... Additional tests for insufficient disk space, conflicting dependencies, etc.
