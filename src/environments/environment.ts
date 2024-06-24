// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import version from '../../package.json';

export const environment = {
  production: false,
  version: version,
  apiRootUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8081/auth',
    realm: 'WIPP',
    clientId: 'wipp-public-client'
  },
  iipRootUrl: 'http://localhost:8082/fcgi-bin/iipsrv.fcgi'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
