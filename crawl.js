import { JSDOM } from 'jsdom';

export const normalizeURL = (url) => {
    const urlObj = new URL(url)
    let fullpath = `${urlObj.host}${urlObj.pathname}`
    if(fullpath.slice(-1) === '/') {
        fullpath = fullpath.slice(0, -1)
    }
    return fullpath
}

export const getURLsfromHTML = (html, baseURL) => {
    const urls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
        let href = anchor.getAttribute('href')

        try {
            // convert any relative URLs to absolute URLs
            href = new URL(href, baseURL).href
            urls.push(href)
        } catch(err) {
            console.log(`${err.message}: ${href}`)
        }
        }
    }

    return urls
}

export const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
    
    const currentURLDomain = normalizeURL(currentURL).split('/')[0]
    const baseDomain = normalizeURL(baseURL).split('/')[0] 
    if(currentURLDomain !== baseDomain) return pages
    
    const normalizedCurrentURL = normalizeURL(currentURL);
    
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }
    
    pages[normalizedCurrentURL] = 1 
    
    console.log(`Crawling ${currentURL}...`)
    let response
    try {
        response = await fetch(currentURL)
    } catch (error) {
        throw new Error(`Got Network error: ${error.message}`);
    }
    
    if(!response.ok) {
        console.log('Network response was not OK');
        return pages
    }

    const contentType = response.headers.get('content-type')
    if(!contentType || !contentType.includes('text/html')) {
        console.log('The content type is not an html')
        return pages
    }

    const htmlText = await response.text()
    const nextURLs = getURLsfromHTML(htmlText, baseURL);
    
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }
    
    return pages
};