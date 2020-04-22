import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js',
  output: {
    file: 'dist/umd/vue.js', // 输出目录
    name: 'Vue', // 打包后全局变量的名字
    format: 'umd', // 统一模块规范,
    sourcemap: true, // es6->es5
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    }): null
  ]
}