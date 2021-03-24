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
  transpileDependencies: ["vuetify"]

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
