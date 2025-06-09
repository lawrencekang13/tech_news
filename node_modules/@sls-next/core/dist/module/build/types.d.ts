export declare type BuildOptions = {
    authentication?: {
        username: string;
        password: string;
    };
    buildId: string;
    domainRedirects: {
        [key: string]: string;
    };
    separateApiLambda?: boolean;
    disableOriginResponseHandler?: boolean;
    useV2Handler?: boolean;
};
export declare type NextConfig = {
    trailingSlash?: boolean;
};
export declare type DynamicPageKeyValue = {
    [key: string]: {
        file: string;
        regex: string;
    };
};
export declare type ImageConfig = {
    deviceSizes: number[];
    imageSizes: number[];
    loader: "default" | "imgix" | "cloudinary" | "akamai";
    path: string;
    formats: string[];
    domains?: string[];
};
export declare type ImagesManifest = {
    version: number;
    images: ImageConfig;
};
