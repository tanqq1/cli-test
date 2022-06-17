// 配置参考：https://babeljs.io/docs/en/babel-preset-typescript

module.exports = {
  plugins: [
    [
      '@babel/transform-runtime',
      {
        regenerator: false,
        helpers: true,
        // corejs 设置成 false，自己可控使用，不用担心 pollute global
        corejs: false,
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        // useBuiltIns 设置成 usage，如果是 hera 或者 qidian 使用，可以
        //  设置成 false 因为在项目中加载了 core-js 的全部内容
        useBuiltIns: 'usage',
        debug: false,
        // 默认走 chrome 43
        targets: {
          chrome: '43',
        },
        modules: 'commonjs',
        // 配套安装 core-js@3.9.0
        corejs: 3,
      },
    ],
    ['@babel/preset-typescript'],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            // 单元测试时使用 chrome 100
            targets: { chrome: '100' },
          },
        ],
        ['@babel/preset-typescript'],
      ],
    },
  },
}
