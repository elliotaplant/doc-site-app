import { Handler } from '@netlify/functions';
import { getOauth2Client } from '../drive';

const handler: Handler = async (event, context) => {
  const sub = context.clientContext?.user?.sub;
  if (!sub) {
    return { statusCode: 403, body: 'Unauthorized' };
  }

  try {
    const client = await getOauth2Client(sub);
    const { token } = await client.getAccessToken();

    return {
      statusCode: 200,
      body: JSON.stringify({ pickerToken: token }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({ pickerToken: null }),
    };
  }
};

export { handler };
