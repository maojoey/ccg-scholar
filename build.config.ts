import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: false,
    inlineDependencies: true,
  },
  externals: [
    'inquirer',
    'ansis',
    'cac',
    'fs-extra',
    'i18next',
    'ora',
    'pathe',
    'smol-toml',
  ],
})
