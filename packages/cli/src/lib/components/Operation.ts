import { ExampleModel, MediaContentModel, MediaTypeModel, OperationModel, XPayloadSample, isPayloadSample, langFromMime } from "redoc";
import { escapeMdxSymbols } from "../utils/escapeMdxSymbols";
import { OpenAPIXCodeSample } from "redoc/typings/types";
import dedent from "dedent";
import Parameters from "./Parameters";
import { TabsMdx } from "./Tabs";
import { MediaTypesSwitch } from "./MediaTypesSwitch";

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/Operation/Operation.tsx
 * @param operation 
 */
export function Operation(operation: OperationModel) {

    const heading = `${operation.name} ${operation.deprecated ? '**deprecated**' : ''}`;

    const _requestSamples = RequestSamples(operation);
    const samples = _requestSamples ? `## Request Samples\n${_requestSamples}` : '';

    const template = `
    # ${escapeMdxSymbols(heading)}
    
    ${operation.httpVerb ? `> ${escapeMdxSymbols(operation.httpVerb.toUpperCase())} ${escapeMdxSymbols(operation.path)}` : ''}
    
    ${operation.description ? escapeMdxSymbols(operation.description) : ''}
    ${operation.externalDocs ? "" : ''}
    ${Parameters(operation.parameters, operation.requestBody)}
    ${samples}
    `


    return dedent(template);
}



/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/RequestSamples/RequestSamples.tsx
 * @param request 
 * @returns 
 */
function RequestSamples(operation: OperationModel): string | null {
    const samples = operation.codeSamples;

    const sampleItems = samples.map((sample) => {
        return sample.label !== undefined ? sample.label : sample.lang;
    }
    );

    const Sample = (sample: OpenAPIXCodeSample | XPayloadSample) => {
        if (isPayloadSample(sample)) {
            // <PayloadSamples content={sample.requestBodyContent} />
            return PayloadSamples(sample.requestBodyContent);
        } else {
            // <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
            return SourceCode(sample.lang, sample.source);
        }
    }

    if (samples.length > 1) {
        const samplesArray = samples.map((sample) => { return Sample(sample) });
        return TabsMdx(sampleItems, samplesArray)
    }
    else if (samples.length === 1) {
        return `${Sample(samples[0])}`
    } else {
        return null;
    }

}

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/PayloadSamples/PayloadSamples.tsx
 * @param content 
 */
function PayloadSamples(content: MediaContentModel): string | null {
    if (!content || !content.mediaTypes || !content.mediaTypes.length) {
        return null;
    } else {
        return MediaTypesSwitch(content, content.mediaTypes.map((mediaType) => { return MediaTypeSamples(mediaType) }));
    }
}

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/PayloadSamples/MediaTypeSamples.tsx
 */
function MediaTypeSamples(mediaType: MediaTypeModel): string {
    const examples = mediaType.examples || {};
    const mimeType = mediaType.name;

    const examplesNames = Object.keys(examples);

    if (examplesNames.length === 0) {
        return `No sample for ${mimeType} media type`;
    } else if (examplesNames.length === 1) {
        const example = examples[examplesNames[0]];
        return Example(example, mimeType);
    } else {
        return TabsMdx(examplesNames, examplesNames.map((name) => Example(examples[name], mimeType)));
    }
}

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/PayloadSamples/Example.tsx
 * @param example 
 * @param mimeType 
 * @returns 
 */
function Example(example: ExampleModel, mimeType: string) {
    if (example.value === undefined && example.externalValueUrl) {
        return `[Example link](${example.externalValueUrl})`;
    } else {
        return ExampleValue(example.value, mimeType);
    }
}

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/PayloadSamples/ExampleValue.tsx
 */
function ExampleValue(value: any, mimeType: string) {
    if (typeof value === 'object') {
        return SourceCode('json', JSON.stringify(value, null, 2));
    } else {
        return SourceCode(langFromMime(mimeType), value);
    }
}

function SourceCode(lang: string, source: string) {
    return `\n\`\`\`${lang}\n${source}\n\`\`\`\n`
}

