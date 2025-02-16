import { test, expect } from '@playwright/test';
import { doLogin, addNewAd, agreeToTerms } from '../utils/helpers';
import { users } from '../tests-data/users'
import { adDetailsValue } from '../tests-data/AdDetails';


test('login, creating an ad, and verifying that the ad is successfully published', async ({ page }) => {
  try{
    await page.goto('https://homme.co.il/');
    await expect(page).toHaveTitle(/HomMe - דירות להשכרה בכרמיאל ללא תיווך/);
    await agreeToTerms(page);
    await doLogin(page, users.validUser.userName, users.validUser.password);
    //add new ad
    await addNewAd(page, adDetailsValue);
  } catch(e) {
    throw new Error('publishAd.spec | login, creating an ad, and verifying that the ad is successfully published | ' + e);
  }
});

