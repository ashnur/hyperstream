var test = require('tap').test;
var concat = require('concat-stream');
var through = require('through');
var hyperstream = require('../');

test('function before a stream', function (t) {
    t.plan(1);
    var SIZE = 50;
    var stream = through();
    
    var hs = hyperstream({
        '.a': function () { return Array(SIZE).join('THEBEST') },
        '.b': stream
    });
    var rs = through();
    rs.pipe(hs).pipe(concat(function (err, src) {
        t.equal(src, [
            '<div class="a">' + Array(SIZE).join('THEBEST') + '</div>',
            '<div class="b">onetwothreefourfive</div>'
        ].join(''));
    }));;
    rs.queue('<div class="a"></div><div class="b"></div>');
    rs.queue(null);
    
    setTimeout(function () {
        stream.queue('one');
        stream.queue('two');
    }, 25);
    setTimeout(function () {
        stream.queue('three');
    }, 50);
    setTimeout(function () {
        stream.queue('four');
        stream.queue('five');
        stream.queue(null);
    }, 75);
});
