import { Readable } from 'stream';

export async function toBuffer(stream: Readable) {
  const list: any[] = [];
  // const reader = stream.getReader();

  while (true) {
    const value = await stream.read();
    if (value) {
      list.push(value);
    } else {
      break;
    }
  }

  return Buffer.concat(list);
}
