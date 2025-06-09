export declare type PublicDirectoryCache = boolean | {
    test?: string;
    value?: string;
};
declare const getPublicAssetCacheControl: (filePath: string, options?: PublicDirectoryCache | undefined) => string | undefined;
export default getPublicAssetCacheControl;
