import { expect, Page } from '@playwright/test';
import { agreeToTermsCss, loginCss } from './loginCss';
import { addAdCss } from './addAdCss';
import { adDetailsType, adDetailsValue } from '../tests-data/AdDetails';
import { apartmentListingsCss } from './apartmentListingsCSS';

// click on element
export async function clickOnElement(page: Page, selector: string) {
    try{
        const elem = await page.waitForSelector(selector);
        await elem.click();
    } catch(e){
        throw new Error("clickOnElement | failed to click on element." + e);
    }
}


// fill text element
export async function fillTextElement(page: Page, selector: string, text: string) {
    try{
        const elem = await page.waitForSelector(selector);
        await elem.fill(text);
    } catch(e){
        throw new Error("fillElementText | failed to fill text element." + e)
    }
}



// fill the login form
export async function doLogin(page: Page, userName: string, password: string) {
    try{
        page.getByRole('link', { name: 'התחבר' }).click();
        // fill the fileds and submit
        await fillTextElement(page, loginCss.userName_input, userName);
        await fillTextElement(page, loginCss.password_input, password);
        await clickOnElement(page, loginCss.submitButton);
        // validate reached to the personal area
        const elem = await page.getByText('אזור אישי');
        await expect(elem).toBeVisible({timeout: 5000 });
    } catch(e) {
        throw new Error("doLogin | failed to login." + e);
    }
}


// agree to terms
export async function agreeToTerms(page: Page){
    try {
        //wait for the terms window 6 second
        const window = await page.waitForSelector(agreeToTermsCss.window, { timeout: 6000 });
        if (window) { //if the terms window appear
            console.log('Agree to terms.');
            await page.locator(agreeToTermsCss.agreeButton).click(); // agree to terms
            // waiting for the window to disappear
            await page.waitForSelector(agreeToTermsCss.window, { state: 'detached', timeout: 5000 });
        }
        //if the window didnt appear
    } catch (error) {
        console.log('The terms window didnt appear.');
    }
}


//add new Ad
export async function addNewAd(page: Page, details: typeof adDetailsValue){
    try{
        await clickOnElement(page, addAdCss.addNewAd);
        // validate page is correct and loaded
        await expect(page).toHaveTitle(/פרסום מודעה - HomMe/ ,{timeout: 5000});
        await expect(page.locator('.ff-el-progress-bar span')).toHaveText('16%', { timeout: 5000 });
        await page.waitForLoadState('load');
        // fill the fields
        for (const adPage of adDetailsType) {
            for (const field of adPage.fields) {
                console.log(`the filed: name: ${field.name}, type: ${field.type}, value: ${details[field.name]}\n`);
                switch (field.type) {
                    //text
                    case 'text':
                        await page.locator(addAdCss[field.name]).fill(String(details[field.name]));
                        break;
                    //select
                    case 'select':
                        await page.locator(addAdCss[field.name]).selectOption(details[field.name]);
                        break;
                    //checkable_photo
                    case 'checkable_photo':
                        for( const characteristic of details[field.name] ){
                            await page.waitForLoadState('load');
                            await page.getByLabel(characteristic).first().check();
                        }
                        break;
                    //date
                    case 'date':
                        await page.evaluate((s) => {
                            const input = document.querySelector<HTMLInputElement>(s);
                            if (input) input.removeAttribute('readonly');
                        }, addAdCss[field.name]);
                        await page.fill(addAdCss[field.name], String(details[field.name]));
                    break;
                    //pictureFiles
                    case 'pictureFiles':
                        await page.setInputFiles(addAdCss[field.name], details[field.name]);
                        await page.waitForLoadState('load');
                        // validate at least 1 picture
                        const list = page.locator(addAdCss.uploadedPictureList);
                        const count = await list.locator(addAdCss.uploadedPicture).count(); // count inside element
                        console.log(`Pictures_count: ${count}`);
                        expect(count).toBeGreaterThan(0); // expect to have 1 at least
                        // validate upload pictures 100% completed
                        await expect(page.locator('text=100% Completed')).toHaveCount(count, { timeout: 7000 });
                        break;
                }
            }
            if (await page.locator(addAdCss.nextButton).isVisible()) {
                await page.locator(addAdCss.nextButton).click();
                await page.waitForLoadState('load');
            }
        }
        await page.locator(addAdCss.submitButton).click();
        await page.waitForLoadState('load');
        // await Promise.all([
        //     page.waitForSelector(addAdCss.successMessage),
        //     page.locator(addAdCss.submitButton).click()
        //   ]);
        await validateNewAd(page, details);
    } catch(e){
        throw new Error("addNewAd | failed to add new Ad." + e);
    }
}

export async function validateNewAd(page: Page, details: typeof adDetailsValue) {
    try{
        await page.waitForURL(apartmentListingsCss.apartmentListinURL, {timeout: 5000});
        // Search for the new ad in the ad list
        await page.waitForSelector(apartmentListingsCss.jetListingItems);
        const ads = await page.locator(apartmentListingsCss.jetListingItems);
        const detailsToFind = [details.asset_type, details.city, details.street_number];
        const adCount = await ads.count();
        console.log(`adCount: ${adCount}`);
        let adFound: Boolean = false; //flag- if found the ad in the list.
        for (let i = 0; i < adCount; i++) {
            const adText = await ads.nth(i).textContent();
            if( adText ){
                // if the ad include all the details to find
                if (detailsToFind.every(detail => adText.includes(detail))){
                    adFound = true; // the ad found in the apartment listings
                }
            }
        }
        if (!adFound) {
            throw new Error('Cant find the ad in the apartment listings.')
        }
    } catch(e) {
        throw new Error("validateNewAd | failed in validate new Ad." + e);
    }
}