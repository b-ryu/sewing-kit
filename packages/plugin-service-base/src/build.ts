import {join} from 'path';

import {produce} from 'immer';
import {
  changeBaseJavaScriptBabelPreset,
  BaseBabelPresetModule,
  BaseBabelPresetTarget,
} from '@sewing-kit/plugin-javascript';
import {} from '@sewing-kit/plugin-babel';

import {PLUGIN as BASE_PLUGIN} from './common';

const PLUGIN = `${BASE_PLUGIN}.build`;

export function buildService({
  hooks,
  workspace,
}: import('@sewing-kit/tasks').BuildProjectTask) {
  hooks.service.tap(PLUGIN, ({service, hooks}) => {
    const updatePreset = changeBaseJavaScriptBabelPreset({
      target: BaseBabelPresetTarget.Node,
      modules: BaseBabelPresetModule.CommonJs,
    });

    hooks.configure.tap(PLUGIN, (configurationHooks) => {
      configurationHooks.babelConfig?.tap(PLUGIN, produce(updatePreset));

      configurationHooks.webpackOutputDirectory?.tap(PLUGIN, () =>
        workspace.fs.buildPath('services'),
      );

      configurationHooks.webpackOutputFilename?.tap(PLUGIN, (filename) =>
        workspace.services.length > 1 ? join(service.name, filename) : filename,
      );
    });

    hooks.steps.tap(PLUGIN, (steps) => {
      return steps;
    });
  });
}
