---
name: cli-check-skill
description: Use when reviewing, testing, or verifying the functionality of a CLI program. Use ONLY when the user asks to check, test, validate, or verify a command-line interface program, its parameters, flags, arguments, or behavior. Front-load keywords: CLI, command-line, arguments, parameters, flags, options, subcommands, help, usage, error handling, validation.
---

# CLI Check Skill

This skill provides a systematic workflow for testing and verifying CLI programs.

## Workflow

### Phase 1: Program Discovery

1. Identify the CLI program to test (binary, script, or entry point).
2. Determine how to run it (e.g., `./program`, `node index.js`, `python cli.py`).
3. Run the program with `--help`, `-h`, or `help` (if applicable) to discover all available commands, flags, and options.
4. If no help is available, inspect the source code or README to understand the full parameter surface.

### Phase 2: Parameter Catalog

Build a complete catalog of every parameter, flag, and subcommand:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| ... | ... | ... | ... | ... |

Include:
- Positional arguments
- Named flags (`--flag`, `-f`)
- Boolean flags
- Flags that accept values
- Subcommands
- Combinations of flags

### Phase 3: Test Matrix Generation

Generate a test matrix covering:

1. **No parameters**: Run the program with zero arguments.
2. **Each parameter individually**: Run the program with each parameter in isolation.
3. **All required parameters**: Run with all mandatory parameters satisfied.
4. **Optional parameter combinations**: Test meaningful combinations of optional flags.
5. **Mutually exclusive parameters**: Test combinations that should fail or produce warnings.
6. **Missing required parameters**: Omit required params to verify error handling.
7. **Invalid values**: Pass wrong types, out-of-range values, non-existent files, etc.
8. **Boundary values**: Test edge cases (empty strings, zero, negative numbers, very large values, special characters).
9. **Special characters and injection**: Test with quotes, semicolons, backticks, `$()`, etc.
10. **Help/usage flags**: Verify `--help` and `-h` produce correct output.

### Phase 4: Execution

For each test case:

1. Run the command.
2. Capture stdout, stderr, and exit code.
3. Classify the result:
   - **PASS (success)**: Expected success, got success with correct output.
   - **PASS (error)**: Expected error, got error with correct message.
   - **FAIL**: Unexpected result (wrong exit code, missing output, crash, incorrect output).
4. Record the result in the test matrix.

### Phase 5: Report

Produce a final summary:

```
CLI Check Report: <program-name>
==================================
Total tests:     X
Passed:          X
Failed:          X
Skipped:         X

Failed Tests:
  - [test description]: expected X, got Y (exit code Z)
  - ...

Recommendations:
  - [any issues found]
  - ...
```

## Rules

- ALWAYS run tests with explicit working directory if the program depends on file paths.
- ALWAYS capture both stdout AND stderr for every test.
- ALWAYS check exit codes (0 = success, non-zero = failure on Unix).
- ALWAYS test both valid and invalid inputs.
- NEVER assume default behavior — verify it explicitly.
- If the program writes files or modifies state, use a temporary directory and clean up after.
- For interactive programs, test with piped input where possible.
- Document any flaky or environment-dependent tests separately.

## Example

```bash
# Program: mycli
# Discovered flags: --name, --count, --verbose, --output

# Test matrix:
mycli                          # no args (expect error or default behavior)
mycli --help                   # help output
mycli --name "test"            # single flag
mycli --name ""                # empty string
mycli --count 5                # numeric flag
mycli --count -1               # negative number (expect error)
mycli --count abc              # wrong type (expect error)
mycli --name "test" --count 5  # combination
mycli --name "test" --verbose  # combination with boolean
mycli --output /tmp/out.txt    # file output
mycli --output /nonexistent/path  # invalid path (expect error)
```
