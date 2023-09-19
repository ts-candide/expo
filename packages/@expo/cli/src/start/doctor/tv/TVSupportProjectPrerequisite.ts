import { AppJSONConfig, getConfig, getPackageJson } from '@expo/config';
import chalk from 'chalk';

import * as Log from '../../../log';
import { env } from '../../../utils/env';
import { needsReactNativeDependencyChangedForTV } from '../../../utils/tv';
import { ProjectPrerequisite } from '../Prerequisite';
import { ensureDependenciesAsync } from '../dependencies/ensureDependenciesAsync';
import { ResolvedPackage } from '../dependencies/getMissingPackages';

const debug = require('debug')('expo:doctor:tvSupport') as typeof console.log;

/** Ensure the project has the required web support settings. */
export class TVSupportProjectPrerequisite extends ProjectPrerequisite {
  /** Ensure a project that hasn't explicitly disabled web support has all the required packages for running in the browser. */
  async assertImplementation(): Promise<void> {
    debug('Ensuring TV support is correctly set');

    const needsChanges = this._shouldSetupTVSupportAsync();

    // Ensure TV packages are installed
    if (needsChanges) {
      await this._ensureTVDependenciesInstalledAsync();
    }
  }

  /** Exposed for testing. */
  _shouldSetupTVSupportAsync(): boolean {
    const dependencies = getPackageJson(this.projectRoot).dependencies ?? {};
    const isTV = env.EXPO_TV;
    return needsReactNativeDependencyChangedForTV(dependencies, { isTV });
  }

  /** Exposed for testing. */
  async _ensureTVDependenciesInstalledAsync(): Promise<boolean> {
    Log.warn(`Existing react-native version will not work for EXPO_TV=${env.EXPO_TV}`);
    const config = getConfig(this.projectRoot);
    const requiredPackages: ResolvedPackage[] = [
      // use react-native-web/package.json to skip node module cache issues when the user installs
      // the package and attempts to resolve the module in the same process.
      {
        file: 'package.json',
        pkg: 'react-native',
        version: env.EXPO_TV ? 'npm:react-native-tvos@0.72.4-0' : '0.72.4',
      },
    ];

    try {
      return await ensureDependenciesAsync(this.projectRoot, {
        // This never seems to work when prompting, installing, and running -- instead just inform the user to run the install command and try again.
        skipPrompt: true,
        isProjectMutable: false,
        exp: config.exp,
        installMessage: `Existing react-native version will not work for EXPO_TV=${env.EXPO_TV}.`,
        warningMessage: chalk`Existing react-native version will not work for EXPO_TV=${env.EXPO_TV}.`,
        requiredPackages,
      });
    } catch (error) {
      // Reset the cached check so we can re-run the check if the user re-runs the command by pressing 'w' in the Terminal UI.
      this.resetAssertion();
      throw error;
    }
  }
}
