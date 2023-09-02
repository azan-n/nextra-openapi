import { FieldModel, MediaContentModel, RequestBodyModel, SchemaModel } from "redoc";
import { TabsMdx } from "./Tabs";
import { MediaTypesSwitch } from "./MediaTypesSwitch";


export default function Parameters(parameters: FieldModel[], body?: RequestBodyModel): string | null {

    function safePush(obj: Record<string, any>, prop: string, item: any) {
        if (!obj[prop]) {
            obj[prop] = [];
        }
        obj[prop].push(item);
    }

    const PARAM_PLACES = ['path', 'query', 'cookie', 'header'];

    function orderParams(params: FieldModel[]): Record<string, FieldModel[]> {
        const res = {};
        params.forEach(param => {
            if (param.in) {
                safePush(res, param.in, param);
            }
        });
        return res;
    }

    if (body === undefined && parameters === undefined || parameters.length === 0) {
        return null;
    }

    const paramsMap = orderParams(parameters);

    const paramsPlaces = parameters.length > 0 ? PARAM_PLACES : [];

    const bodyContent = body && body.content;

    const bodyDescription = body && body.description;

    const bodyRequired = body && body.required;

    return `
    ## Parameters
    ${paramsPlaces.map(place => (
        `### ${place} Parameters
    | Name | Description | Hello |
    | --- | --- | --- |
    ${paramsMap[place].map(param => `|${param.name}|${param.description}|${param.required}`).join('\n')}`
    )).join('\n')}

    ## Request
    ### Request Body
    hasBodyContent && (
    <BodyContent
            content={ hasBodyContent }
description = { bodyDescription: hasBodyDescription }
isBodyRequired = { bodyRequired: isBodyRequired }
    />

    `
}

function BodyContent(content: MediaContentModel, description?: string, bodyRequired?: boolean) {
    const { isRequestType } = content;
    return MediaTypesSwitch(content, content.mediaTypes.map((mediaType) => {
        return `
        ${mediaType.schema?.description}

        `
    }))
}
// export function BodyContent(props: {
//     content: MediaContentModel;

// }): JSX.Element {
//     const { content, description, bodyRequired } = props;
//     const { isRequestType } = content;
//     return (
//         <MediaTypesSwitch
//         content= { content }
//     renderDropdown = { props => < DropdownWithinHeader bodyRequired = { bodyRequired } {...props } />}
//         >
//         {({ schema }) => {
//         return (
//             <>
//             { description !== undefined && <Markdown source= { description } />}
//     {
//         schema?.type === 'object' && (
//             <ConstraintsView constraints={ schema?.constraints || [] } />
//               )
//     }
//     <Schema
//                 skipReadOnly={ isRequestType }
//     skipWriteOnly = {!isRequestType
// }
// key = "schema"
// schema = { schema }
//     />
//     </>
//           );
// }}
// </MediaTypesSwitch>
//     );
//   }

export interface SchemaOptions {
    showTitle?: boolean;
    skipReadOnly?: boolean;
    skipWriteOnly?: boolean;
    level?: number;
  }
  
  export interface SchemaProps extends SchemaOptions {
    schema: SchemaModel;
  }
  
function Schema (schema: SchemaModel) {
      const level = (rest.level || 0) + 1;
  
      if (!schema) {
        return <em> Schema not provided </em>;
      }
      const { type, oneOf, discriminatorProp, isCircular } = schema;
  
      if (isCircular) {
        return <RecursiveSchema schema={schema} />;
      }
  
      if (discriminatorProp !== undefined) {
        if (!oneOf || !oneOf.length) {
          console.warn(
            `Looks like you are using discriminator wrong: you don't have any definition inherited from the ${schema.title}`,
          );
          return null;
        }
        const activeSchema = oneOf[schema.activeOneOf];
        return activeSchema.isCircular ? (
          <RecursiveSchema schema={activeSchema} />
        ) : (
          <ObjectSchema
            {...rest}
            level={level}
            schema={activeSchema}
            discriminator={{
              fieldName: discriminatorProp,
              parentSchema: schema,
            }}
          />
        );
      }
  
      if (oneOf !== undefined) {
        return <OneOfSchema schema={schema} {...rest} />;
      }
  
      const types = isArray(type) ? type : [type];
      if (types.includes('object')) {
        if (schema.fields?.length) {
          return <ObjectSchema {...(this.props as any)} level={level} />;
        }
      } else if (types.includes('array')) {
        return <ArraySchema {...(this.props as any)} level={level} />;
      }
  
      // TODO: maybe adjust FieldDetails to accept schema
      const field = {
        schema,
        name: '',
        required: false,
        description: schema.description,
        externalDocs: schema.externalDocs,
        deprecated: false,
        toggle: () => null,
        expanded: false,
      } as any as FieldModel; // cast needed for hot-loader to not fail
  
      return (
        <div>
          <FieldDetails field={field} />
        </div>
      );
    }
  }