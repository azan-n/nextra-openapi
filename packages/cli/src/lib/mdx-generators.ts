import { ApiInfoModel, GroupModel, OperationModel } from "redoc";
import * as Handlebars from 'handlebars'
/**
 * 
 * @param info ApiInfoModel
 * @returns MDX string for Introduction page
 */
export function getIntroductionMdx(info: ApiInfoModel): string {
    const templateSource = `
# {{ title }} {{ version }}

{{#unless hideDownloadButton}}
[Download {{ downloadFileName }}]({{ downloadLink }})
{{/unless}}



{{#if summary}}
{{ summary }}
{{/if}}
{{#if description}}
{{ description }}
{{/if}}

{{#if externalDocs}}
{{ externalDocs }}
{{/if}}
`;

    return getMdxFromHbs(templateSource, info);
}

export function getSectionMdx(section: GroupModel) {
    const templateSource = `
# {{ name }}

{{#if description}}
{{ description }}
{{/if}}

{{#if externalDocs}}
    {{ externalDocs }}
{{/if}}
`;
    return getMdxFromHbs(templateSource, section);
}

/**
 * https://github.com/Redocly/redoc/blob/c86fd7f597cc16793a55533758e7b0894e77af24/src/components/Operation/Operation.tsx
 * @param operation 
 */
function getOperationMdx(operation: OperationModel) {
    const { name: summary, description, deprecated, externalDocs, isWebhook, httpVerb } = operation;
    const hasDescription = !!(description || externalDocs);

    return JSON.stringify(operation, null, 2);
    //   return (
    //     <OptionsContext.Consumer>
    //       {options => (
    //         <Row {...{ [SECTION_ATTR]: operation.operationHash }} id={operation.operationHash}>
    //           <MiddlePanel>
    //             <H2>
    //               <ShareLink to={operation.id} />
    //               {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
    //               {isWebhook && (
    //                 <Badge type="primary">
    //                   {' '}
    //                   Webhook {showWebhookVerb && httpVerb && '| ' + httpVerb.toUpperCase()}
    //                 </Badge>
    //               )}
    //             </H2>
    //             {options.pathInMiddlePanel && !isWebhook && (
    //               <Endpoint operation={operation} inverted={true} />
    //             )}
    //             {hasDescription && (
    //               <Description>
    //                 {description !== undefined && <Markdown source={description} />}
    //                 {externalDocs && <ExternalDocumentation externalDocs={externalDocs} />}
    //               </Description>
    //             )}
    //             <Extensions extensions={operation.extensions} />
    //             <SecurityRequirements securities={operation.security} />
    //             <Parameters parameters={operation.parameters} body={operation.requestBody} />
    //             <ResponsesList responses={operation.responses} />
    //             <CallbacksList callbacks={operation.callbacks} />
    //           </MiddlePanel>
    //           <DarkRightPanel>
    //             {!options.pathInMiddlePanel && !isWebhook && <Endpoint operation={operation} />}
    //             <RequestSamples operation={operation} />
    //             <ResponseSamples operation={operation} />
    //             <CallbackSamples callbacks={operation.callbacks} />
    //           </DarkRightPanel>
    //         </Row>
    //       )}
    //     </OptionsContext.Consumer>
    //   );


}

/**
 * Generic function to generate MDX from Handlebars template
 * @returns string
 */
function getMdxFromHbs(templateSource: string, data: any): string {
    const template = Handlebars.compile(templateSource);
    const mdx = template(data);

    return mdx;
}