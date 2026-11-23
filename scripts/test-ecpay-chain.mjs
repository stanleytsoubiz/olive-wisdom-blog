// Runs the ECPay sandbox test chain: bundles the TS entry with esbuild and
// executes it. Usage: node scripts/test-ecpay-chain.mjs
import { build } from 'esbuild';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = join(mkdtempSync(join(tmpdir(), 'ecpay-chain-')), 'entry.mjs');
await build({
  entryPoints: ['scripts/test-ecpay-chain.entry.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  logLevel: 'warning',
});
await import(pathToFileURL(out).href);
