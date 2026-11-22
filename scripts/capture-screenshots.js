import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = "/mnt/Ldisk/workspace/kenpath/screenshots";
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "laptop-1280x800", width: 1280, height: 800 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

async function run() {
  console.log("🚀 Launching Chrome to capture responsive application screenshots...");

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // 1. Capture Login Screen across viewports in Light Mode
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:5173/login", { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));

    const loginPath = path.join(SCREENSHOTS_DIR, `login-${vp.name}.png`);
    await page.screenshot({ path: loginPath, fullPage: false });
    console.log(`📸 Saved: ${loginPath}`);
  }

  // 2. Perform Login as Sarah Jenkins
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:5173/login", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));

  // Click 1-Click Demo Login button
  const demoButtons = await page.$$("button");
  for (const btn of demoButtons) {
    const text = await (await btn.getProperty("textContent")).jsonValue();
    if (text && text.includes("Demo Login")) {
      await btn.click();
      break;
    }
  }

  // Wait for navigation to dashboard
  await new Promise((r) => setTimeout(r, 2000));
  console.log("Logged in successfully. Capturing light-mode screens...");

  const screens = [
    { name: "dashboard", url: "http://localhost:5173/" },
    { name: "readings", url: "http://localhost:5173/readings" },
    { name: "reports", url: "http://localhost:5173/reports" },
    { name: "profile", url: "http://localhost:5173/profile" },
  ];

  // Capture Light Mode Screens
  for (const screen of screens) {
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(screen.url, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 800));

      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        `${screen.name}-${vp.name}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`📸 Saved: ${screenshotPath}`);
    }
  }

  // Capture Record Reading Modal open on desktop (Light Mode)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));

  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await (await btn.getProperty("textContent")).jsonValue();
    if (text && text.includes("Record Reading")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  const modalPath = path.join(SCREENSHOTS_DIR, "reading-modal-desktop-1440x900.png");
  await page.screenshot({ path: modalPath, fullPage: false });
  console.log(`📸 Saved: ${modalPath}`);

  // Now enable Dark Mode by setting localStorage and adding dark class
  console.log("Switching to Dark Theme...");
  await page.evaluate(() => {
    localStorage.setItem("sweety_theme_mode", "dark");
    document.documentElement.classList.add("dark");
  });

  // Capture Dark Mode Screens on Desktop and Mobile
  const darkViewports = [
    { name: "desktop-1440x900", width: 1440, height: 900 },
    { name: "mobile-390x844", width: 390, height: 844 },
  ];

  for (const screen of screens) {
    for (const vp of darkViewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(screen.url, { waitUntil: "networkidle0" });
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await new Promise((r) => setTimeout(r, 800));

      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        `${screen.name}-dark-${vp.name}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`📸 Saved Dark: ${screenshotPath}`);
    }
  }

  // Capture Reading Modal in Dark Mode
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await new Promise((r) => setTimeout(r, 800));

  const darkButtons = await page.$$("button");
  for (const btn of darkButtons) {
    const text = await (await btn.getProperty("textContent")).jsonValue();
    if (text && text.includes("Record Reading")) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  const darkModalPath = path.join(SCREENSHOTS_DIR, "reading-modal-dark-desktop-1440x900.png");
  await page.screenshot({ path: darkModalPath, fullPage: false });
  console.log(`📸 Saved Dark: ${darkModalPath}`);

  // Capture Login in Dark Mode
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:5173/login", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await new Promise((r) => setTimeout(r, 600));
  const darkLoginPath = path.join(SCREENSHOTS_DIR, "login-dark-desktop-1440x900.png");
  await page.screenshot({ path: darkLoginPath, fullPage: false });
  console.log(`📸 Saved Dark: ${darkLoginPath}`);

  await browser.close();
  console.log("🎉 All visual screenshots (light + dark mode) captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
