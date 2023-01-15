import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  const sub = context.clientContext?.user?.sub;

  return {
    statusCode: 200,
    body: JSON.stringify({ authed: Boolean(sub) }),
  };
};

export { handler };
