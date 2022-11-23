import { Readable } from 'stream';
import { parse } from 'node-html-parser';

export async function formatPage(rawPage: Readable) {
  const pageAsString = await streamToString(rawPage);
  const root = parse(pageAsString);

  return root.toString();
}

async function streamToString(stream: Readable) {
  // lets have a ReadableStream as a stream variable
  const chunks: any = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}
