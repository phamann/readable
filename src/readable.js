define(function () {

    /**
     * Readbale constructor
     * @param {Object} config Global config options hash
     */
    function Readable(config) {

        var that = this,
            el = config.el,
            id = config.id,
            PATH = "/px.gif",
            START = new Date().getTime(),
            WORDCOUNT = config.wordCount,
            VIEWPORT = window.innerHeight,
            WPM = 200; //Average words per minute

        this.timer = {
            startTime: new Date().getTime(),
            time : 0,
            started: false,
            instance : function() {
                that.timer.time += 100;
                var diff = (new Date().getTime() - that.timer.startTime) - that.timer.time;
                window.setTimeout(that.timer.instance, (100 - diff));
            },
            start: function() {
                window.setTimeout(that.timer.instance, 100);
                that.timer.started = true;
            }
        };

        this.articleIsInViewport = function(el) {
          var rect = el.getBoundingClientRect();
            return rect.top < (window.innerHeight || document.body.clientHeight) && rect.left < (window.innerWidth || document.body.clientWidth);
        };

        this.timeOnPage = function() {
            return new Date().getTime() - START;
        };

        this.percentageRead = function() {
            var elapsedWords = Math.round((WPM/60000)*this.timer.time),
                words = (elapsedWords > WORDCOUNT) ? WORDCOUNT : elapsedWords;
            return Math.round(words/(WORDCOUNT/100));
        };

        this.makeUrl = function(data) {
            return PATH + '?reading=' + this.encode(JSON.stringify(data));
        };

        this.createImage = function(url) {
            var image = new Image();
            image.className = 'h';
            image.src = url;
            document.body.appendChild(image);
        };

        this.encode = function(str) { // https://gist.github.com/3912229
            var encodedStr = encodeURIComponent(str),
                table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            for (var bits = '', i = 0; i < str.length; i++) {
                bits += ('000' + str.charCodeAt(i).toString(4)).slice(-4);
            }
            bits += '000'.slice(bits.length % 3 || 3);
            for (var data = '', j = 0; j < bits.length; ) {
                data += table.charAt(parseInt(bits.slice(j, j += 3), 4));
            }
            return data += '===='.slice(data.length % 4 || 4);
        },

        this.log = function() {
            var data = {
                "id" : id,
                "timeOnPage"    : this.timeOnPage(),
                "timeReading"   : this.timer.time,
                "percentageRead": this.percentageRead()
            };

            var url = this.makeUrl(data);
            console.log(url);
            this.createImage(url);
        };

        this.init = function() {
            // Check every second if page has scrolled
            var currentScroll = window.pageYOffset;
            setInterval(function() {
                //If scroll position has moved
                if (window.pageYOffset !== currentScroll) {
                    currentScroll = window.pageYOffset;
                    
                    //If the element is now in viewport and timer not started
                    if(that.articleIsInViewport.call(that, el) && !that.timer.started) {
                        that.timer.start();
                        window.onbeforeunload = function(e) {
                            that.log.call(that);
                        };
                    }
                }
            }, 1000);
        };
    }

    return Readable;
});
