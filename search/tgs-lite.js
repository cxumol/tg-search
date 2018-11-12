//$(".loadmsg").load("messages.html .history");

maxPages=1000; // up to messages999.html
tgsIndex = {};
isAllLoaded = false;
foundIndex = {};
pathPrefix = 'messages'

function loadAll() {

    var loadPageOKcallBack = function(msgDOMlist, pageNum){
        console.log( msgDOMlist.children('.message.default').length + " messages loaded." );
        tgsIndex[pageNum] = genIndexMsg(msgDOMlist.children('.message.default'));
        // delete msgDOMlist;
      }

    // https://stackoverflow.com/a/7486008 to test if page/file exists for the moment
    function isPageExists(pageNum) {
        $.ajax({
            type: 'HEAD',
            async: false,
            url: pathPrefix+pageNum+".html",
            success: function() {
                let msgDOMlist = $('<div><\div>').load(pathPrefix+pageNum+".html .history>div", function () {loadPageOKcallBack(msgDOMlist, pageNum)} );
            },  
            error: function() {
                console.log('All pages loaded.');
                isAllLoaded = true;
            }
        });
    }
    
    // For fisrt messages page
    let msgDOMlist = $('<div><\div>').load(pathPrefix+".html .history>div", function () {loadPageOKcallBack(msgDOMlist, 1)} );

    // For messages2+ .html
    // for (let pageNum = 2; pageNum < maxPages; pageNum++) {
    //     isPageExists(pageNum);
    //     if ( isAllLoaded == true) break;
    // }

    let pageNum = 2;
    while (pageNum<=maxPages) {
        pageNum += 1;
        isPageExists(pageNum);
        if (isAllLoaded) break;
    }
}





function genIndexMsg(msgElms) {
    //if ( msgElms === void 0 ) msgElms = '';
    var elms = [];
    msgElms.each(function () {
        elms.push({
            id: $(this).attr('id'),
            date: $(this).children('.body').children('.date').attr('title'),
            from: $(this).children('.body').children('.from_name').text().trim(),
            txt: $(this).children('.body').children('.text').text().trim()
        });
    });
    return elms
};


// ref https://github.com/docsifyjs/docsify/blob/master/lib/plugins/search.js search()
function search(query) { 
    query = query.trim();
    var keywords = query.split(/[\s\-，\\/]+/);
    if (keywords.length !== 1) {
        keywords = [].concat(query, keywords);
    }
    var allMatchMsg={};
    function findFrom(idx){
        var pageContent = tgsIndex[idx];
        var pageMatchMsg = [];
        keywords.forEach(kw => {
            // From https://github.com/sindresorhus/escape-string-regexp
            var regEx = new RegExp(kw.replace(/[|\\{}()[\]^$+*?.]/g,
            '\\$&'),'gi'); 
            

            // ref https://github.com/ppoffice/hexo-theme-icarus/blob/master/source/js/insight.js weight()
            var pattern = new RegExp(kw, 'img'); // Global, Multi-line, Case-insensitive
            pageContent.forEach( msg => {
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
    var query = arguments.length ? arguments[0] : $input.val();
    $resultlist.empty();
    if (query.length==0) return;
    var aSearch = search(query);
    for (let i in aSearch) {
        aSearch[i].forEach(SResultEntry => {
            let linkto = i>1? pathPrefix+i+".html#"+SResultEntry.id : pathPrefix+".html#"+SResultEntry.id;
            $resultlist.append([`<div class= "default message" data-url="`, linkto,`"><div class="from_name">`,
            SResultEntry.from ,`</div><div class="text">`, SResultEntry.txt, `</div></div>`].join(''));
        });
    }
    return aSearch;
}

$input = $('#tg-searchbar')
$resultlist = $('.results-list')

function searchBar() {
    $input.on('input', function () {
        var keywords = $(this).val();
        foundIndex = pageShowResults(keywords);
    });
    $input.trigger('input');
}

function previewLoader ($item) {
    if ($item && $item.length) {
        let dataUrl = $item.attr('data-url').split('#');
        let filename = dataUrl[0];
        let msgShowId = dataUrl[1];
        let $pageLoad = $('<div><\div>').load(filename + " .history>div", displayMsg);

        console.log(msgShowId+" selected!");

        // https://stackoverflow.com/a/32102391
        function displayMsg() {

            let chosenOne = $pageLoad.children("#"+dataUrl[1]);

            // I didn't find how to select previous (one or two) elements by CSSselector/jQuerySelector
            
            // https://stackoverflow.com/a/12111784
            let $previewColection=$().add(chosenOne.prev().prev()
            ).add(chosenOne.prev()
            ).add(chosenOne.addClass("bold selected")
            ).add(chosenOne.next()
            ).add(chosenOne.next().next()
            ).add(`<a class="pagination block_link" href="`+$item.attr('data-url')+`"> <i class="fas fa-hand-point-right"></i> 回原文定位 </a>`
            );

            $(".loadmsg").empty(); // clear old previews

            $(".loadmsg").append($previewColection);

            // $(".loadmsg").load(filename + " .history>div #"+dataUrl[1]+" + div,.history>div #"+dataUrl[1]+" + div + div");

            console.log("preview loaded.")
        }
        
    }
}

function resultPreviewer() {
    $('.results-list').on('click touchend', '.message', function (e) {

        $('.results-list').find('.selected').removeClass('selected'); // clear old selected mark

        // if (e.type !== 'click' && !touch) {
        //     return;
        // }

        $(this).addClass('selected'); // setup new selected mark
        previewLoader($(this));

        touch = false;
    })
}

loadAll();
searchBar();
resultPreviewer();







// pageShowResults("群");

// var testSearch = search("群");

