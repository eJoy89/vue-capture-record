const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testCameraControl() {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();

  try {
    // Navigate to your Vue.js app
    await driver.get('http://localhost:8080'); // Adjust URL as needed

    // Click the "카메라 시작" button
    const startCameraButton = await driver.findElement(By.css('button'));
    await startCameraButton.click();

    // Wait for the video element to be populated with the media stream
    await driver.wait(until.elementLocated(By.css('video')), 10000);

    const videoElement = await driver.findElement(By.css('video'));
    const videoSrc = await videoElement.getAttribute('srcObject');
    assert.ok(videoSrc, 'Video stream not started');

    console.log('Test passed: Video stream started successfully');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
})();
