export declare type OriginConfig = {
    Id: string;
    DomainName: string;
    CustomHeaders: Record<string, unknown>;
    OriginPath: string;
    S3OriginConfig?: {
        OriginAccessIdentity: string;
    };
    CustomOriginConfig?: {
        HTTPPort: number;
        HTTPSPort: number;
        OriginProtocolPolicy: Record<string, unknown> | string;
        OriginSslProtocols: {
            Quantity: number;
            Items: string[];
        };
        OriginReadTimeout: number;
        OriginKeepaliveTimeout: number;
    };
};
export declare type Options = {
    originAccessIdentityId: string;
};
export declare type Origin = string | {
    protocolPolicy: string;
    url: string;
    pathPatterns: Record<string, unknown>;
    headers: Record<string, string>;
};
export declare const getOriginConfig: (origin: Origin, options?: Options) => OriginConfig;
