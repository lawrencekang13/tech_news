import type { CloudFrontRequest, CloudFrontEvent, CloudFrontResponse } from "aws-lambda";
import { ApiManifest, PageManifest } from "@sls-next/core/dist/module/types";
export { ImageConfig, ImagesManifest } from "@sls-next/core/dist/module/build/types";
export { RoutesManifest } from "@sls-next/core/dist/module/types";
export declare type OriginRequestApiHandlerManifest = ApiManifest & {
    enableHTTPCompression?: boolean;
};
export declare type OriginRequestDefaultHandlerManifest = PageManifest & {
    logLambdaExecutionTimes?: boolean;
    enableHTTPCompression?: boolean;
    regenerationQueueName?: string;
    disableOriginResponseHandler?: boolean;
};
export declare type OriginRequestImageHandlerManifest = {
    enableHTTPCompression?: boolean;
    domainRedirects?: {
        [key: string]: string;
    };
};
export declare type OriginRequestEvent = {
    Records: [
        {
            cf: {
                request: CloudFrontRequest;
                config: CloudFrontEvent["config"];
            };
        }
    ];
};
export declare type OriginResponseEvent = {
    Records: [
        {
            cf: {
                request: CloudFrontRequest;
                response: CloudFrontResponse;
                config: CloudFrontEvent["config"];
            };
        }
    ];
};
export interface RegenerationEvent {
    pagePath: string;
    basePath: string | undefined;
    region: string;
    bucketName: string;
    pageS3Path: string;
    cloudFrontEventRequest: AWSLambda.CloudFrontRequest;
}
