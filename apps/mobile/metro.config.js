const { withNxMetro } = require('@nrwl/react-native');
const { getDefaultConfig } = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const { getResolveRequest } = require('./metro-resolver');
// const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  const config = withNxMetro(
    {
      maxWorkers: 1,
      resetCache: true,
      // reporter: {
      //   update: ({ type, ...data }) => {
      //     // if(type === 'dep_graph_loaded'){
      //     console.log('Metro reporter: ', type, data);
      //     // }
      //   },
      // },
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        }),
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
      },
      resolver: {
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
        blockList: exclusionList([
          /^(?!.*node_modules).*\/dist\/.*/,
          /.*\/default\/.*/,
          /.*\/\.cache\/.*/,
        ]),
      },
    },
    {
      // Change this to true to see debugging info.
      // Useful if you have issues resolving modules
      debug: true,
      // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
      extensions: [],
      // the project root to start the metro server
      projectRoot: __dirname,
      // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
      watchFolders: [],
    }
  );
  config.maxWorkers = 1;
  config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, '..', '..', 'node_modules'),
    'node_modules',
  ];
  // config.resolver.resolveRequest = MetroSymlinksResolver();
  config.resolver.resolveRequest = getResolveRequest([
    '',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ]);
  return config;
})();
