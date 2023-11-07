# Test setting invalid configuration value
../bin/bvm-config "default_version" "invalid-version" &> /dev/null
if grep -q '"default_version": "invalid-version"' "../config.json"; then
  echo "FAIL: bvm-config allows setting invalid version."
else
  echo "PASS: bvm-config does not allow setting invalid version."
fi

# ... Additional tests for permission errors, corrupted config, concurrent access, etc.
