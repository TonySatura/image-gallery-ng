# ImageGalleryNg

This POC project demonstrates an Angular application that allows users to access photo albums stored in an Amazon S3 bucket.

Here you can find a detailed tutorial:
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html

## Serverless Image Handler

To display the photos the project uses the AWS Serverless Image Handler. The service must be created separately using a CloudFormation template:

https://aws.amazon.com/solutions/serverless-image-handler/

## Deployment

1. Open CDK project [image-gallery-cdk](https://github.com/TonySatura/image-gallery-cdk)

    - compile TypeScript:

        `$ npm run build`

    - Deploy an S3 bucket as image storage

        `$ cdk deploy *-images -c branch=master`

    - Output:

        - [...]-images.bucketName = **\*_-images-bucket[...]_**
        - [...]-images.identityPoolId = **_eu-central-1:[...]_**

    - Enter _bucketName_, _identityPoolId_ and _region_ to environment.ts (or .prod.ts) of this Angular project.
        ```typescript
        export const environment = {
            production: false,
            album: {
                bucketName: '*-images-bucket[...]'
                //imageHandlerEndpoint: ''
            },
            aws: {
                region: 'eu-central-1',
                identityPoolId: 'eu-central-1:[...]'
            }
        };
        ```

2. Deploy the AWS Serverless Image Handler CloudFormation stack

    - Execute [deploy script](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/template?stackName=ServerlessImageHandler&templateURL=https:%2F%2Fs3.amazonaws.com%2Fsolutions-reference%2Fserverless-image-handler%2Flatest%2Fserverless-image-handler.template 'deploy script') in AWS console with parameters:

        - CorsEnabled: _Yes_
        - SourceBuckets: _[...]-images.bucketName_ (see output step 2)
        - Deploy DemoUI: _No_

    - Enter output ApiEndpoint as _imageHandlerEndpoint_ to environment.ts (or .prod.ts) of this Angular project.
        ```typescript
        export const environment = {
            production: false,
            album: {
                bucketName: '*-images-bucket[...]',
                imageHandlerEndpoint: 'https://[...].cloudfront.net/'
            },
            aws: {
                region: 'eu-central-1',
                identityPoolId: 'eu-central-1:[...]'
            }
        };
        ```

3. Commit and push the changes in the environment file(s) of this Angular project.

4. Open CDK project [image-gallery-cdk](https://github.com/TonySatura/image-gallerimage-gallery-cdky-cdk)

    - Deploy web application infrastructure and CodePipeline

        ```bash
        $ cdk deploy *-ui -c branch=master
        $ cdk deploy *-pipeline -c branch=master
        ```

    - Output:
        - siteURL = https://[...].cloudfront.net
    - Wait until the pipeline deployed the Angular project to the bucket for the first time
    - Visit the siteURL to test the web application

## About the web application

### Route "overview"

-   routes to OverviewComponent
-   shows a list of links to the route "album"
-   for each directory inside of the image bucket

### Route "album"

-   routes to DetailsComponent
-   shows all images of a single directory in the image bucket
-   displays 200x200 pixel thumbnails by using the Serverless Image Handler
