import {produce} from 'immer';
import {} from '@sewing-kit/plugin-babel';

import {addTypeScriptBabelConfig} from './utilities';
import {PLUGIN} from './common';

// Just loaded for its hook augmentations
import {} from '@sewing-kit/plugin-webpack';

function addTsExtensions(extensions: string[]) {
  return ['.ts', '.tsx', ...extensions];
}

export default function buildTypescript({
  hooks,
}: import('@sewing-kit/core').BuildTask) {
  hooks.package.tap(PLUGIN, ({hooks}) => {
    hooks.configure.tap(PLUGIN, (configurationHooks) => {
      configurationHooks.extensions.tap(PLUGIN, addTsExtensions);
      configurationHooks.babelConfig?.tap(PLUGIN, addTypeScriptBabelConfig);
    });
  });

  hooks.webApp.tap(PLUGIN, ({hooks}) => {
    hooks.configure.tap(PLUGIN, (configurationHooks) => {
      configurationHooks.extensions.tap(PLUGIN, addTsExtensions);
      configurationHooks.babelConfig?.tap(PLUGIN, addTypeScriptBabelConfig);

      configurationHooks.webpackRules?.tapPromise(PLUGIN, async (rules) => {
        const options =
          configurationHooks.babelConfig &&
          (await configurationHooks.babelConfig.promise({}));

        return produce(rules, (rules) => {
          rules.push({
            test: /\.tsx?/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options,
          });
        });
      });
    });
  });

  hooks.service.tap(PLUGIN, ({hooks}) => {
    hooks.configure.tap(PLUGIN, (configurationHooks) => {
      configurationHooks.extensions.tap(PLUGIN, addTsExtensions);
      configurationHooks.babelConfig?.tap(PLUGIN, addTypeScriptBabelConfig);

      configurationHooks.webpackRules?.tapPromise(PLUGIN, async (rules) => {
        const options =
          configurationHooks.babelConfig &&
          (await configurationHooks.babelConfig.promise({}));

        return produce(rules, (rules) => {
          rules.push({
            test: /\.tsx?/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options,
          });
        });
      });
    });
  });
}