export const printReport = (pages) => {
    console.log('=========================')
    console.log('REPORT')
    console.log('=========================')
    const sortedPages = sortPages(pages)
    for (const page of sortedPages) {
        const count = page[1]
        const url = page[0]
        console.log(`Found ${count} internal links to ${url}`)
    }
    console.log('=========================')
    console.log('END OF REPORT')
    console.log('=========================')
}

export const sortPages = (pages) => {
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        return b[1] - a[1]
    })
    return pagesArr
}