obj.addEventListener('DOMNodeInserted', onNodeInsert, false);

function onNodeInsert(e) {
    var range    = document.createRange(),
        sel      = window.getSelection(),
        newNode  = e.target,
        tagName  = newNode.tagName.toLowerCase(),
        lnbrNode = document.createElement('br'),
        pNode    = document.createElement('p');

    if (tagName === 'div' && newNode.getAttribute('id') === null) {
        // First we remove the event listener so that it doesn't get triggered again
        this.removeEventListener('DOMNodeInserted', onNodeInsert, false);

        // Creates a p node and removes the div
        newNode.parentNode.replaceChild(pNode, newNode);
        pNode.appendChild(lnbrNode);

        // Places the caret where it belongs
        var placeCursor = function () {
            range.setStart(pNode, 0);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        //placeCursor(); // DOES NOT WORK (cursor disappears)
        setTimeout(placeCursor,1); // WORKS

        //We can restore the event listener now
        this.addEventListener('DOMNodeInserted', onNodeInsert, false);
    }
}
