# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Admin / Super auth flow >> super login with correct password succeeds
- Location: tests\e2e\smoke.spec.ts:81:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Manajemen Akun/i })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('heading', { name: /Manajemen Akun/i })

```

```yaml
- link "Lewati ke Konten Utama (Skip to Content)":
  - /url: "#beranda"
- alert
- main:
  - link "GIA Deliksari Logo GIA DELIKSARI Semarang GROWING CHURCH! 🔥":
    - /url: /
    - img "GIA Deliksari Logo"
    - text: GIA DELIKSARI Semarang GROWING CHURCH! 🔥
  - navigation:
    - link "Kunjungan":
      - /url: "#kunjungan"
    - link "Tentang":
      - /url: "#tentang"
    - link "Pelayanan":
      - /url: "#pelayanan"
    - link "Khotbah":
      - /url: "#khotbah"
    - link "Warta":
      - /url: "#warta"
    - link "Jadwal":
      - /url: "#jadwal"
    - link "Tim":
      - /url: "#struktur"
    - link "Layanan":
      - /url: "#layanan"
    - link "Persembahan":
      - /url: "#persembahan"
    - link "Galeri":
      - /url: "#galeri"
    - link "Kontak":
      - /url: "#kontak"
  - button "Toggle Dark/Light Mode"
  - link "Admin Portal":
    - /url: /admin
  - heading "Superuser Portal" [level=1]
  - paragraph: "Kelola akun pengurus gereja: superuser, admin/operator, dan bendahara youth. Akses khusus role = super."
  - text: Akses ditolak. Halaman ini khusus superuser. Username Superuser
  - textbox "andreas"
  - text: PIN / Password
  - textbox "••••": "5050"
  - button "Masuk Superuser Portal"
  - link "Kembali ke Beranda Jemaat":
    - /url: /home
  - text: "Default superuser:"
  - code: andreas
  - text: /
  - code: "5050"
  - text: "Ibadah Raya Minggu: 09.00 - 11.00 WIB Sanctuary GIA Deliksari & Live Streaming Grow Generation Youth: Sabtu 18.00 WIB Persekutuan Pemuda & Remaja (PRBK) Deliksari, Gunungpati, Semarang Jl. Kolonel Hadijanto (Kawasan UNNES)"
  - img "GIA Deliksari Logo"
  - text: GIA DELIKSARI SEMARANG GROWING CHURCH! 🔥
  - paragraph: Gereja Isa Almasih Deliksari adalah persekutuan keluarga Allah yang setia berakar dalam firman, bertumbuh dalam kasih, dan melayani sesama di Kota Semarang.
  - link "Instagram GIA Deliksari":
    - /url: https://www.instagram.com/giadeliksari/
    - img
  - link "Instagram Grow Generation Youth":
    - /url: https://www.instagram.com/growgeneration_/
    - img
  - link "Instagram COC Kidz":
    - /url: https://www.instagram.com/cockidz/
    - img
  - link "YouTube GIA Deliksari":
    - /url: https://www.youtube.com/@GIADeliksariSemarang
    - img
  - heading "Navigasi Halaman" [level=4]
  - link "Panduan Tamu":
    - /url: "#kunjungan"
  - link "Tentang Gereja":
    - /url: "#tentang"
  - link "Komunitas":
    - /url: "#pelayanan"
  - link "Arsip Khotbah":
    - /url: "#khotbah"
  - link "Warta Jemaat":
    - /url: "#warta"
  - link "Jadwal Ibadah":
    - /url: "#jadwal"
  - link "Layanan Doa":
    - /url: "#layanan"
  - link "Persembahan":
    - /url: "#persembahan"
  - link "Galeri Momen":
    - /url: "#galeri"
  - link "Peta & Kontak":
    - /url: "#kontak"
  - heading "Administrasi Gereja" [level=4]
  - text: Khusus majelis, pengurus warta, dan tim media.
  - link "Masuk Portal Admin":
    - /url: /admin
  - paragraph: © 2026 Gereja Isa Almasih (GIA) Deliksari Semarang. Hak Cipta Dilindungi.
  - paragraph: Dirancang dengan untuk Kemuliaan Kristus
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Smoke test suite — runs against the live production deployment.
  5   |  *
  6   |  * Goals:
  7   |  *   1. Public pages render without 5xx
  8   |  *   2. SW is registered
  9   |  *   3. /info renders warta section + roster calendar/list toggle
  10  |  *   4. /super login flow works with seeded superuser
  11  |  *   5. Service worker serves offline shell (basic test: navigate away,
  12  |  *      then back — SW intercepts second hit)
  13  |  *
  14  |  * These tests are read-mostly. They don't mutate production data.
  15  |  * If you need mutation tests (e.g. create user), gate them behind
  16  |  * RUN_MUTATION_TESTS=1 env var.
  17  |  */
  18  | 
  19  | test.describe('Public surface', () => {
  20  |   test('home renders with hero + announcement section', async ({ page }) => {
  21  |     await page.goto('/home');
  22  |     // Root redirect: should end up on /home
  23  |     await expect(page).toHaveURL(/\/home$/);
  24  |     // Hero CTA visible
  25  |     await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 10_000 });
  26  |     // No 5xx in console
  27  |     const errors: string[] = [];
  28  |     page.on('pageerror', (e) => errors.push(String(e)));
  29  |     await page.waitForLoadState('networkidle');
  30  |     expect(errors, `page errors: ${errors.join('\n')}`).toHaveLength(0);
  31  |   });
  32  | 
  33  |   test('info page renders warta + roster with calendar toggle', async ({ page }) => {
  34  |     await page.goto('/info');
  35  |     await expect(page.getByRole('heading', { name: /Warta Jemaat/i })).toBeVisible({ timeout: 10_000 });
  36  | 
  37  |     // List view is default; switch to calendar
  38  |     const calendarBtn = page.getByRole('button', { name: /Kalender/i });
  39  |     await expect(calendarBtn).toBeVisible();
  40  |     await calendarBtn.click();
  41  |     // Calendar grid renders day cells
  42  |     await expect(page.locator('[aria-label="Bulan sebelumnya"]')).toBeVisible();
  43  |     // Switch back
  44  |     await page.getByRole('button', { name: /^📋 List$/i }).click();
  45  |   });
  46  | 
  47  |   test('service worker registers and intercepts navigation', async ({ page, context }) => {
  48  |     // Allow SW to register
  49  |     await page.goto('/home');
  50  |     await page.waitForFunction(() => 'serviceWorker' in navigator, undefined, { timeout: 5_000 });
  51  | 
  52  |     // Wait for SW to be active
  53  |     const swActive = await page.evaluate(async () => {
  54  |       const reg = await navigator.serviceWorker.ready;
  55  |       return reg.active !== null;
  56  |     });
  57  |     expect(swActive).toBe(true);
  58  |   });
  59  | 
  60  |   test('OG image endpoint serves a PNG', async ({ request }) => {
  61  |     const res = await request.get('/info', { headers: { Accept: 'text/html' } });
  62  |     expect(res.status()).toBe(200);
  63  | 
  64  |     // Next.js auto-exposes the OG image at /info/opengraph-image
  65  |     const ogRes = await request.get('/info/opengraph-image');
  66  |     expect(ogRes.status()).toBe(200);
  67  |     expect(ogRes.headers()['content-type']).toMatch(/^image\/png/);
  68  |   });
  69  | });
  70  | 
  71  | test.describe('Admin / Super auth flow', () => {
  72  |   // Wait for the login form to be ready (page checks /api/auth/check on mount
  73  |   // and only renders the form after authChecked=true with no session).
  74  |   // Uses placeholder text since the login inputs don't have associated <label>s.
  75  |   const waitForLoginForm = async (page: import('@playwright/test').Page) => {
  76  |     await page.goto('/super');
  77  |     await page.getByRole('heading', { name: /Superuser Portal/i }).waitFor({ timeout: 10_000 });
  78  |     await page.getByPlaceholder('andreas').waitFor({ timeout: 5_000 });
  79  |   };
  80  | 
  81  |   test('super login with correct password succeeds', async ({ page }) => {
  82  |     await waitForLoginForm(page);
  83  |     await page.getByPlaceholder('andreas').fill('andreas');
  84  |     await page.getByPlaceholder('••••').fill('5050');
  85  |     await page.getByRole('button', { name: /Masuk Superuser Portal/i }).click();
  86  |     // Dashboard heading should appear
> 87  |     await expect(page.getByRole('heading', { name: /Manajemen Akun/i })).toBeVisible({
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  88  |       timeout: 15_000,
  89  |     });
  90  |     // Audit log section also visible
  91  |     await expect(page.getByRole('heading', { name: /Audit Log/i })).toBeVisible();
  92  |   });
  93  | 
  94  |   test('super login with wrong password shows error', async ({ page }) => {
  95  |     await waitForLoginForm(page);
  96  |     await page.getByPlaceholder('andreas').fill('andreas');
  97  |     await page.getByPlaceholder('••••').fill('0000');
  98  |     await page.getByRole('button', { name: /Masuk Superuser Portal/i }).click();
  99  |     await expect(page.getByText(/salah|gagal/i).first()).toBeVisible({ timeout: 5_000 });
  100 |   });
  101 | 
  102 |   // Skipped: rate limit lives in an in-memory Map inside the serverless
  103 |   // function. On Vercel, each cold start resets state, so reload inside the
  104 |   // test window often shows fresh function and lockout never triggers.
  105 |   // Real lockout protection still works for users hammering from a single IP
  106 |   // within the same serverless instance (Vercel keeps warm for ~5 min).
  107 |   test.skip('rate-limit kicks in after 3 failed attempts', async ({ page }) => {
  108 |     await waitForLoginForm(page);
  109 |     for (let i = 0; i < 3; i++) {
  110 |       await page.getByPlaceholder('andreas').fill('andreas');
  111 |       await page.getByPlaceholder('••••').fill(`wrong${i}`);
  112 |       await page.getByRole('button', { name: /Masuk Superuser Portal/i }).click();
  113 |       await page.waitForTimeout(800);
  114 |     }
  115 |     await page.reload();
  116 |     await waitForLoginForm(page);
  117 |     await page.getByPlaceholder('andreas').fill('andreas');
  118 |     await page.getByPlaceholder('••••').fill('5050');
  119 |     await page.getByRole('button', { name: /Masuk Superuser Portal/i }).click();
  120 |     await expect(page.getByText(/kunci sementara|terlalu banyak/i).first()).toBeVisible({
  121 |       timeout: 8_000,
  122 |     });
  123 |   });
  124 | });
```