# ImageGalleryNg

This POC project demonstrates an Angular application that allows users to access photo albums stored in an Amazon S3 bucket.

Here you can find a detailed tutorial:
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html

## Serverless Image Handler

To display the photos the project uses the AWS Serverless Image Handler. The service must be created separately using a CloudFormation template:

https://aws.amazon.com/solutions/serverless-image-handler/

## Deployment

1. Open CDK project [image-gallery-cdk](https://github.com/TonySatura/image-gallerimage-gallery-cdky-cdk) and compile TypeScript:
   `$ npm run build`
2. Deploy an S3 bucket as image storage
   `$ cdk deploy *-images -c branch=master`

    - Output:
        - [...]-images.bucketName = \*_-images-bucket[...]_
        - [...]-images.identityPoolId = _eu-central-1:[...]_

3. Enter region and identityPoolId to environment._prod_.ts of this Angular project.

4. Deploy the AWS Serverless Image Handler CloudFormation stack

    - Execute [deploy script](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/template?stackName=ServerlessImageHandler&templateURL=https:%2F%2Fs3.amazonaws.com%2Fsolutions-reference%2Fserverless-image-handler%2Flatest%2Fserverless-image-handler.template 'deploy script') in AWS console with parameters:
        - CorsEnabled: _Yes_
        - SourceBuckets: _[...]-images.bucketName_ (see output step 2)
        - Deploy DemoUI: _No_

5. Open CDK project [image-gallery-cdk](https://github.com/TonySatura/image-gallerimage-gallery-cdky-cdk) and deploy web application infrastructure and CodePipeline
   `$ cdk deploy *-ui,*-pipeline -c branch=master`
    - Output:
        - siteURL = https://[...].cloudfront.net
