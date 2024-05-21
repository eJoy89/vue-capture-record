const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testColorChange() {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();

  try {
    // Vue.js 앱으로 이동
    await driver.get('http://localhost:8080'); // 필요에 따라 URL을 조정하세요.

    // 페이지가 완전히 로드될 때까지 기다립니다.
    await driver.wait(until.elementLocated(By.css('.box-test')), 10000);

    // 상자 요소를 찾음
    const boxElement = await driver.findElement(By.css('.box-test'));

    // 초기 배경색을 가져옴
    let initialColor = await boxElement.getCssValue('background-color');
    console.log(`초기 색상: ${initialColor}`);

    // 버튼을 클릭
    const button = await driver.findElement(By.css('button'));
    await button.click();

    // 색상이 변경될 때까지 대기
    await driver.wait(async () => {
      let newColor = await boxElement.getCssValue('background-color');
      return newColor !== initialColor;
    }, 1000);

    // 새로운 배경색을 가져옴
    let newColor = await boxElement.getCssValue('background-color');
    console.log(`새로운 색상: ${newColor}`);

    // 색상이 변경되었는지 확인
    assert.notStrictEqual(initialColor, newColor, '상자 색상이 변경되지 않았습니다.');

    console.log('테스트 통과: 상자 색상이 성공적으로 변경되었습니다.');

  } catch (error) {
    console.error('테스트 실패:', error);
  } finally {
    await driver.quit();
  }
})();
