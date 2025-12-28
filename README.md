# tokenize-css

CLI tool to convert Design Tokens (Token Studio) to CSS variables.

## Installation

```bash
npm install -g tokenize-css
```

## Usage

```bash
tokenize <input> <output> [options]
```

### Examples

```bash
# Basic usage
tokenize tokens.json dist

# With full path
tokenize tokens.json "/path/to/output"

# Specify source type
tokenize tokens.json dist --source token-studio

# Watch mode - rebuild on file changes
tokenize tokens.json dist --watch
```

### Options

| Option                | Description                                 | Default      |
| --------------------- | ------------------------------------------- | ------------ |
| `-s, --source <type>` | Source type (token-studio, figma-variables) | token-studio |
| `-w, --watch`         | Watch for changes and rebuild automatically | false        |
| `-V, --version`       | Output version                              |              |
| `-h, --help`          | Display help                                |              |

## Supported Sources

- ✅ Token Studio
- 🔜 Figma Variables

## Output Files

- `colors.css` - Color tokens
- `spacing.css` - Spacing tokens
- `typography.css` - Typography tokens
- `shadows.css` - Shadow tokens
- `tokens.css` - All tokens combined

## License

MIT
