import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest"
import { getBrowser, setCookies } from "./utils/puppetier"
import { Browser, Page } from "puppeteer"
import { getAudioSrc, getTypeTextInChallengeInput, goToFistLesson, InputMethod, isListenTapLesson, isSelectTranscription, nextLesson, selectChoice, setPlayerInputMethod, skipLesson, typeTextInChallengeInput } from "./utils/duolingo"
import { sleep } from "radashi"

describe("test", ()=>{
    let browser: Browser
    let page: Page

    beforeAll(async ()=>{
        browser = await getBrowser()
    })

    afterAll(async ()=>{
        await browser.close()
    })

    beforeEach(async ()=>{
        page = await browser.newPage();
        await setCookies(page)
    })

  it("should make a text", async ()=>{

 const repostasRespondidas = new Map<string, string>()
let find = false
       await goToFistLesson(page) 

       do {
     // click body 
    await page.click('body')
    if (await isListenTapLesson(page)) {
      await setPlayerInputMethod(page, "keyboard")
      const audioSrc = await getAudioSrc(page)

      if (!audioSrc) {
        throw new Error('Could not find audio src');
      }

      if (repostasRespondidas.has(audioSrc)) {
        const typeText = await getTypeTextInChallengeInput(page)
        expect(repostasRespondidas.get(audioSrc)).toBe(typeText)
        find = true
        // sleep(10000000)
      } else {
        const text = "hello"
        await typeTextInChallengeInput(page, text)
        repostasRespondidas.set(audioSrc, text)
        await nextLesson(page)
        await nextLesson(page)
      }

      await sleep(1000)
    } else if (await isSelectTranscription(page)) {
      await selectChoice(page)
      await nextLesson(page)
    sleep(100)
      await nextLesson(page)
    } else {
      await skipLesson(page)

      await nextLesson(page)
    } 

    // await 100ms 
    await sleep(100)

  } while (!find)

    expect("hello").toBe("hello")
  })
})