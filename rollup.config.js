import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'

import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'
import globals from 'rollup-plugin-node-globals'

const prod = process.env.NODE_ENV === 'production'

const extensions = ['.js', '.ts', '.tsx'];

function getConfig(dest, format) {
  return {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: dest,
      format,
      name: 'ReactPixi',
      sourcemap: !prod,
      globals: {
        'pixi.js': 'PIXI',
        'react': 'React'
      },
    },
    plugins: [
      json(),
      babel({
        extensions,
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
      }),
      resolve({
        extensions,
        browser: true,
        mainFields: ['main', 'jsnext']
      }),
      commonjs({
        ignoreGlobal: false,
        namedExports: {
          'node_modules/scheduler/index.js': [
            'unstable_scheduleCallback',
            'unstable_cancelCallback'
          ]
        }
      }),
      replace({
        __DEV__: prod ? 'false' : 'true',
        'process.env.NODE_ENV': prod ? '"production"' : '"development"',
      }),
      globals(),
      prod && terser(),
      filesize(),
    ].filter(Boolean),
    external: [
      'pixi.js',
      'react',
      'react-dom'
    ]
  }
}

const buildType = prod ? '' : '-dev'

const configs = [
  getConfig(`dist/react-pixi.cjs${buildType}.js`, 'cjs'),
  getConfig(`dist/react-pixi.umd${buildType}.js`, 'umd'),
  getConfig(`dist/react-pixi.module${buildType}.js`, 'es'),
]

export default configs
