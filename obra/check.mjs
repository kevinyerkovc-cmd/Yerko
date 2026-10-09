import pw from '/opt/node-tools/node_modules/playwright/index.js'; const { chromium } = pw;
import fs from 'fs';
const head = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>';
fs.writeFileSync('_test.html', head + fs.readFileSync('index.html','utf8') + '</body></html>');
const b = await chromium.launch({ args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'] });
const errs = [];
for (const [name,w,h,scheme] of [['desktop',1280,900,'light'],['mobile',400,820,'light'],['dark',1280,900,'dark']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, colorScheme:scheme });
  p.on('console', m => { if (m.type()==='error') errs.push(`[${name}] console: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`[${name}] pageerror: ${e.message}`));
  await p.goto('file://' + process.cwd() + '/_test.html');
  await p.waitForTimeout(900);
  // recorre pestañas
  const tabs = await p.$$('nav.tabs button');
  for (const t of tabs) { await t.click(); await p.waitForTimeout(220); }
  await p.click('#t-3d'); await p.waitForTimeout(2200);
  const hint = await p.textContent('#hint3d');
  const canvas = await p.$('#view3d canvas');
  const ow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const rows = await p.evaluate(() => document.querySelectorAll('#tb-pres tr.it').length);
  console.log(`${name}: overflow=${ow}px  canvas=${!!canvas}  items=${rows}  hint="${hint.trim().slice(0,70)}"`);
  if (name==='desktop') {
    await p.click('#t-3d'); await p.waitForTimeout(600);
    await p.screenshot({ path:'_cap-3d.png' });
    await p.click('#t-fach'); await p.waitForTimeout(400); await p.screenshot({ path:'_cap-fach.png', fullPage:false });
    await p.click('#t-pb'); await p.waitForTimeout(400); await p.screenshot({ path:'_cap-pb.png' });
    await p.click('#t-apu'); await p.waitForTimeout(300);
    await p.click('#tb-pres tr.it'); await p.waitForTimeout(300); await p.screenshot({ path:'_cap-apu.png' });
  }
  if (name==='mobile') await p.screenshot({ path:'_cap-mob.png' });
  await p.close();
}
await b.close();
console.log(errs.length ? 'ERRORES:\n'+errs.join('\n') : 'sin errores de consola');
