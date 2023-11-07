#!/bin/bash

# Test script for bvm-switch

function setup {
  mkdir -p "../versions/test-version"
}

function cleanup {
  rm -rf "../versions/test-version"
  rm -f "../current"
}

echo "Testing bvm-switch script..."

# Setup a test version
setup

# Test switching to a valid version
../bin/bvm-switch "test-version" > /dev/null
if [ "$(readlink ../current)" == "../versions/test-version" ]; then
  echo "PASS: bvm-switch can switch to a valid version."
else
  echo "FAIL: bvm-switch cannot switch to a valid version."
  cleanup
  exit 1
fi

# Test switching to a non-existent version
../bin/bvm-switch "non-existent-version" &> /dev/null
if [ "$(readlink ../current)" != "../versions/non-existent-version" ]; then
  echo "PASS: bvm-switch does not switch to a non-existent version."
else
  echo "FAIL: bvm-switch switches to a non-existent version."
  cleanup
  exit 1
fi

# Test switching to the same version (should be idempotent)
../bin/bvm-switch "test-version" > /dev/null
if [ "$(readlink ../current)" == "../versions/test-version" ]; then
  echo "PASS: bvm-switch handles switching to the same version gracefully."
else
  echo "FAIL: bvm-switch fails when switching to the same version."
  cleanup
  exit 1
fi

# Test switching with a broken symlink
ln -sfn "../versions/non-existent" "../current"
../bin/bvm-switch "test-version" &> /dev/null
if [ "$(readlink ../current)" == "../versions/test-version" ]; then
  echo "PASS: bvm-switch can handle broken symlinks."
else
  echo "FAIL: bvm-switch cannot handle broken symlinks."
fi
rm -f "../current"

# Cleanup test environment
cleanup
echo "All tests for bvm-switch passed."

# ... Additional tests for insufficient permissions, missing directories, etc.
