import { Tab, Tabs } from 'nextra/components';
import { OpenAPIV3 } from 'openapi-types';

export default function ApiResponse(props: {
  responses: OpenAPIV3.ResponsesObject
}) {
  const { responses } = props;
  const responseKeys = Object.keys(responses).sort();

  

  if (responseKeys.length === 0) {
    return (null);
  } else {
    return (
      <>
        <h3>Response</h3>
        <Tabs items={Object.keys(responses)}>
          {Object.entries(responses).map((responseName) => (
            <Tab>
              <pre>
                {responseName[1].content}
                <code>{JSON.stringify(responseName[1], null, 2)}</code>
              </pre>
            </Tab>
          ))}
        </Tabs>
      </>
    );
  }
}

