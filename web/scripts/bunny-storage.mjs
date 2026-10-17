// Minimal Bunny Storage API client for the audiobook scripts (settings come from web/.env.local).
import { createReadStream } from 'node:fs';
import { request } from 'node:https';

const { BUNNY_STORAGE_ZONE: zone, BUNNY_STORAGE_HOST: host, BUNNY_STORAGE_PASSWORD: password, AUDIO_BASE_URL: baseUrl } = process.env;
if (!zone || !host || !password || !baseUrl) fail('Missing BUNNY_STORAGE_ZONE, BUNNY_STORAGE_HOST, BUNNY_STORAGE_PASSWORD or AUDIO_BASE_URL in web/.env.local');

export { baseUrl };

export function fail(message) {
  console.error(message);
  process.exit(1);
}

// Lists a folder, e.g. 'v/' or 'v/1a2b3c4d/'. A folder that does not exist lists as empty.
export async function list(folder) {
  const res = await fetch(`https://${host}/${zone}/${folder}`, { headers: { AccessKey: password, Accept: 'application/json' } });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`List ${folder} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function remove(path) {
  const res = await fetch(`https://${host}/${zone}/${path}`, { method: 'DELETE', headers: { AccessKey: password } });
  if (!res.ok && res.status !== 404) throw new Error(`Delete ${path} failed: ${res.status} ${await res.text()}`);
}

// Streams a file up; Bunny rejects it unless the bytes match the SHA-256 checksum.
export function upload(file, path, sha256, size) {
  return new Promise((resolve, reject) => {
    const req = request(`https://${host}/${zone}/${path}`, {
      method: 'PUT',
      headers: { AccessKey: password, Checksum: sha256.toUpperCase(), 'Content-Type': 'application/octet-stream', 'Content-Length': size },
    }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => res.statusCode === 201 ? resolve() : reject(new Error(`Upload ${path} failed: ${res.statusCode} ${body}`)));
    });
    req.on('error', reject);
    createReadStream(file).on('error', reject).pipe(req);
  });
}
