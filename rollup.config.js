import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }, {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    }, {
      file: 'dist/index.umd.js',
      name: 'jsPDF-AutoText',
      format: 'umd',
      plugins: [terser()]
    }
  ],
  plugins: [
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}