import StyleDictionary from 'style-dictionary';

export function createTokenStudioConfig(input, output) {
  return {
    source: [input],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: output.endsWith('/') ? output : `${output}/`,
        files: [
          {
            destination: 'colors.css',
            format: 'css/variables',
            filter: (token) => token.type === 'color'
          },
          {
            destination: 'spacing.css',
            format: 'css/variables',
            filter: (token) => token.type === 'spacing'
          },
          {
            destination: 'typography.css',
            format: 'css/variables',
            filter: (token) => ['fontFamilies', 'fontSizes', 'fontWeights', 'lineHeights'].includes(token.type)
          },
          {
            destination: 'shadows.css',
            format: 'css/variables',
            filter: (token) => token.type === 'boxShadow'
          },
          {
            destination: 'tokens.css',
            format: 'css/variables'
          }
        ]
      }
    }
  };
}
