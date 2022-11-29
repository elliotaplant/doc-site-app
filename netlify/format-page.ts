import { Readable } from 'stream';
import { parse, HTMLElement } from 'node-html-parser';

export async function formatPage(rawPage: Readable) {
  const pageAsString = await streamToString(rawPage);
  const root = parse(pageAsString);

  const headNode = root.querySelector('head');
  const metaElement = element('meta', {
    name: 'viewport',
    content: 'width=device-width',
  });

  const styleElement = element(
    'style',
    {},
    `
    body { 
      margin: 0 auto; 
    }

    @media (max-width: 900px) {
      body.doc-content {
        padding: 1em !important;
      }
    }
  `
  );
  headNode?.appendChild(metaElement);
  headNode?.appendChild(styleElement);

  return root.toString();
}

function element(
  tagName: string,
  attrs: { [key: string]: string },
  contents?: string
) {
  const element = new HTMLElement(
    tagName,
    {},
    attrs &&
      Object.entries(attrs)
        .map(([key, value]) => `${key}=${value}`)
        .join(' '),
    null,
    [0, 0]
  );

  if (contents) {
    element.textContent = contents;
  }

  return element;
}

export async function streamToBuffer(stream: Readable) {
  // lets have a ReadableStream as a stream variable
  const chunks: any = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function streamToString(stream: Readable) {
  const buf = await streamToBuffer(stream);
  return buf.toString('utf-8');
}
