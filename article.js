require(['../src/readable'], function(Readable) {

    var reader = new Readable({
        id: "Test article",
        wordCount : 920,
        el: document.getElementById('article')
    });

    reader.init();
});