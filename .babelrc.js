const browsers = [
  'last 8 versions',
  'safari > 8',
  'firefox > 23',
  'chrome > 24',
  'opera > 15',
  'not ie < 11',
  'not ie_mob <= 11',
]

module.exports = {
  presets: [
    [
      "@babel/env",
      { targets: browsers },
    ],
    "@babel/react",
  ],
  plugins: [
    "transform-react-handled-props",
    "@babel/plugin-proposal-class-properties",
  ],
  env: {
    production: {
      plugins: [
        "transform-react-remove-prop-types",
      ],
    },
  },
}
