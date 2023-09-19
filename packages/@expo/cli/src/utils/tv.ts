/**
 * Determine if the react-native dependency in the project needs to be replaced
 * when prebuilding and the value of the EXPO_TV environment setting has changed.
 */
export function needsReactNativeDependencyChangedForTV(
  dependencies: any,
  params?: { isTV?: boolean }
) {
  const rnVersion: string | undefined = dependencies['react-native'];
  // If the package currently has no react-native dependency, prebuild should add
  // the template version
  if (rnVersion === undefined) {
    return true;
  }
  const rnVersionIsTV = (rnVersion?.indexOf('npm:react-native-tvos') ?? -1) === 0;
  // Return true if the existing version is not TV, and the template is TV, or vice versa
  return (params?.isTV ?? false) !== rnVersionIsTV;
}
