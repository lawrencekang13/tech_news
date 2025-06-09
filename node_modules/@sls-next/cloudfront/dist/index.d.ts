import AWS from "aws-sdk";
import { Credentials } from "./lib/cloudfront";
export declare type CreateInvalidationOptions = {
    credentials: Credentials;
    distributionId: string;
    paths?: string[];
};
declare const createInvalidation: (options: CreateInvalidationOptions) => Promise<AWS.CloudFront.CreateInvalidationResult>;
export declare type CheckCloudFrontDistributionReadyOptions = {
    credentials: Credentials;
    distributionId: string;
    waitDuration: number;
    pollInterval: number;
};
declare const checkCloudFrontDistributionReady: (options: CheckCloudFrontDistributionReadyOptions) => Promise<boolean>;
export { createInvalidation, checkCloudFrontDistributionReady };
