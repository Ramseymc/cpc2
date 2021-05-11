// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

// module.exports = {
//   chainWebpack: config => {
//     config.plugin('VuetifyLoaderPlugin').tap(args => [{
//       match (originalTag, { kebabTag, camelTag, path, component }) {
//         if (kebabTag.startsWith('core-')) {
//           return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
//         }
//       }
//     }])
//   },
//   configureWebpack:{
//     optimization: {
//       splitChunks: {
//         minSize: 10000,
//         maxSize: 250000,
//       }
//     }
//   }
// }

module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  }

  // chainWebpack: config => {
  //   config.plugin("VuetifyLoaderPlugin").tap(args => [
  //     {
  //       match(originalTag, { kebabTag, camelTag, path, component }) {
  //         console.log(args, path, component)
  //         if (kebabTag.startsWith("core-")) {
  //           return [
  //             camelTag,
  //             `import ${camelTag} from '@/components/core/${camelTag.substring(
  //               4
  //             )}.vue'`
  //           ];
  //         }
  //       }
  //     }
  //   ]);
  // }
};
