// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    album: {
        bucketName: 'image-gallery-images-bucket43879c71-144tb5q75m5ai',
        imageHandlerEndpoint: 'https://d3j7rohb8t3esh.cloudfront.net'
    },
    aws: {
        region: 'eu-central-1',
        identityPoolId: 'eu-central-1:0b698247-b5cd-4975-a9cc-6db279d41a9a'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
