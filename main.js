import { argv } from 'node:process'
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

const main = async () => {
    let arg = []
    argv.forEach(element => {
        arg.push(element)
    });
    const baseURL = arg.slice(2)
    if(baseURL.length < 1 || baseURL.length > 1) {
        console.error('error')
        return
    } else{
        console.log(`starting crawl of: ${baseURL[0]}...`)
        const pages = await crawlPage(baseURL, baseURL, {})
        printReport(pages)
    } 
    
}

main()