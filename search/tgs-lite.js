maxPages = 1000; // up to messages999.html
tgsIndex = {};

foundIndex = {};
pathPrefix = 'messages'
THREAD_NUM = 5

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

async function loadFile(fileName) {
    return fetch(fileName).then(checkStatus).then(resp => resp.text()).then(text => {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = text;
        return newDiv.getElementsByClassName('message default')
    })
}

function loadAll() {
    Array(THREAD_NUM).fill().map((_, t) => {
        let messageIndexArray = Array(maxPages / THREAD_NUM).fill().map((_, i) => i * THREAD_NUM + t + 1);
        messageIndexArray.reduce(async (previousValue, currentValue) => {
            try {
                await previousValue
                return loadPage(currentValue)
            } catch (error) {
                // hit the end
                return Promise.reject();
            }
        }, Promise.resolve())
    })


    async function loadPage(pageNum) {
        let fileName = pageNum === 1 ? pathPrefix + '.html' : pathPrefix + pageNum + '.html';
        return loadFile(fileName).then(msgList => getIndexMessage(msgList))
            .then(x => {
                tgsIndex[pageNum] = x;
            })
    }
}


function getIndexMessage(msgDivs) {
    var res = [];
    for (let msg of msgDivs) {
        res.push({
            id: msg.getAttribute('id'),
            ...extractMessageDate(msg)
        })
    }
    return res;
}


function extractMessageDate(msgDiv) {
    let bodyDiv = msgDiv.getElementsByClassName('body')[0];
    let res = {
        date: bodyDiv.getElementsByClassName('date')[0].getAttribute('title'),
        from: getInnerText(bodyDiv.getElementsByClassName('from_name')[0]),
        txt: getInnerText(bodyDiv.getElementsByClassName('text')[0]),
    }
    return res
}

function getInnerText(x) {
    return x ? x.innerText.trim() : '';
}


// ref https://github.com/docsifyjs/docsify/blob/master/lib/plugins/search.js search()
function search(query) {
    query = query.trim();
    var keywords = query.split(/[\s\-，\\/]+/);
    if (keywords.length !== 1) {
        keywords = [].concat(query, keywords);
    }
    var allMatchMsg = {};
    function findFrom(idx) {
        var pageContent = tgsIndex[idx];
        var pageMatchMsg = [];
        keywords.forEach(kw => {
            // From https://github.com/sindresorhus/escape-string-regexp
            var regEx = new RegExp(kw.replace(/[|\\{}()[\]^$+*?.]/g,
                '\\$&'), 'gi');


            // ref https://github.com/ppoffice/hexo-theme-icarus/blob/master/source/js/insight.js weight()
            var pattern = new RegExp(kw, 'img'); // Global, Multi-line, Case-insensitive
            pageContent.forEach(msg => {
                var matches = msg['txt'].match(kw); // return ["keywords1"]
                if (matches) pageMatchMsg.push(msg);
            })
        });
        return pageMatchMsg;
    }

    for (const pageNum in tgsIndex) {
        if (tgsIndex.hasOwnProperty(pageNum)) {
            allMatchMsg[pageNum] = findFrom(pageNum) // summary of results found in pages
        }
    }
    return allMatchMsg;
}


function pageShowResults() {
    var query = arguments.length ? arguments[0] : searchBar.value;
    resultList.innerHTML = ''//todo: maybe we could diff the dom, and do not rerender each time
    if (query.length == 0) return;
    var aSearch = search(query);
    for (let i in aSearch) {
        aSearch[i].forEach(SResultEntry => {
            let linkto = i > 1 ? pathPrefix + i + ".html#" + SResultEntry.id : pathPrefix + ".html#" + SResultEntry.id;
            var child = document.createElement('div');
            child.innerHTML = `<div class= "default message" data-url="${linkto}"><div class="from_name">${SResultEntry.from}</div><div class="text">${SResultEntry.txt}</div></div>`;

            resultList.appendChild(child.firstChild);
        });
    }
    return aSearch;
}


function initSearchBarTrigger() {
    searchBar = document.getElementById('tg-searchbar')
    searchBar.addEventListener('input', () => {
        foundIndex = pageShowResults(searchBar.value);
    })
}


function previewLoader(item) {

    let dataUrl = item.getAttribute('data-url').split('#');
    let filename = dataUrl[0];
    let msgShowId = dataUrl[1];
    loadFile(filename).then(msgList => displayMessage(msgList, filename, msgShowId))


    function displayMessage(msgList, filename, messageId) {
        let index = Array.prototype.findIndex.call(msgList, (x) => x.id == messageId)
        msgList[index].classList.add('bold')
        msgList[index].classList.add('selected')
        showItems = Array.prototype.slice.call(msgList, index - 3 < 0 ? 0 : index - 3, index + 5)
        const documentFragment = document.createDocumentFragment();
        showItems.forEach(c => documentFragment.appendChild(c));
        let jumpButton = document.createRange().createContextualFragment(`<a class="pagination block_link" href="${filename}#${messageId}"> <i class="fas fa-hand-point-right"></i> 回原文定位 </a>`);
        documentFragment.appendChild(jumpButton)
        document.getElementById('loadmsg').innerHTML = ''
        document.getElementById('loadmsg').appendChild(documentFragment);
    }

}




function initResultPreviewer() {
    resultList.addEventListener('click', (event) => {
        let selectedItem = resultList.getElementsByClassName('selected')
        if (selectedItem.length > 0) {
            selectedItem[0].classList.remove('selected')
        }

        // ref https://stackoverflow.com/a/39245638
        let path = event.path || (event.composedPath && event.composedPath());
        for (let e of path) {
            if (e.classList.contains('message')) {
                e.classList.add('selected');
                previewLoader(e)
                break;
            }
        }
    })

}


resultList = document.getElementById('results-list')
initResultPreviewer()
initSearchBarTrigger()
loadAll();
