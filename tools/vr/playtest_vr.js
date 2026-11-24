// Plays one G4 VR page (Field Files / Desk Day) end to end and screenshots each part.
//   node playtest_vr.js <page.html> <width> <outdir>
// Prints one line: errors, steps, badge, game, words, stamp, pdf, help images, sideways.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [file, width = '1150', outdir = 'out/pt'] = process.argv.slice(2);
  const W = +width; fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/youtube|net::|Failed to load resource/i.test(m.text())) errors.push(m.text()); });
  await page.goto(/^https?:/.test(file) ? file : 'file://' + path.resolve(file));
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  const shot = async (name, sel) => {
    const p = path.join(outdir, `${W}-${name}.png`);
    if (sel) { const el = await page.$(sel); if (el) { await el.screenshot({ path: p }); return; } }
    await page.screenshot({ path: p, fullPage: false });
  };
  await shot('01-top');
  await shot('02-hook', '.vr-sheet');
  // VR path
  const n = await page.$$eval('.vr-step', s => s.length);
  await shot('03-step1', '.vr-step[data-step="0"]');
  let timer = 'none';
  if (await page.$('.vr-timer button')) {
    await page.click('.vr-timer button'); await page.waitForTimeout(2200);
    timer = await page.$eval('.vr-timer .clock', e => e.textContent);
    await shot('03b-timer', '.vr-step[data-step="0"]');
    await page.click('.vr-timer button');
  }
  await shot('04-step4', '.vr-step[data-step="3"]');
  for (let i = 0; i < n; i++) await page.click(`.vr-step[data-step="${i}"] .vr-chk`);
  await page.check('#vr-sent');
  const badge = await page.$eval('#vr-badge', e => e.classList.contains('on'));
  await shot('05-badge', '#vr-loc .wl-card');
  // help drawer
  await page.click('#vr-help summary');
  await page.$$eval('#vr-help img', ims => ims.forEach(i => i.loading = 'eager'));
  await page.waitForTimeout(500);
  const helpImgs = await page.$$eval('#vr-help img', ims => ims.filter(i => i.complete && i.naturalWidth > 0).length + '/' + ims.length);
  await shot('06-help', '#vr-help');
  // Studio Day
  await page.click('.vr-path[data-path="vr-studio"]');
  await page.waitForTimeout(300);
  await shot('07-studio', '#vr-studio .wl-card');
  const type = await page.evaluate(() => window.VR.game.type);
  await shot('08-game-start', '#vr-game');
  await page.evaluate(() => window.VR_TEST.auto());
  const gdone = await page.evaluate(() => window.VR_TEST.done());
  const g = gdone ? 'done' : 'NOT DONE';
  const lit = await page.evaluate(() => window.VR_TEST.game.rows().filter(r => r[1]).length + '/' + window.VR_TEST.game.rows().length);
  await shot('09b-game-full', '#vr-game');
  const sideGame = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.fill('#vr-write textarea[data-w="0"]', 'I found out that each card goes with a real place in our lesson.');
  await page.fill('#vr-write textarea[data-w="1"]', 'One thing I learned is that people use what their region gives them.');
  await page.click('#vr-write .vr-chips button');
  const words = await page.$eval('#vr-count', e => e.textContent);
  const stamp = await page.$eval('#vr-stamp', e => e.classList.contains('on'));
  await shot('10-studio-done', '#vr-studio .wl-card');
  await page.fill('#vr-name', 'Ava');
  const [pop] = await Promise.all([page.waitForEvent('popup', { timeout: 4000 }).catch(() => null), page.click('#vr-pdf')]);
  let pdf = 'no popup';
  if (pop) { await pop.waitForLoadState(); const title = await page.evaluate(() => window.VR.game.title); const pc = await pop.content(); pdf = pc.includes(title.replace(/&/g, '&amp;')) && !pc.includes('not done yet') ? 'ok' : 'bad'; await pop.screenshot({ path: path.join(outdir, `${W}-11-pdf.png`), fullPage: true }); }
  const sideways = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.screenshot({ path: path.join(outdir, `${W}-12-full.png`), fullPage: true });
  const brokenImgs = await page.$$eval('img', ims => ims.filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length);
  console.log(JSON.stringify({ width: W, type, timer, errors, steps: n, badge, help: helpImgs, game: g, lit, words, stamp, pdf, sideways: sideways || sideGame, brokenImgs }));
  await browser.close();
})();
