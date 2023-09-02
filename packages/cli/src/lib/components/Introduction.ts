import { ApiInfoModel } from "redoc";

/**
 * 
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/Parameters/Parameters.tsx
 * 
 * @param info ApiInfoModel
 * @returns MDX string for Introduction page
 */
export function Introduction(info: ApiInfoModel): string {
    const showDownloadButton = info.downloadLink && info.downloadFileName;
    const template =
        `# ${info.title} ${info.version}
    ${showDownloadButton ? `[Download ${info.downloadFileName}](${info.downloadLink})` : ''}
    
    ${info.summary ? info.summary : ''}
    ${info.description ? info.description : ''}
    
    ${info.termsOfService ? `# Terms of Service \n ${info.termsOfService}` : ''}`;

    return template;
}