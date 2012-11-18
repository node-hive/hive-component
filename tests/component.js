var tap = require('tap');
var path = require('path');
var hc = require('./../index');
var Tags = require("./../test_resources/tags");
var _DEBUG = true;
var util = require('util');

if (false) tap.test('configuration', function (t) {

	hc({}, {a: 1, b: 2}, function (err, h) {

		if (_DEBUG) console.log('component: %s', util.inspect(h));

		if (err) {
			throw err;
		}

		if (!h) {
			throw new Error('no component returned!');
		}
		t.equals(h.get_config('a'), 1, 'INJECT: a is 1');
		t.end();
	});

})

if (false) tap.test('configuration with path', function (t) {
	hc({}, path.resolve(__dirname, '../test_resources/hc/config.json'), function (err, h) {
		if (err) {
			throw err;
		}

		if (!h) {
			throw new Error('no component returned!');
		}

		if (err) console.log(err);
		t.equals(h.get_config('a'), 2, 'JSON: a is 2')
		t.end();
	});
})

if (false) tap.test('init', function (t) {

	hc({}, {a: 1, b: 2}, function (err, hc) {
		t.equals(hc.get_config('a'), 1, 'init - a is 1');
		hc.init(function () {
				t.equals(hc.get_config('a'), 3, 'wf1 - a is 3');
				t.equals(hc.get_config('b'), 6, 'wf2 - b is 6')
				t.end();
			},
			[
				function (cb) {
					this.config().set('a', 3);
					cb();

				}
				, function (cb) {
				this.config().set('b', this.get_config('a') * 2);
				cb();
			}
			]

		)
	})
})
//	console.log('tags: %s', util.inspect(tags));

tap.test('tags', function (t) {
	Tags(['foo', 'bar'],
		function (err, tags) {
			console.log('tags object: %s', util.inspect(tags, false, 4));
			console.log('init tasks: %s', util.inspect(tags.get_config('init_tasks')));
			tags.init(function () {
				t.ok(tags.has('foo'), 'tags has foo');

				t.ok(!tags.has('zoo'), 'tags does not have zoo');
				t.deepEqual(tags.tags(), ['bar', 'foo'], 'manifest of tags 1')
				tags.add_tag('zoo');
				t.ok(tags.has('zoo'), 'tags does not have zoo');

				t.deepEqual(tags.tags(), ['bar', 'foo', 'zoo'], 'manifest of tags 2');

				t.end();
			});
		}) // end test
});