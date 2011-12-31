/**
 * WARNING: this is generated code and will be lost if changes are made.
 * This generated source code is Copyright (c) 2010-2011 by Appcelerator, Inc. All Rights Reserved.
 */

var require={
	analytics: true,
	app: {
		copyright: "2009 by nwright",
		description: "No description provided",
		guid: "6fe33f33fd1f4e95a06d2d217170866d",
		id: "KitchenSink",
		name: "KitchenSink",
		publisher: "nwright",
		url: "http://www.appcelerator.com",
		version: "1.0"
	},
	deployType: "development",
	project: {
		id: "com.appcelerator.titanium",
		name: "KitchenSink"
	},
	ti: {
		version: "1.9.0.v20111228180134"
	},
	vendorPrefixes: {
		css: ["", "-webkit-", "-moz-", "-ms-", "-o-", "-khtml-"],
		dom: ["", "Webkit", "Moz", "ms", "O", "Khtml"]
	}
};
/**
 * This file contains source code from the following:
 *
 * Dojo Toolkit
 * Copyright (c) 2005-2011, The Dojo Foundation
 * New BSD License
 * <http://dojotoolkit.org>
 *
 * require.js
 * Copyright (c) 2010-2011, The Dojo Foundation
 * New BSD License / MIT License
 * <http://requirejs.org>
 * 
 * curl.js
 * Copyright (c) 2011 unscriptable.com / John Hann
 * MIT License
 * <https://github.com/unscriptable/curl>
 */

(function (global) {

	"use strict";

	var // misc variables
		x,
		odp,
		doc = global.document,
		el = doc.createElement("div"),

		// cached useful regexes
		commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,
		cjsRequireRegExp = /[^.]require\(\s*["']([^'"\s]+)["']\s*\)/g,
		reservedModuleIdsRegExp = /exports|module/,

		// the global config settings
		cfg = global.require || {},

		// shortened packagePaths variable
		pp = cfg.packagePaths || {},

		// the number of seconds to wait for a script to load before timing out
		waitSeconds = (cfg.waitSeconds || 7) * 1000,

		baseUrl = cfg.baseUrl || "./",

		// CommonJS paths
		paths = cfg.paths || {},

		// feature detection results initialize by pre-calculated tests
		hasCache = cfg.hasCache || {},

		// a queue of module definitions to evaluate once a module has loaded
		defQ = [],

		// map of module ids to functions containing an entire module, which could
		// include multiple defines. when a dependency is not defined, the loader
		// will check the cache to see if it exists first before fetching from the
		// server. this is used when the build system bundles modules into the
		// minified javascript files.
		defCache = {},

		// map of package names to package resource definitions
		packages = {},

		// map of module ids to module resource definitions that are being loaded and processed
		waiting = {},

		// map of module ids to module resource definitions
		modules = {},

		// mixin of common functions
		fnMixin;

	/******************************************************************************
	 * Utility functions
	 *****************************************************************************/

	function _mix(dest, src) {
		for (var p in src) {
			src.hasOwnProperty(p) && (dest[p] = src[p]);
		}
		return dest;
	}

	function mix(dest) {
		// summary:
		//		Copies properties by reference from a source object to a destination
		//		object, then returns the destination object. To be clear, this will
		//		modify the dest being passed in.
		var i = 1;
		dest || (dest = {});
		while (i < arguments.length) {
			_mix(dest, arguments[i++]);
		}
		return dest;
	}

	function each(a, fn) {
		// summary:
		//		Loops through each element of an array and passes it to a callback
		//		function.
		var i = 0,
			l = (a && a.length) || 0,
			args = Array.prototype.slice.call(arguments, 0);
		args.shift();
		while (i < l) {
			args[0] = a[i++];
			fn.apply(null, args);
		}
	}

	function is(it, type) {
		// summary:
		//		Tests if anything is a specific type.
		return ({}).toString.call(it).indexOf('[object ' + type) === 0;
	}

	function isEmpty(it) {
		// summary:
		//		Checks if an object is empty.
		var p;
		for (p in it) {
			break;
		}
		return !it || (!it.call && !p);
	}

	function evaluate(code, sandboxVariables, globally) {
		// summary:
		//		Evaluates code globally or in a sandbox.
		//
		// code: String
		//		The code to evaluate
		//
		// sandboxVariables: Object?
		//		When "globally" is false, an object of names => values to initialize in
		//		the sandbox. The variable names must NOT contain '-' characters.
		//
		// globally: Boolean?
		//		When true, evaluates the code in the global namespace, generally "window".
		//		If false, then it will evaluate the code in a sandbox.

		var i,
			vars = [],
			vals = [],
			r;

		if (globally) {
			r = global.eval(code);
		} else {
			for (i in sandboxVariables) {
				vars.push(i + "=__vars." + i);
				vals.push(i + ":" + i);
			}
			r = (new Function("__vars", (vars.length ? "var " + vars.join(',') + ";\n" : "") + code + "\n;return {" + vals.join(',') + "};"))(sandboxVariables);
		}

		// if the last line of a module is a console.*() call, Firebug for some reason
		// sometimes returns "_firebugIgnore" instead of undefined or null
		return r === "_firebugIgnore" ? null : r;
	}

	function compactPath(path) {
		var result = [],
			segment,
			lastSegment;
		path = path.replace(/\\/g, '/').split('/');
		while (path.length) {
			segment = path.shift();
			if (segment === ".." && result.length && lastSegment !== "..") {
				result.pop();
				lastSegment = result[result.length - 1];
			} else if (segment !== ".") {
				result.push(lastSegment = segment);
			}
		}
		return result.join("/");
	}

	/******************************************************************************
	 * has() feature detection
	 *****************************************************************************/

	function has(name) {
		// summary:
		//		Determines of a specific feature is supported.
		//
		// name: String
		//		The name of the test.
		//
		// returns: Boolean (truthy/falsey)
		//		Whether or not the feature has been detected.

		if (is(hasCache[name], "Function")) {
			hasCache[name] = hasCache[name](global, doc, el);
		}
		return hasCache[name];
	}

	has.add = function (name, test, now, force){
		// summary:
		//		Adds a feature test.
		//
		// name: String
		//		The name of the test.
		//
		// test: Function
		//		The function that tests for a feature.
		//
		// now: Boolean?
		//		If true, runs the test immediately.
		//
		// force: Boolean?
		//		If true, forces the test to override an existing test.

		if (hasCache[name] === undefined || force) {
			hasCache[name] = test;
		}
		return now && has(name);
	};

	/******************************************************************************
	 * Event handling
	 *****************************************************************************/

	function on(target, type, listener) {
		// summary:
		//		Connects a listener to an event on the specified target.

		if (type.call) {
			// event handler function
			return type.call(target, listener);
		}

		// TODO: fix touch events?

		target.addEventListener(type, listener, false);
		return function () {
			target.removeEventListener(type, listener, false);
		};
	}

	on.once = function (target, type, listener) {
		var h = on(target, type, function () {
			h && h(); // do the disconnect
			return listener.apply(this, arguments);
		});
		return h;
	};

	/******************************************************************************
	 * Configuration processing
	 *****************************************************************************/

	// make sure baseUrl ends with a slash
	if (!/\/$/.test(baseUrl)) {
		baseUrl += "/";
	}

	function configPackage(/*String|Object*/pkg, /*String?*/dir) {
		// summary:
		//		An internal helper function to configure a package and add it to the array
		//		of packages.
		//
		// pkg: String|Object
		//		The name of the package (if a string) or an object containing at a minimum
		//		the package's name, but possibly also the package's location and main
		//		source file
		//
		// dir: String?
		//		Optional. A base URL to prepend to the package location

		pkg = pkg.name ? pkg : { name: pkg };
		pkg.location = (/(^\/)|(\:)/.test(dir) ? dir : "") + (pkg.location || pkg.name);
		pkg.main = (pkg.main || "main").replace(/(^\.\/)|(\.js$)/, "");
		packages[pkg.name] = pkg;
	}

	// first init all packages from the config
	each(cfg.packages, configPackage);

	// second init all package paths and their packages from the config
	for (x in pp) {
		each(pp[x], configPackage, x + "/");
	}

	// run all feature detection tests
	for (x in cfg.has) {
		has.add(x, cfg.has[x], 0, true);
	}

	/******************************************************************************
	 * Module functionality
	 *****************************************************************************/

	function ResourceDef(name, refModule, deps, rawDef) {
		// summary:
		//		A resource definition that describes a file or module being loaded.
		//
		// description:
		//		A resource is anything that is "required" such as applications calling
		//		require() or a define() with dependencies.
		//
		//		This loader supports resources that define multiple modules, hence this
		//		object.
		//
		//		In addition, this object tracks the state of the resource (loaded,
		//		executed, etc) as well as loads a resource and executes the defintions.
		//
		// name: String
		//		The module id.
		//
		// deps: Array?
		//		An array of dependencies.
		//
		// rawDef: Object? | Function? | String?
		//		The object, function, or string that defines the resource.
		//
		// refModule: Object?
		//		A reference map used for resolving module URLs.

		var match = name && name.match(/^(.+?)\!(.*)$/),
			isRelative = /^\./.test(name),
			exports = {},
			pkg = null,
			cjs,
			_t = this;

		// name could be:
		//  - a plugin		text!/some/file.html or include!/some/file.js
		//  - a module		some/module, ../some/module
		//  - a js file		/some/file.js
		//  - a url			http://www.google.com/

		_t.name = name;
		_t.deps = deps || [];
		_t.plugin = null;
		_t.callbacks = [];

		if (!match && (/(^\/)|(\:)|(\.js$)/.test(name) || (isRelative && !refModule))) {
			_t.url = name;
		} else {
			if (match) {
				_t.plugin = _t.deps.length;
				_t.pluginArgs = match[2];
				_t.pluginCfg = cfg[match[1]];
				_t.deps.push(match[1]);
			} else if (name) {
				name = _t.name = compactPath((isRelative ? refModule.name + "/../" : "") + name);

				if (/^\./.test(name)) {
					throw new Error("Irrational path \"" + name + "\"");
				}

				// TODO: if this is a package, then we need to transform the URL into the module's path
				// MUST set pkg to anything other than null, even if this module isn't in a package
				pkg = "";

				/(^\/)|(\:)/.test(name) || (name = baseUrl + name);

				_t.url = name + ".js";
			}
		}

		_t.pkg = pkg;
		_t.rawDef = rawDef;
		_t.loaded = !!rawDef;
		_t.refModule = refModule;

		// our scoped require()
		function scopedRequire() {
			var args = Array.prototype.slice.call(arguments, 0);
			args.length > 1 || (args[1] = 0);
			args[2] = _t;
			return req.apply(null, args);
		}
		scopedRequire.toUrl = function () {
			var args = Array.prototype.slice.call(arguments, 0);
			_t.plugin === null && (args[1] = _t);
			return toUrl.apply(null, args);
		};
		mix(scopedRequire, fnMixin, {
			cache: req.cache
		});

		_t.cjs = {
			require: scopedRequire,
			exports: exports,
			module: {
				exports: exports
			}
		};
	}

	ResourceDef.prototype.load = function (sync, callback) {
		// summary:
		//		Retreives a remote script and inject it either by XHR (sync) or attaching
		//		a script tag to the DOM (async).
		//
		// sync: Boolean
		//		If true, uses XHR, otherwise uses a script tag.
		//
		// callback: Function?
		//		A function to call when sync is false and the script tag loads.

		var s,
			x,
			disconnector,
			_t = this,
			cached = defCache[_t.name],
			fireCallbacks = function () {
				each(_t.callbacks, function (c) { c(_t); });
			},
			onLoad = function (rawDef) {
				_t.loaded = 1;
				if (_t.rawDef = rawDef) {
					if (is(rawDef, "String")) {
						// if rawDef is a string, then it's either a cached string or xhr response
						if (/\.js$/.test(_t.url)) {
							rawDef = evaluate(rawDef, _t.cjs);
							_t.def = _t.rawDef = !isEmpty(rawDef.exports) ? rawDef.exports : (rawDef.module && !isEmpty(rawDef.module.exports) ? rawDef.module.exports : null);
							_t.def === null && (_t.rawDef = rawDef);
						} else {
							_t.def = rawDef;
							_t.executed = 1;
						}
					} else if (is(rawDef, "Function")) {
						// if rawDef is a function, then it's a cached module definition
						waiting[_t.name] = _t;
						rawDef();
					}
				}
				processDefQ(_t);
				fireCallbacks();
				return 1;
			};

		_t.sync = sync;
		callback && _t.callbacks.push(callback);

		// if we don't have a url, then I suppose we're loaded
		if (!_t.url) {
			_t.loaded = 1;
			fireCallbacks();
			return;
		}

		// if we're already waiting, then we can just return and our callback will be fired
		if (waiting[_t.name]) {
			return;
		}

		// if we're already loaded or the definition has been cached, then just return now
		if (_t.loaded || cached) {
			return onLoad(cached);
		}

		// mark this module as waiting to be loaded so that anonymous modules can be
		// identified
		waiting[_t.name] = _t;

		if (sync) {
			x = new XMLHttpRequest();
			x.open("GET", _t.url, false);
			x.send(null);

			if (x.status === 200) {
				return onLoad(x.responseText);
			} else {
				throw new Error("Failed to load module \"" + _t.name + "\": " + x.status);
			}
		} else {
			// insert the script tag, attach onload, wait
			x = _t.node = doc.createElement("script");
			x.type = "text/javascript";
			x.charset = "utf-8";
			x.async = true;

			disconnector = on(x, "load", function (e) {
				e = e || global.event;
				var node = e.target || e.srcElement;
				if (e.type === "load" || /complete|loaded/.test(node.readyState)) {
					disconnector();
					onLoad();
				}
			});

			// set the source url last
			x.src = _t.url;

			s = doc.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(x, s);
		}
	};

	ResourceDef.prototype.execute = function (callback) {
		// summary:
		//		Executes the resource's rawDef which defines the module.
		//
		// callback: Function?
		//		A function to call after the module has been executed.

		var _t = this;

		if (_t.executed) {
			callback && callback();
			return;
		}

		// first need to make sure we have all the deps loaded
		fetch(_t.deps, function (deps) {
			var i,
				p,
				r = _t.rawDef,
				q = defQ.slice(0), // backup the defQ
				finish = function () {
					_t.executed = 1;
					callback && callback();
				};

			// need to wipe out the defQ
			defQ = [];

			// make sure we have ourself in the waiting queue
			//waiting[_t.name] = _t;

			_t.def = _t.def
				||	(r && (is(r, "String")
						? evaluate(r, _t.cjs)
						: is(r, "Function")
							? r.apply(null, deps)
							: is(r, "Object")
								? (function (obj, vars) {
										for (var i in vars){
											this[i] = vars[i];
										}
										return obj;
									}).call({}, r, _t.cjs)
								: null
						)
					)
				||	_t.cjs.exports;

			// we might have just executed code above that could have caused a couple
			// define()'s to queue up
			processDefQ(_t);

			// restore the defQ
			defQ = q;

			// if plugin is not null, then it's the index in the deps array of the plugin
			// to invoke
			if (_t.plugin !== null) {
				p = deps[_t.plugin];

				// the plugin's content is dynamic, so just remove from the module cache
				if (p.dynamic) {
					delete modules[_t.name];
				}

				// if the plugin has a load function, then invoke it!
				p.load && p.load(_t.pluginArgs, _t.cjs.require, function (v) {
					_t.def = v;
					finish();
				}, _t.pluginCfg);
			}

			finish();
		}, function (ex) {
			throw ex;
		}, _t.refModule, _t.sync);
	};

	function getResourceDef(name, refModule, deps, rawDef, dontCache) {
		// summary:
		//		Creates a new resource definition or returns an existing one from cache.

		var module = new ResourceDef(name, refModule, deps, rawDef);

		if (name in module.cjs) {
			module.def = module[name];
			module.loaded = module.executed = 1;
			return module;
		}

		return dontCache ? module : (module.name ? modules[module.name] || (modules[module.name] = module) : module);
	}

	function processDefQ(module) {
		// summary:
		//		Executes all modules sitting in the define queue.
		//
		// description:
		//		When a resource is loaded, the remote AMD resource is fetched, it's
		//		possible that one of the define() calls was anonymous, so it should
		//		be sitting in the defQ waiting to be executed.

		var m,
			q = defQ.slice(0);
		defQ = [];

		while (q.length) {
			m = q.shift();

			// if the module is anonymous, assume this module's name
			m.name || (m.name = module.name);

			// if the module is this module, then modify this 
			if (m.name === module.name) {
				modules[m.name] = module;
				module.deps = m.deps;
				module.rawDef = m.rawDef;
				module.execute();
			} else {
				modules[m.name] = m;
				m.execute();
			}
		}

		delete waiting[module.name];
	}

	function fetch(deps, success, failure, refModule, sync) {
		// summary:
		//		Fetches all dependents and fires callback when finished or on error.
		//
		// description:
		//		The fetch() function will fetch each of the dependents either
		//		synchronously or asynchronously (default).
		//
		// deps: String | Array
		//		A string or array of module ids to load. If deps is a string, load()
		//		returns the module's definition.
		//
		// success: Function?
		//		A callback function fired once the loader successfully loads and evaluates
		//		all dependent modules. The function is passed an ordered array of
		//		dependent module definitions.
		//
		// failure: Function?
		//		A callback function fired when the loader is unable to load a module. The
		//		function is passed the exception.
		//
		// refModule: Object?
		//		A reference map used for resolving module URLs.
		//
		// sync: Boolean?
		//		Forces the async path to be sync.
		//
		// returns: Object | Function
		//		If deps is a string, then it returns the corresponding module definition,
		//		otherwise the require() function.

		var i, l, count, s = is(deps, "String");

		if (s) {
			deps = [deps];
			sync = 1;
		}

		for (i = 0, l = count = deps.length; i < l; i++) {
			deps[i] && (function (idx, name) {
				getResourceDef(deps[idx], refModule).load(!!sync, function (m) {
					m.execute(function () {
						deps[idx] = m.def;
						if (--count === 0) {
							success && success(deps);
							count = -1; // prevent success from being called the 2nd time below
						}
					});
				});
			}(i, deps[i]));
		}

		count === 0 && success && success(deps);
		return s ? deps[0] : deps;
	}

	function def(name, deps, rawDef) {
		// summary:
		//		Used to define a module and it's dependencies.
		//
		// description:
		//		Defines a module. If the module has any dependencies, the loader will
		//		resolve them before evaluating the module.
		//
		//		If any of the dependencies fail to load or the module definition causes
		//		an error, the entire definition is aborted.
		//
		// name: String|Array?
		//		Optional. The module name (if a string) or array of module IDs (if an array) of the module being defined.
		//
		// deps: Array?
		//		Optional. An array of module IDs that the rawDef being defined requires.
		//
		// rawDef: Object|Function
		//		An object or function that returns an object defining the module.
		//
		// example:
		//		Anonymous module, no deps, object definition.
		//
		//		Loader tries to detect module name, fails and ignores definition if more
		//		unable to determine name or there's already anonymous module tied to the
		//		name found.
		//
		//		If the module name is determined, then the module definition
		//		is immediately defined.
		//
		//		|	define({
		//		|		sq: function (x) { return x * x; }
		//		|	});
		//
		// example:
		//		Anonymous module, no deps, rawDef definition.
		//
		//		Loader tries to detect module name, fails and ignores definition if more
		//		unable to determine name or there's already anonymous module tied to the
		//		name found.
		//
		//		Since no deps, module definition is treated as a CommonJS module and is
		//		passed in passed require, exports, and module arguments, then immediately
		//		evaluated.
		//
		//		|	define(function (require, exports, module) {
		//		|		return {
		//		|			sq: function (x) { return x * x; }
		//		|		};
		//		|	});
		//
		// example:
		//		Named module, no deps, object definition.
		//
		//		Since no deps, the module definition is immediately defined.
		//
		//		|	define("arithmetic", {
		//		|		sq: function (x) { return x * x; }
		//		|	});
		//
		// example:
		//		Named module, no deps, rawDef definition.
		//
		//		Since no deps, module definition is treated as a CommonJS module and is
		//		passed in passed require, exports, and module arguments, then immediately
		//		evaluated.
		//
		//		|	define("arithmetic", function (require, exports, module) {
		//		|		return {
		//		|			sq: function (x) { return x * x; }
		//		|		};
		//		|	});
		//
		// example:
		//		Anonymous module, two deps, object definition.
		//
		//		Loader tries to detect module name, fails and ignores definition if more
		//		unable to determine name or there's already anonymous module tied to the
		//		name found.
		//
		//		If the module name is determined, then the loader will load the two
		//		dependencies, then once the dependencies are loaded, it will evaluate a
		//		function wrapper around the module definition.
		//
		//		|	define(["dep1", "dep2"], {
		//		|		sq: function (x) { return x * x; }
		//		|	});
		//
		// example:
		//		Anonymous module, two deps, function definition.
		//
		//		Loader tries to detect module name, fails and ignores definition if more
		//		unable to determine name or there's already anonymous module tied to the
		//		name found.
		//
		//		If the module name is determined, then the loader will load the two
		//		dependencies, then once the dependencies are loaded, it will evaluate
		//		the rawDef function.
		//
		//		|	define(["dep1", "dep2"], function (dep1, dep2) {
		//		|		return {
		//		|			sq: function (x) { return x * x; }
		//		|		};
		//		|	});
		//
		// example:
		//		Name module, two deps, object definition.
		//
		//		After the two dependencies are loaded, the loader will evaluate a
		//		function wrapper around the module definition.
		//
		//		|	define("arithmetic", ["dep1", "dep2"], {
		//		|		sq: function(x) { return x * x; }
		//		|	});
		//
		// example:
		//		Name module, two deps, function definition.
		//
		//		After the two dependencies are loaded, the loader will evaluate the
		//		function rawDef.
		//
		//		|	define("arithmetic", ["dep1", "dep2"], function (dep1, dep2) {
		//		|		return {
		//		|			sq: function (x) { return x * x; }
		//		|		};
		//		|	});

		var i = ["require"],
			module;

		if (!rawDef) {
			rawDef = deps || name;
			rawDef.length === 1 || i.concat(["exports", "module"]);
			if (typeof name !== "string") {
				deps = deps ? name : i;
				name = 0;
			} else {
				deps = i;
			}
		}

		if (reservedModuleIdsRegExp.test(name)) {
			throw new Error("Not allowed to define reserved module id \"" + name + "\"");
		}

		if (is(rawDef, "Function") && arguments.length === 1) {
			// treat rawDef as CommonJS definition and scan for any requires and add
			// them to the dependencies so that they can be loaded and passed in.
			rawDef.toString()
				.replace(commentRegExp, "")
				.replace(cjsRequireRegExp, function (match, dep) {
					deps.push(dep);
				});
		}

		module = getResourceDef(name, 0, deps, rawDef);

		// if not waiting for this module to be loaded, then the define() call was
		// possibly inline or deferred, so try fulfill dependencies, and define the
		// module right now.
		if (name && !waiting[name]) {
			module.execute();

		// otherwise we are definitely waiting for a script to load, eventhough we
		// may not know the name, we'll know when the script's onload fires.
		} else if (name || !isEmpty(waiting)) {
			defQ.push(module);

		// finally, we we're ask to define something without a name and there's no
		// scripts pending, so there's no way to know what the name is. :(
		} else {
			throw new Error("Unable to define anonymous module");
		}
	}

	// set the "amd" property and advertise supported features
	def.amd = {
		plugins: true
	};

	function toUrl(name, refModule) {
		// summary:
		//		Converts a module name including extension to a URL path.
		//
		// name: String
		//		The module name including extension.
		//
		// returns: String
		//		The fully resolved URL.
		//
		// example:
		//		Returns the URL for a HTML template file.
		//		|	define(function (require) {
		//		|		var templatePath = require.toUrl("./templates/example.html");
		//		|	});

		var	match = name.match(/(.+)(\.[^\/\.]+?)$/),
			module = getResourceDef((match && match[1]) || name, refModule, 0, 0, 1),
			url = module.url;

		module.pkg !== null && (url = url.substring(0, url.length - 3));
		return url + ((match && match[2]) || "");
	}

	function req(deps, callback, refModule) {
		// summary:
		//		Fetches a module, caches its definition, and returns the module. If an
		//		array of modules is specified, then after all of them have been
		//		asynchronously loaded, an optional callback is fired.
		//
		// deps: String | Array
		//		A string or array of strings containing valid module identifiers.
		//
		// callback: Function?
		//		Optional. A function that is fired after all dependencies have been
		//		loaded. Only applicable if deps is an array.
		//
		// refModule: Object?
		//		A reference map used for resolving module URLs.
		//
		// returns: Object | Function
		//		If calling with a string, it will return the corresponding module
		//		definition.
		//
		//		If calling with an array of dependencies and a callback function, the
		//		require() function returns itself.
		//
		// example:
		//		Synchronous call.
		//		|	require("arithmetic").sq(10); // returns 100
		//
		// example:
		//		Asynchronous call.
		//		|	require(["arithmetic", "convert"], function (arithmetic, convert) {
		//		|		convert(arithmetic.sq(10), "fahrenheit", "celsius"); // returns 37.777
		//		|	});

		return fetch(deps, function (deps) {
			callback && callback.apply(null, deps);
		}, function (ex) {
			throw ex;
		}, refModule) || req;
	}

	req.toUrl = toUrl;
	req.config = cfg;
	mix(req, fnMixin = {
		each: each,
		evaluate: evaluate,
		has: has,
		is: is,
		mix: mix,
		on: on
	});

	req.cache = function(subject) {
		// summary:
		//		Copies module definitions into the definition cache.
		//
		// description:
		//		When running a build, the build will call this function and pass in an
		//		object with module id => function. Each function contains the contents
		//		of the module's file.
		//
		//		When a module is required, the loader will first see if the module has
		//		already been defined.  If not, it will then check this cache and execute
		//		the module definition.  Modules not defined or cached will be fetched
		//		remotely.
		//
		// subject: String | Object
		//		When a string, returns the cached object or undefined otherwise an object
		//		with module id => function where each function wraps a module.
		//
		// example:
		//		This shows what build system would generate. You should not need to do this.
		//		|	require.cache({
		//		|		"arithmetic": function () {
		//		|			define(["dep1", "dep2"], function (dep1, dep2) {
		//		|				var api = { sq: function (x) { return x * x; } };
		//		|			});
		//		|		},
		//		|		"my/favorite": function () {
		//		|			define({
		//		|				color: "red",
		//		|				food: "pizza"
		//		|			});
		//		|		}
		//		|	});
		var p, m, re = /^url\:(.+)/;
		if (is(subject, "String")) {
			return defCache[subject];
		} else {
			for (p in subject) {
				m = p.match(re);
				if (m) {
					defCache[toUrl(m[1])] = subject[p];
				} else {
					m = getResourceDef(p, 0, 0, subject[p], 1);
					defCache[m.name] = m.rawDef;
				}
			}
		}
	};

	// expose require() and define() to the global namespace
	global.require = req;
	global.define = def;

}(window));

require.cache({
	"include": function () {
		define(function () {
			var cache = {},
				stack = [];

			return {
				dynamic: true, // prevent the loader from caching the result

				normalize: function (name, normalize) {
					var parts = name.split("!"),
						url = parts[0];
					parts.shift();
					return (/^\./.test(url) ? normalize(url) : url) + (parts.length ? "!" + parts.join("!") : "");
				},

				load: function (name, require, onLoad, config) {
					var c,
						x,
						parts = name.split("!"),
						len = parts.length,
						url,
						sandbox;

					if (sandbox = len > 1 && parts[0] === "sandbox") {
						parts.shift();
						name = parts.join("!");
					}

					url = require.toUrl(/^\//.test(name) ? name : "./" + name, stack.length ? { name: stack[stack.length-1] } : null);
					c = cache[url] || require.cache(url);

					if (!c) {
						x = new XMLHttpRequest();
						x.open("GET", url, false);
						x.send(null);
						if (x.status === 200) {
							c = x.responseText;
						} else {
							throw new Error("Failed to load include \"" + url + "\": " + x.status);
						}
					}

					stack.push(url);
					try {
						require.evaluate(cache[url] = c, 0, !sandbox);
					} catch (e) {
						throw e;
					} finally {
						stack.pop();
					}

					onLoad(c);
				}
			};
		});
	}
});/**
 * This file contains source code from the following:
 *
 * es5-shim
 * Copyright 2009, 2010 Kristopher Michael Kowal
 * MIT License
 * <https://github.com/kriskowal/es5-shim>
 */

(function(global){
	var cfg = require.config,
		is = require.is,
		each = require.is;

	// Object.defineProperty() shim
	if (!Object.defineProperty || !(function (obj) {
			try {
				Object.defineProperty(obj, "x", {});
				return obj.hasOwnProperty("x");
			} catch (e) { }
		}({}))) {
		// add support for Object.defineProperty() thanks to es5-shim
		Object.defineProperty = function defineProperty(obj, prop, desc) {
			if (!obj || (!is(obj, "Object") && !is(obj, "Function") && !is(obj, "Window"))) {
				throw new TypeError("Object.defineProperty called on non-object: " + obj);
			}
			desc = desc || {};
			if (!desc || (!is(desc, "Object") && !is(desc, "Function"))) {
				throw new TypeError("Property description must be an object: " + desc);
			}
	
			if (odp) {
				try {
					return odp.call(Object, obj, prop, desc);
				} catch (e) { }
			}
	
			var op = Object.prototype,
				h = function (o, p) {
					return o.hasOwnProperty(p);
				},
				a = h(op, "__defineGetter__"),
				p = obj.__proto__;
	
			if (h(desc, "value")) {
				if (a && (obj.__lookupGetter__(prop) || obj.__lookupSetter__(prop))) {
					obj.__proto__ = op;
					delete obj[prop];
					obj[prop] = desc.value;
					obj.__proto__ = p;
				} else {
					obj[prop] = desc.value;
				}
			} else {
				if (!a) {
					throw new TypeError("Getters and setters can not be defined on this javascript engine");
				}
				if (h(desc, "get")) {
					defineGetter(obj, prop, desc.get);
				}
				if (h(desc, "set")) {
					defineSetter(obj, prop, desc.set);
				} else {
					obj[prop] = null;
				}
			}
		};
	}

	// console.*() shim	
	typeof console !== "undefined" || (console = {});

	// make sure "log" is always at the end
	each(["debug", "info", "warn", "error", "log"], function (c) {
		console[c] || (console[c] = ("log" in console)
			?	function () {
					var a = Array.apply({}, arguments);
					a.unshift(c + ":");
					console.log(a.join(" "));
				}
			:	function () {}
		);
	});

	// JSON.parse() and JSON.stringify() shim
	if (typeof JSON === "undefined" || JSON.stringify({a:0}, function(k,v){return v||1;}) !== '{"a":1}') {
		function escapeString(s){
			return ('"' + s.replace(/(["\\])/g, '\\$1') + '"').
				replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
				replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
		}
	
		JSON.parse = function (s) {
			return eval('(' + s + ')');
		};
	
		JSON.stringify = function (value, replacer, space) {
			var undef;
			if (is(replacer, "String")) {
				space = replacer;
				replacer = null;
			}
	
			function stringify(it, indent, key) {
				var val,
					len,
					objtype = typeof it,
					nextIndent = space ? (indent + space) : "",
					sep = space ? " " : "",
					newLine = space ? "\n" : "",
					ar = [];
	
				if (replacer) {
					it = replacer(key, it);
				}
				if (objtype === "number") {
					return isFinite(it) ? it + "" : "null";
				}
				if (is(objtype, "Boolean")) {
					return it + "";
				}
				if (it === null) {
					return "null";
				}
				if (is(it, "String")) {
					return escapeString(it);
				}
				if (objtype === "function" || objtype === "undefined") {
					return undef;
				}
	
				// short-circuit for objects that support "json" serialization
				// if they return "self" then just pass-through...
				if (is(it.toJSON, "Function")) {
					return stringify(it.toJSON(key), indent, key);
				}
				if (it instanceof Date) {
					return '"{FullYear}-{Month+}-{Date}T{Hours}:{Minutes}:{Seconds}Z"'.replace(/\{(\w+)(\+)?\}/g, function(t, prop, plus){
						var num = it["getUTC" + prop]() + (plus ? 1 : 0);
						return num < 10 ? "0" + num : num;
					});
				}
				if (it.valueOf() !== it) {
					return stringify(it.valueOf(), indent, key);
				}
	
				// array code path
				if (it instanceof Array) {
					for(key = 0, len = it.length; key < len; key++){
						var obj = it[key];
						val = stringify(obj, nextIndent, key);
						if (!is(val, "String")) {
							val = "null";
						}
						ar.push(newLine + nextIndent + val);
					}
					return "[" + ar.join(",") + newLine + indent + "]";
				}
	
				// generic object code path
				for (key in it) {
					var keyStr;
					if (is(key, "Number")) {
						keyStr = '"' + key + '"';
					} else if (is(key, "String")) {
						keyStr = escapeString(key);
					} else {
						continue;
					}
					val = stringify(it[key], nextIndent, key);
					if (!is(val, "String")) {
						// skip non-serializable values
						continue;
					}
					// At this point, the most non-IE browsers don't get in this branch 
					// (they have native JSON), so push is definitely the way to
					ar.push(newLine + nextIndent + keyStr + ":" + sep + val);
				}
				return "{" + ar.join(",") + newLine + indent + "}"; // String
			}
	
			return stringify(value, "", "");
		};
	}

	// print the Titanium version *after* the console shim
	console.info("[INFO] Appcelerator Titanium " + cfg.ti.version + " Mobile Web");

	// make sure we have some vendor prefixes defined
	cfg.vendorPrefixes || (cfg.vendorPrefixes = ["", "Moz", "Webkit", "O", "ms"]);

	var Ti = {};
	global.Ti = global.Titanium = Ti = {};

	Ti._5 = {};
	var loaded = false,
		loaders = [];

	// public function for onload notification
	global.onloaded = function(f){
		onload(f);
	};

	// private function
	function onload(f) {
		if (loaded) {
			f();
		} else {
			loaders.push(f);
		}
	}

	function beforeonload() {
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		global.scrollTo(0, 1);
	}

	function afteronload() {
	}

	// TODO use DOMContentLoaded event instead
	global.onload = function() {
		loaded = true;
		beforeonload();
		for (var c=0 ; c < loaders.length; c++) {
			loaders[c]();
		}
		loaders = null;
		afteronload();
	};

	global.onbeforeunload = function() {
		Ti.App.fireEvent('close');
		Ti._5.addAnalyticsEvent('ti.end', 'ti.end');

	};

	// run onload
	Ti._5.run = function(app) {
		onload(app);
	};

	Ti._5.preset = function(obj, props, values){
		if(!values || !obj || !props){
			return;
		}

		for(var ii = 0; ii < props.length; ii++){
			var prop = props[ii];
			if(typeof values[prop] != 'undefined'){
				obj[prop] = values[prop];
			}
		}
	};

	Ti._5.presetUserDefinedElements = function(obj, args){
		for(var prop in args){
			if(typeof obj[prop] == 'undefined'){
				obj[prop] = args[prop];
			}
		}
	};
	
	Ti._5.prop = function(obj, property, value, descriptor) {
		if (require.is(property, "Object")) {
			for (var i in property) {
				Ti._5.prop(obj, i, property[i]);
			}
		} else {
			var skipSet,
				capitalizedName = property.substring(0, 1).toUpperCase() + property.substring(1);

			// if we only have 3 args, so need to check if it's a default value or a descriptor
			if (arguments.length === 3 && require.is(value, "Object") && (value.get || value.set)) {
				descriptor = value;
				// we don't have a default value, so skip the set
				skipSet = 1;
			}

			// if we have a descriptor, then defineProperty
			if (descriptor) {
				if ("value" in descriptor) {
					skipSet = 2;
					if (descriptor.get || descriptor.set) {
						// we have a value, but since there's a custom setter/getter, we can't have a value
						value = descriptor.value;
						delete descriptor.value;
						value !== undefined && (skipSet = 0);
					} else {
						descriptor.writable = true;
					}
				}
				descriptor.configurable = true;
				descriptor.enumerable = true;
				Object.defineProperty(obj, property, descriptor);
			}

			// create the get/set functions
			obj["get" + capitalizedName] = function(){ return obj[property]; };
			(skipSet | 0) < 2 && (obj["set" + capitalizedName] = function(val){ return obj[property] = val; });

			// if there's no default value or it's already been set with defineProperty(), then we skip setting it
			skipSet || (obj[property] = value);
		}
	};

	Ti._5.propReadOnly = function(obj, property, value) {
		var undef;
		if (require.is(property, "Object")) {
			for (var i in property) {
				Ti._5.propReadOnly(obj, i, property[i]);
			}
		} else {
			Ti._5.prop(obj, property, undef, require.is(value, "Function") ? { get: value, value: undef } : { value: value });
		}
	};

	Ti._5.createClass = function(className, value){
		var classes = className.split(".");
		var parent = window;
		for(var ii = 0; ii < classes.length; ii++){
			var klass = classes[ii];
			if(typeof parent[klass] == 'undefined'){
				parent[klass] = ii == classes.length - 1 && typeof value != 'undefined' ? value : new Object();
			}
			parent = parent[klass];
		}
		return parent;
	};

	// do some actions when framework is loaded
	Ti._5.frameworkLoaded = function() {
		if (cfg.analytics) {
			// enroll event
			if(localStorage.getItem("mobileweb_enrollSent") == null){
				// setup enroll event
				Ti._5.addAnalyticsEvent('ti.enroll', 'ti.enroll', {
					mac_addr: null,
					oscpu: null,
					app_name: cfg.appName,
					platform: Ti.Platform.name,
					app_id: cfg.appId,
					ostype: Ti.Platform.osname,
					osarch: Ti.Platform.architecture,
					model: Ti.Platform.model,
					deploytype: cfg.deployType
				});
				localStorage.setItem("mobileweb_enrollSent", true)
			}

			// app start event
			Ti._5.addAnalyticsEvent('ti.start', 'ti.start', {
				tz: (new Date()).getTimezoneOffset(),
				deploytype: cfg.deployType,
				os: Ti.Platform.osname,
				osver: Ti.Platform.ostype,
				version: cfg.tiVersion,
				un: null,
				app_version: cfg.appVersion,
				nettype: null
			});

			// try to sent previously sent analytics events on app load
			Ti._5.sendAnalytics();
		}

		Ti._5.containerDiv = document.createElement('div');
		Ti._5.containerDiv.style.width = "100%";
		Ti._5.containerDiv.style.height = "100%";
		Ti._5.containerDiv.style.overflow = "hidden";
		Ti._5.containerDiv.style.position = "absolute"; // Absolute so that any children that are absolute positioned will respect this DIVs height and width.
		document.body.appendChild(Ti._5.containerDiv);
	};

	Ti._5.getAbsolutePath = function(path){
		if(path.indexOf("app://") == 0){
			path = path.substring(6);
		}

		if(path.charAt(0) == "/"){
			path = path.substring(1);
		}

		if(path.indexOf("://") >= 0){
			return path;
		} else {
			return location.pathname.replace(/(.*)\/.*/, "$1") + "/" + path;
		}
	};

	Ti._5.px = function(val){
		return val + (typeof val == 'number' ? 'px' : '');
	};

	Ti._5.createUUID = function(){
		/*!
		Math.uuid.js (v1.4)
		http://www.broofa.com
		mailto:robert@broofa.com

		Copyright (c) 2010 Robert Kieffer
		Dual licensed under the MIT and GPL licenses.
		*/
		// RFC4122v4 solution:
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		}).toUpperCase();
	};

	Ti._5.getArguments = function(){
		return cfg;
	};

	var _sessionId = sessionStorage.getItem('mobileweb_sessionId');
	if(_sessionId == null){
		_sessionId = Ti._5.createUUID();
		sessionStorage.setItem('mobileweb_sessionId', _sessionId);
	}

	var ANALYTICS_STORAGE = "mobileweb_analyticsEvents";
	Ti._5.addAnalyticsEvent = function(eventType, eventEvent, data, isUrgent){
		if (!cfg.analytics) {
			return;
		}
		// store event
		var storage = localStorage.getItem(ANALYTICS_STORAGE);
		if(storage == null){
			storage = [];
		} else {
			storage = JSON.parse(storage);
		}
		var now = new Date();
		var ts = "yyyy-MM-dd'T'HH:mm:ss.SSSZ".replace(/\w+/g, function(str){
			switch(str){
				case "yyyy":
					return now.getFullYear();
				case "MM":
					return now.getMonth() + 1;
				case "dd":
					return now.getDate();
				case "HH":
					return now.getHours();
				case "mm":
					return now.getMinutes();
				case "ss":
					return now.getSeconds();
				case "SSSZ":
					var tz = now.getTimezoneOffset();
					var atz = Math.abs(tz);
					tz = (tz < 0 ? "-" : "+") + (atz < 100 ? "00" : (atz < 1000 ? "0" : "")) + atz;
					return now.getMilliseconds() + tz;
				default:
					return str;
			}
		});
		var formatZeros = function(v, n){
			var d = (v+'').length;
			return (d < n ? (new Array(++n - d)).join("0") : "") + v;
		};

		storage.push({
			eventId: Ti._5.createUUID(),
			eventType: eventType,
			eventEvent: eventEvent,
			eventTimestamp: ts,
			eventPayload: data
		});
		localStorage.setItem(ANALYTICS_STORAGE, JSON.stringify(storage));
		Ti._5.sendAnalytics(isUrgent);
	};

	var ANALYTICS_WAIT = 300000; // 5 minutes
	var _analyticsLastSent = null;
	var eventSeq = 1;

	// collect and send Ti.Analytics notifications
	Ti._5.sendAnalytics = function(isUrgent){
		if (!cfg.analytics) {
			return;
		}

		var i,
			evt,
			storage = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE)),
			now = (new Date()).getTime(),
			jsonStrs = [],
			ids = [],
			body = document.body,
			iframe,
			form,
			hidden,
			rand = Math.floor(Math.random() * 1e6),
			iframeName = "analytics" + rand,
			callback = "mobileweb_jsonp" + rand;

		if (storage == null || (!isUrgent && _analyticsLastSent !== null && now - _analyticsLastSent < ANALYTICS_WAIT)) {
			return;
		}

		for (i = 0; i < storage.length; i++) {
			evt = storage[i];
			ids.push(evt.eventId);
			jsonStrs.push(JSON.stringify({
				seq: eventSeq++,
				ver: "2",
				id: evt.eventId,
				type: evt.eventType,
				event: evt.eventEvent,
				ts: evt.eventTimestamp,
				mid: Ti.Platform.id,
				sid: _sessionId,
				aguid: cfg.guid,
				data: require.is(evt.eventPayload, "object") ? JSON.stringify(evt.eventPayload) : evt.eventPayload
			}));
		}

		function onIframeLoaded() {
			body.removeChild(form);
			body.removeChild(iframe);
		}

		iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.onload = onIframeLoaded;
		iframe.onerror = onIframeLoaded;
		iframe.id = iframe.name = iframeName;

		form = document.createElement("form");
		form.style.display = "none";
		form.target = iframeName;
		form.method = "POST";
		form.action = "https://api.appcelerator.net/p/v2/mobile-track?callback=" + callback;

		hidden = document.createElement("input");
		hidden.type = "hidden";
		hidden.name = "content";
		hidden.value = "[" + jsonStrs.join(",") + "]";

		body.appendChild(iframe);
		body.appendChild(form);
		form.appendChild(hidden);

		global[callback] = function(response){
			if(response && response.success){
				// remove sent events on successful sent
				var j, k, found,
					storage = localStorage.getItem(ANALYTICS_STORAGE),
					ev,
					evs = [];

				for(j = 0; j < storage.length; j++){
					ev = storage[j];
					found = 0;
					for (k = 0; k < ids.length; k++) {
						if (ev.eventId == ids[k]) {
							found = 1;
							ids.splice(k, 1);
							break;
						}
					}
					found || evs.push(ev);
				}

				localStorage.setItem(ANALYTICS_STORAGE, JSON.stringify(evs));
				
			}
		};
		form.submit();
	};

	Ti._5.extend = function(dest, source){
		for(var key in source){
			dest[key] = source[key];
		}

		return dest;
	};

	var _localeData = {};
	Ti._5.setLocaleData = function(obj){
		_localeData = obj;
	};
	Ti._5.getLocaleData = function(){
		return _localeData;
	};

	// Get browser window sizes
	Ti._5.getWindowSizes = function() {
		var winW = 630, winH = 460;
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (
			document.compatMode=='CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetWidth
		) {
			winW = document.documentElement.offsetWidth;
			winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
			winH = window.innerHeight;
		}
		return {
			width: parseInt(winW),
			height: parseInt(winH)
		}
	};

	var _loadedScripts = {};
	Ti._5.getS = function(){
		return _loadedScripts;
	}
	Ti._5.setLoadedScripts = function(scripts){
		if(scripts == null){
			return;
		}

		for(var key in scripts){
			Ti._5.addLoadedScript(key, scripts[key]);
		}
	};

	Ti._5.addLoadedScript = function(path, content){
		path = Ti._5.getAbsolutePath(path);
		_loadedScripts[path] = content;
	};

	Ti._5.getLoadedScript = function(path){
		path = Ti._5.getAbsolutePath(path);
		return _loadedScripts[path];
	};

	Ti._5.execLoadedScript = function(path){
		var code = Ti._5.getLoadedScript(path);
		if(typeof code == 'undefined'){
			return;
		}

		var head = document.getElementsByTagName('head')[0];
		if(head == null){
			head = document;
		}
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = code;
		head.appendChild(script);
	};
}(window));(function(oParentNamespace) {

	var lastActive,
		isBack,
		screens = [];

	window.onpopstate = function(evt) {
		if(evt && evt.state && evt.state.screenIndex != null){
			var win = screens[evt.state.screenIndex];
			// for opening HTML windows
			if (win) {
				isBack = true;
				win.screen_open();
			}
		}
	};

	// Create object
	oParentNamespace.Screen = function(obj, args) {
		var idx = screens.length;
		screens.push(obj);

		obj.screen_open = function() {
			// there are active window, this is not the same window and current window is not window inside other window
			lastActive && lastActive !== obj && !obj.parent && lastActive.hide();
			lastActive = obj;

			// this is top level window - it has no parent - need to add it into DOM
			!obj.parent && Ti._5.containerDiv.appendChild(obj.dom);

			obj.show();

			if(isBack){
				isBack = false;
			} else {
				// leave record in History object
				window.history.pushState({ screenIndex: idx }, "", "");
			}
			obj.fireEvent('screen_open');
		};

		obj.screen_close = function() {
			obj.fireEvent('screen_close');
			Ti._5.containerDiv.removeChild(obj.dom);
			// go prev state
			window.history.go(-1);
		};
	};

})(Ti._5);
;
Ti._5.Interactable = function(obj, isNotSearch) {
	obj.addEventListener || oParentNamespace.EventDriven(obj);

	var on = require.on,
		domNode = obj.dom;

	function fire(eventName) {
		var v = domNode && domNode.value;
		obj.fireEvent(eventName, v !== undefined && { value: v });
	}

	on(domNode, "focus", function() {
		fire("focus");
	});

	on(domNode, "blur", function() {
		fire("blur");
	});

	function change() {
		fire("change");
	}

	on(domNode, "change", change);
	on(domNode, "input", change);
	on(domNode, "paste", change);

	isNotSearch || on(domNode, "keyup", function(evt) {
		!obj.suppressReturn && !evt.altKey && !evt.ctrlKey && evt.keyCode === 13 && fire("return");
	});
};
;
Ti._5.Clickable = function(obj) {
	obj.addEventListener || oParentNamespace.EventDriven(obj);

	require.on(obj.dom, "click", function(evt) {
		obj.fireEvent("click", {
			x: evt.pageX,
			y: evt.pageY
		});
	});

	require.on(obj.dom, "dblclick", function(evt) {
		obj.fireEvent("dblclick", {
			x: evt.pageX,
			y: evt.pageY
		});
	});
};
;
Ti._5.EventDriven = function(obj) {
	var listeners = null;

	obj.addEventListener = function(eventName, handler){
		listeners || (listeners = {});
		(listeners[eventName] = listeners[eventName] || []).push(handler);
	};

	obj.removeEventListener = function(eventName, handler){
		if (listeners) {
			if (handler) {
				var i = 0,
					events = listeners[eventName],
					l = events && events.length || 0;

				for (; i < l; i++) {
					events[i] === handler && events.splice(i, 1);
				}
			} else {
				delete listeners[eventName];
			}
		}
	};

	obj.hasListener = function(eventName) {
		return listeners && listeners[eventName];
	};

	obj.fireEvent = function(eventName, eventData){
		if (listeners) {
			var i = 0,
				events = listeners[eventName],
				l = events && events.length,
				data = require.mix({
					source: obj,
					type: eventName
				}, eventData);

			while (i < l) {
				events[i++].call(obj, data);
			}
		}
	};
};
;
Ti._5.Styleable = function(obj, args) {
	args = args || {};

	if (!obj.dom) {
		return;
	}

	var undef,
		on = require.on,
		domNode = obj.dom,
		domStyle = domNode.style,
		ui = Ti.UI,
		px = Ti._5.px,
		vendorPrefixes = require.config.vendorPrefixes,
		curRotation,
		curTransform,
		_backgroundColor,
		_backgroundImage,
		_backgroundFocusPrevColor,
		_backgroundFocusPrevImage,
		_backgroundSelectedPrevColor,
		_backgroundSelectedPrevImage,
		_gradient,
		_visible,
		_prevDisplay = "";

	domNode.className += " HTML5_Styleable";

	obj.addEventListener || oParentNamespace.EventDriven(obj);

	function cssUrl(url) {
		return /^url\(/.test(url) ? url : "url(" + Ti._5.getAbsolutePath(url) + ")";
	}

	function font(val) {
		val = val || {};
		require.each(["fontVariant", "fontStyle", "fontWeight", "fontSize", "fontFamily"], function(f) {
			val[f] = f in val ? domStyle[f] = (f === "fontSize" ? px(val[f]) : val[f]) : domStyle[f];
		});
		return val;
	}

	function unitize(x) {
		return isNaN(x-0) || x-0 != x ? x : x + "px"; // note: must be != and not !==
	}

	Ti._5.prop(obj, {
		backgroundColor: {
			// we keep the backgroundColor in a variable because we later change it
			// when focusing or selecting, so we can't just report the current value
			get: function() {
				return _backgroundColor || (_backgroundColor = domStyle.backgroundColor);
			},
			set: function(val) {
				domStyle.backgroundColor = _backgroundColor = val;
			}
		},
		backgroundFocusedColor: undef,
		backgroundFocusedImage: undef,
		backgroundGradient: {
			get: function() {
				return _gradient;
			},
			set: function(val) {
				var val = _gradient = val || {},
					output = [],
					colors = val.colors || [],
					type = val.type,
					start = val.startPoint,
					end = val.endPoint;

				if (type === "linear") {
					start && end && start.x != end.x && start.y != end.y && output.concat([
						unitize(val.startPoint.x) + " " + unitize(val.startPoint.y),
						unitize(val.endPoint.x) + " " + unitize(val.startPoint.y)
					]);
				} else if (type === "radial") {
					start = val.startRadius;
					end = val.endRadius;
					start && end && output.push(unitize(start) + " " + unitize(end));
					output.push("ellipse closest-side");
				} else {
					domStyle.backgroundImage = "none";
					return;
				}

				require.each(colors, function(c) {
					output.push(c.color ? c.color + " " + (c.position * 100) + "%" : c);
				});

				output = type + "-gradient(" + output.join(",") + ")";

				require.each(vendorPrefixes.css, function(p) {
					domStyle.backgroundImage = p + output;
				});
			}
		},
		backgroundImage: {
			// we keep the backgroundImage in a variable because we later change it
			// when focusing or selecting, so we can't just report the current value
			get: function() {
				return _backgroundImage = (_backgroundImage = domStyle.backgroundImage);
			},
			set: function(val) {
				domStyle.backgroundImage = _backgroundImage = val ? cssUrl(val) : "";
			}
		},
		backgroundSelectedColor: undef,
		backgroundSelectedImage: undef,
		borderColor: {
			get: function() {
				return domStyle.borderColor;
			},
			set: function(val) {
				if (domStyle.borderColor = val) {
					domStyle.borderWidth || (obj.borderWidth = 1);
					domStyle.borderStyle = "solid";
				} else {
					obj.borderWidth = 0;
				}
			}
		},
		borderRadius: {
			get: function() {
				return domStyle.borderRadius || "";
			},
			set: function(val) {
				domStyle.borderRadius = px(val);
			}
		},
		borderWidth: {
			get: function() {
				return domStyle.borderWidth;
			},
			set: function(val) {
				domStyle.borderWidth = val = px(val);
				domStyle.borderColor || (domStyle.borderColor = "black");
				domStyle.borderStyle = "solid";
			}
		},
		color: {
			get: function() {
				return domStyle.color;
			},
			set: function(val) {
				domStyle.color = val;
			}
		},
		focusable: undef,
		font: {
			get: function() {
				return font();
			},
			set: function(val) {
				font(val);
			}
		},
		opacity: {
			get: function() {
				return domStyle.opacity;
			},
			set: function(val) {
				domStyle.opacity = val;
			}
		},
		visible: {
			get: function() {
				return _visible;
			},
			set: function(val) {
				val ? obj.show() : obj.hide();
			}
		},
		zIndex: {
			get: function() {
				return domStyle.zIndex;
			},
			set: function(val) {
				val !== domStyle.zIndex && domStyle.position === "static" && (domStyle.position = "absolute");
				domStyle.zIndex = val;
			}
		}
	});

	on(domNode, "focus", function() {
		if (obj.focusable) {
			if (obj.backgroundSelectedColor) {
				_backgroundSelectedPrevColor || (_backgroundSelectedPrevColor = obj.backgroundColor);
				domStyle.backgroundColor = obj.backgroundSelectedColor;
			}

			if (obj.backgroundSelectedImage) {
				_backgroundSelectedPrevImage || (_backgroundSelectedPrevImage = obj.backgroundImage);
				domStyle.backgroundImage = cssUrl(obj.backgroundSelectedImage);
			}

			if (obj.backgroundFocusedColor) {
				_backgroundFocusPrevColor || (_backgroundFocusPrevColor = obj.backgroundFocusedColor);
				domStyle.backgroundColor = obj.backgroundFocusedColor;
			}

			if (obj.backgroundFocusedImage) {
				_backgroundFocusPrevImage || (_backgroundFocusPrevImage = obj.backgroundImage);
				domStyle.backgroundImage = cssUrl(obj.backgroundFocusedImage);
			}
		}
	});

	on(domNode, "blur", function() {
		if (obj.focusable) {
			if (_backgroundSelectedPrevColor) {
				domStyle.backgroundColor = _backgroundSelectedPrevColor;
				_backgroundSelectedPrevColor = 0;
			}

			if (_backgroundSelectedPrevImage) {
				domStyle.backgroundImage = cssUrl(_backgroundSelectedPrevImage);
				_backgroundSelectedPrevImage = 0;
			}

			if (_backgroundFocusPrevColor) {
				domStyle.backgroundColor = _backgroundFocusPrevColor;
				_backgroundFocusPrevColor = 0;
			}

			if (_backgroundFocusPrevImage) {
				domStyle.backgroundImage = cssUrl(_backgroundFocusPrevImage);
				_backgroundFocusPrevImage = 0;
			}
		}
	});

	//
	// API Methods
	//
	obj.add = function(view) {
		obj._children.push(view);
		view.parent = obj;
		obj.render();
	};

	obj.remove = function(view) {
		domNode && view.dom.parentNode && domNode.removeChild(view.dom);
		for (var i = 0; i < obj._children.length; i++) {
			view === obj._children[i] && obj._children.splice(i, 1);
		}
		obj.render();
	};

	obj.show = function() {
		domStyle.display = _prevDisplay || "";
		obj.fireEvent("html5_shown");
		return _visible = true;
	};

	// Fire event for all children
	obj.addEventListener("html5_shown", function() {
		require.each(obj._children, function(c) { c.fireEvent("html5_shown"); });
	});

	obj.hide = function() {
		if (domStyle.display !== "none") {
			_prevDisplay = domStyle.display;
			domStyle.display = "none";
		}
		obj.fireEvent("html5_hidden");
		return _visible = false;
	};

	// Fire event for all children
	obj.addEventListener("html5_hidden", function(){
		require.each(obj._children, function(c) { c.fireEvent("html5_hidden"); });
	});

	obj.css = function(rule, value) {
		var i = 0,
			r,
			vp = vendorPrefixes.dom,
			upperCaseRule = rule[0].toUpperCase() + rule.substring(1);

		for (; i < vp.length; i++) {
			r = vp[i];
			r += r ? upperCaseRule : rule;
			if (r in domStyle) {
				return value !== undefined ? domStyle[r] = value : domStyle[r];
			}
		}
	};

	obj.animate = function(anim, callback) {
		var curve = "ease",
			transform = "";

		switch (anim.curve) {
			case ui.ANIMATION_CURVE_LINEAR: curve = "linear"; break;
			case ui.ANIMATION_CURVE_EASE_IN: curve = "ease-in"; break;
			case ui.ANIMATION_CURVE_EASE_OUT: curve = "ease-out"; break
			case ui.ANIMATION_CURVE_EASE_IN_OUT: curve = "ease-in-out";
		}

		anim.duration = anim.duration || 0;
		anim.delay = anim.delay || 0;

		// Determine which coordinates are valid and combine with previous coordinates where appropriate.
		if (anim.center) {
			anim.left = anim.center.x - domNode.offsetWidth / 2;
			anim.top = anim.center.y - domNode.offsetHeight / 2;
		}

		// Create the transition, must be set before setting the other properties
		obj.css("transition", "all " + anim.duration + "ms " + curve + (anim.delay ? " " + anim.delay + "ms" : ""));

		// Set the color and opacity properties
		anim.backgroundColor !== undef && (obj.backgroundColor = anim.backgroundColor);

		domStyle.opacity = anim.opaque && anim.visible ? 1.0 : 0.0;

		// Set the position and size properties
		require.each(["top", "bottom", "left", "right", "height", "width"], function(p) {
			anim[p] !== undef && (domStyle[p] = px(anim[p]));
		});

		// Set the z-order
		anim.zIndex !== undef && (domStyle.zIndex = anim.zIndex);

		// Set the transform properties
		if (anim.rotation) {
			curRotation = curRotation | 0 + anim.rotation;
			transform += "rotate(" + curRotation + "deg) ";
		}

		if (anim.transform) {
			curTransform = curTransform ? curTransform.multiply(anim.transform) : anim.transform;
			transform += curTransform.toCSS();
		}

		obj.css("transform", transform);

		if (callback) {
			// Note: no IE9 support for transitions, so instead we just set a timer that matches the duration so things don"t break
			setTimeout(function() {
				// Clear the transform so future modifications in these areas are not animated
				obj.css("transition", "");
				callback();
			}, anim.duration + anim.delay + 1);
		}
	};

	args["unselectable"] && (domStyle["-webkit-tap-highlight-color"] = "rgba(0,0,0,0)");

	require.mix(obj, args);
};;
Ti._5.Touchable = function(obj, args) {
	obj.addEventListener || oParentNamespace.EventDriven(obj);

	var on = require.on,
		domNode = obj.dom,
		bEmulate = !("ontouchstart" in window),
		_startPoint = null,
		_endPoint = null,
		_isDoubleTap = false;

	Ti._5.prop(obj, "touchEnabled", args && !!args.touchEnabled);

	on(domNode, bEmulate ? "mousedown" : "touchstart", function(evt) {
		if (!obj.touchEnabled) {
			return true;
		}
		
		var touches = evt.touches ? evt.touches : [evt],
			xCoord = touches[0].pageX,
			yCoord = touches[0].pageY,
			oevt = {
				globalPoint: { x:xCoord, y:yCoord },
				x: xCoord,
				y: yCoord
			};

		_startPoint = oevt.globalPoint;
		_startPoint.source = evt.target;
		_endPoint = oevt.globalPoint;
		obj.fireEvent("touchstart", oevt);

		if (touches.length > 1) {
			obj.fireEvent("twofingertap",  {
				globalPoint: { x:xCoord, y:yCoord },
				x: xCoord,
				y: yCoord
			});
		}
	});

	on(domNode, bEmulate ? "mousemove" : "touchmove", function(evt) {
		if (!obj.touchEnabled || bEmulate && !_startPoint) {
			return true;
		}

		var touches = evt.touches ? evt.touches : [evt],
			xCoord = touches[0].pageX,
			yCoord = touches[0].pageY,
			oevt = {
				globalPoint: { x:xCoord, y:yCoord },
				x: xCoord,
				y: yCoord
			};

		_endPoint = oevt.globalPoint;
		obj.fireEvent("touchmove", oevt);
	});

	on(domNode, bEmulate ? "mouseup" : "touchend", function(evt) {
		if (!obj.touchEnabled) {
			return true;
		}

		_endPoint || (_endPoint = { x: evt.pageX, y: evt.pageY });

		var oevt = {
			globalPoint: { x:_endPoint.x, y:_endPoint.y },
			x: _endPoint.x,
			y: _endPoint.y
		};
		obj.fireEvent("touchend", oevt);

		if (_startPoint && _startPoint.source && _startPoint.source == evt.target && Math.abs(_endPoint.x - _startPoint.x) >= 50) {
			oevt.direction = _endPoint.x > _startPoint.x ? "right" : "left";
			obj.fireEvent("swipe", oevt);
		}
		_startPoint = _endPoint = null;
	});

	on(domNode, "touchcancel", function(evt) {
		if (!obj.touchEnabled) {
			return true;
		}

		obj.fireEvent("touchcancel", {
			globalPoint: { x:evt.pageX, y:evt.pageY },
			x: evt.pageX,
			y: evt.pageY
		});
	});

	on(domNode, "click", function(evt) {
		if (!obj.touchEnabled) {
			return true;
		}

		var oevt = {
			globalPoint: { x:evt.pageX, y:evt.pageY },
			x: evt.pageX,
			y: evt.pageY
		};
		obj.fireEvent("singletap", oevt);

		if (_isDoubleTap = !_isDoubleTap) {
			setTimeout(function() { 
				_isDoubleTap = false;
			}, 400);
		} else {
			obj.fireEvent("doubletap", oevt);
		}
	});
};;
Ti._5.Positionable = function(obj, args) {
	obj.addEventListener || oParentNamespace.EventDriven(obj);

	var domNode = obj.dom,
		domStyle = domNode.style,
		px = Ti._5.px,
		_top,
		_bottom,
		_left,
		_right,
		_width,
		_height,
		_center,
		isAdded;

	Ti._5.prop(obj, {
		top: {
			get: function() {
				return _top;
			},
			set: function(val) {
				domStyle.bottom && (domStyle.bottom = "");
				domStyle.top = _top = px(val);
			}
		},
		bottom: {
			get: function() {
				return _bottom;
			},
			set: function(val) {
				domStyle.top && (domStyle.top = "");
				domStyle.bottom = _bottom = px(val);
			}
		},
		left: {
			get: function() {
				return _left;
			},
			set: function(val) {
				domStyle.right && (domStyle.right = "");
				domStyle.left = _left = px(val);
			}
		},
		right: {
			get: function() {
				return _right;
			},
			set: function(val) {
				domStyle.left && (domStyle.left = "");
				domStyle.right = _right = px(val);
			}
		},
		width: {
			get: function() {
				return _width;
			},
			set: function(val) {
				domStyle.width = _width = px(val);
			}
		},
		height: {
			get: function() {
				return _height;
			},
			set: function(val) {
				domStyle.height = _height = px(val);
			}
		},
		center: {
			get: function() {
				return _center;
			},
			set: function(val) {
				_center = val;

				if (!val || (val.x === null && val.y === null) || !obj.parent) {
					return;
				}

				var width = domNode.clientWidth,
					height = domNode.clientHeight,
					left = val.x,
					top = val.y;

				if (left !== null) {
					/\%$/.test(left) && (left = obj.parent.dom.clientWidth * parseFloat(left) / 100);
					domStyle.left = (left - width / 2) + "px";
				}

				if(top !== null){
					/\%$/.test(top) && (top = obj.parent.dom.clientHeight * parseFloat(top) / 100);
					domStyle.top = (top - height / 2) + "px";
				}

				if (!isAdded) {
					// recalculate center positioning on window resize
					require.on(window, "resize", function() {
						obj.center = _center;
					});
					isAdded = 1;
				}
			}
		}
	});

	obj.addEventListener("html5_added", function(){
		// reset coordinates when element is added somewhere
		obj.center = _center;
	});

	obj.addEventListener("html5_shown", function(){
		// reset coordinates when element is added somewhere
		obj.center = _center;
	});

	obj.addEventListener("html5_child_rendered", function(){
		// reset coordinates when element is added somewhere
		obj.center = _center;
	});

	if(args && args.center) {
		// ignore other position properties when "center" is passed
		delete args.top;
		delete args.bottom;
		delete args.left;
		delete args.right;
	}

	require.mix(obj, args);
};
;
(function(oParentNamespace) {
	if (!oParentNamespace.EventDriven) {
		return false;
	}

	// create a generic DOM view 
	oParentNamespace.DOMView = function(obj, type, args, typename) {
		obj.addEventListener || oParentNamespace.EventDriven(obj);

		typename = typename || "TiDOMNode";

		var domNode = obj.dom = document.createElement(type);
		domNode.className = "HTML5_" + typename + " HTML5_DOMElement";

		obj.args = args = args || {};
		// Object for previous style rules
		obj.prevStyle = {};
		obj.parent = null;
		obj._children || (obj._children = []);

		obj.toString = function() {
			return "[object " + typename + "]";
		};
		
		obj._refresh = function(props) {
			if(props === null){
				return;
			}

			var domprops = props["domprops"],
				obj = props["obj"],
				complexDomprops = props["complexDomprops"],
				args = props["args"];

			if (domprops && args) {
				for (var ii = 0; ii < domprops.length; ii++) {
					// property name
					var domProp = domprops[ii];
					args[domProp] !== undefined && (domNode.style[domProp] = args[domProp]);
				}
			}

			if (complexDomprops && args) {
				for (ii = 0; ii < complexDomprops.length; ii++) {
					var propObj = complexDomprops[ii],
						propKey = null;
					for (var sProp in propObj) {
						propKey = sProp;
						break;
					}
					args[propKey] !== undefined && (obj[propKey] = args[propKey]);
				}
			}
		};

		var _layout;
		Ti._5.prop(obj, "layout", args.layout, {
			get: function() {
				return _layout;
			},
			set: function(val) {
				/^(horizontal|vertical)$/.test(val) || (val = "absolute");
				_layout = val;
				domNode.className = domNode.className.replace(/\s*HTML5_(vertical|horizontal)Layout\b/, "") + " HTML5_" + _layout + "Layout";
				// If layout option setted out of the constructor, we need to redraw object
				if (require.is(obj.render, "Function")) {
					obj.innerHTML = "";
					// if we have been rendered and add is called - re-render
					obj._rendered && obj.render();
				}
			}
		});
		
		// API Methods
		obj.render = function(parent) {
			var c, l,
				convertToMargins = true,
				domStyle = domNode.style;
				pos = "";

			if (!parent && !domNode.parentNode) {
				return;
			}
			if (parent) {
				if (parent.layout === "horizontal") {
					domStyle.display = "inline-block";
				} else if (parent.layout === "vertical") {
					domStyle.display = "";
				} else {
					convertToMargins = false;
					pos = "absolute";
				}

				if (convertToMargins) {
					// Note: we use margins instead of the actual left/right/top/bottom because margins play much nicer with our layout techniques.
					obj.left && (domStyle.marginLeft = obj.left);
					obj.top && (domStyle.marginTop = obj.top);
					obj.right && (domStyle.marginRight = obj.right);
					obj.bottom && (domStyle.marginBottom = obj.bottom);
					domStyle.left = domStyle.right = domStyle.top = domStyle.bottom = "auto";
				}
				parent._getAddContainer().appendChild(domNode);
				obj.fireEvent("html5_added", parent);
			} else {
				pos = "absolute";
			}

			domStyle.position = pos;

			for (c = 0, l = obj._children.length; c < l; c++) {
				obj._children[c].render(obj);
			}
			obj._rendered = true;
				
			// Give some time to browser to render the page
			setTimeout(function() {
				// Fire parent "finished" event 
				obj.parent && obj.parent.fireEvent("html5_child_rendered", obj);
				// Fire object "finished" event 
				obj.fireEvent("html5_rendered");
			}, 10);
		};
		
		// "Finished" event must bubbled to all parents
		obj.addEventListener("html5_child_rendered", function(oSource) {
			obj.parent && obj.parent.fireEvent("html5_child_rendered", oSource);
		});

		obj._getAddContainer = function(){
			return domNode;
		};

		return domNode;
	};
	
	oParentNamespace._getElementOffset = function(node) {
		var i,
			curleft = node.offsetLeft,
			curtop = node.offsetTop,
			w = 0,
			h = 0;

		while (i = (i || node).offsetParent) {
			curleft += i.offsetLeft;
			curtop += i.offsetTop;
		}

		for (i = 0; i < node.children.length; i++) {
			var oSizes = oParentNamespace._getElementOffset(node.children[i]);
			w = Math.max(w, oSizes.width + oSizes.left - curleft);
			h = Math.max(h, oSizes.height + oSizes.top - curtop);
		}

		return {
			left: curleft, 
			top: curtop,
			width: Math.max(w, node.offsetWidth),
			height: Math.max(h, node.offsetHeight)
		}
	};
	
	// Modify siple text to HTML text for looking as expected in some cases (like triple spaces)
	oParentNamespace._changeTextToHTML = function(text) {
		return (""+text).replace(/&/g, "&amp;").replace(/\s{3}/gm, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");
	};
})(Ti._5);
;
(function(api){
	Ti._5.EventDriven(api);
	delete api.removeEventListener;

	var ver = require.config.ti.version;

	require.mix(api, {
		version: ver,
		buildDate: "12/28/11 18:01",
		buildHash: "941e3ed",
		userAgent: "Appcelerator Titanium/" + ver + " (" + navigator.userAgent + ")"
	});

	// Methods
	api.createBlob = function(){
		console.debug('Method "Titanium.createBlob" is not implemented yet.');
	};

	api.include = function(files){
		var i = 0;
		typeof files === "array" || (files = [].concat(Array.prototype.slice.call(arguments, 0)));
		for (; i < files.length; i++) {
			require("include!" + files[i]);
		}
	};
})(Ti);
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);
	var STORAGE = "html5_localStorage";
	var _getProp = function(prop, def, transform){
		if(prop == null){
			return;
		}
		var storage = localStorage.getItem(STORAGE);
		if(storage == null){
			storage = [];
		} else {
			storage = JSON.parse(storage);
		}
		var val =  storage[prop];
		if(val != null){
			return typeof transform !== 'undefined' ? transform(val) : val;
		} else if (typeof def !== 'undefined'){
			return def;
		}

		return val;
	};

	var _setProp = function(prop, val, transform){
		if(prop == null || typeof val === 'undefined'){
			return;
		}
		val = typeof transform !== 'undefined' ? transform(val) : val;
		var storage = localStorage.getItem(STORAGE);
		if(storage == null){
			storage = {};
		} else {
			storage = JSON.parse(storage);
		}
		if(prop != null){
			storage[prop] = val;
		}
		localStorage.setItem(STORAGE, JSON.stringify(storage));
	};

	var _parseBoolean = function(val){return Boolean(val);};
	// Methods
	api.getBool = function(prop, def){
		return _getProp(prop, def, _parseBoolean);
	};
	api.getDouble = function(prop, def){
		return _getProp(prop, def, parseFloat);
	};
	api.getInt = function(prop, def){
		return _getProp(prop, def, parseInt);
	};
	api.getList = function(prop, def){
		return _getProp(prop, def, function(val){
			if(val instanceof Array){
				return val;
			}
			return [val];
		});
	};
	api.getString = function(prop, def){
		return _getProp(prop, def, function(val){
			if(typeof val === 'string'){
				return val;
			}
			return val.toString();
		});
	};
	api.hasProperty = function(prop){
		return typeof _getProp(prop) !== 'undefined';
	};
	api.listProperties = function(){
		var storage = localStorage.getItem(STORAGE);
		if(storage == null){
			return [];
		} else {
			storage = JSON.parse(storage);
		}
		var props = [];
		for(var key in storage){
			props.push(key);
		}

		return props;
	};
	api.removeProperty = function(prop){
		var storage = localStorage.getItem(STORAGE);
		if(storage == null){
			return;
		} else {
			storage = JSON.parse(storage);
		}
		
		delete storage[prop];

		localStorage.setItem(STORAGE, JSON.stringify(storage));
	};
	api.setBool = function(prop, val){
		_setProp(prop, val, _parseBoolean);
	};
	api.setDouble = function(prop, val){
		_setProp(prop, val, parseFloat);
	};
	api.setInt = function(prop, val){
		_setProp(prop, val, parseInt);
	};
	api.setList = function(prop, val){
		_setProp(prop, val, function(val){
			if(val instanceof Array){
				return val;
			}
			return [val];
		});
	};
	api.setString = function(prop, val){
		_setProp(prop, val, function(val){
			return val !== null ? ""+val : null;
		});
	};
})(Ti._5.createClass('Ti.App.Properties'));
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	var lang = navigator.language.replace(/^([^\-\_]+)[\-\_](.+)?$/, function(o, l, c){ return l.toLowerCase() + (c && "-" + c.toUpperCase()); }),
		langParts = lang.split("-");

	// Properties
	Ti._5.propReadOnly(api, {
		currentCountry: langParts[1] || "",
		currentLanguage: langParts[0] || "",
		currentLocale: lang
	});

	// Methods
	api.formatTelephoneNumber = function() {
		console.debug('Method "Titanium.Locale.formatTelephoneNumber" is not implemented yet.');
	};
	api.getCurrencyCode = function() {
		console.debug('Method "Titanium.Locale.getCurrencyCode" is not implemented yet.');
	};
	api.getCurrencySymbol = function() {
		console.debug('Method "Titanium.Locale.getCurrencySymbol" is not implemented yet.');
	};
	api.getLocaleCurrencySymbol = function() {
		console.debug('Method "Titanium.Locale.getLocaleCurrencySymbol" is not implemented yet.');
	};
	api.getString = function(str, hintText) {
		var data = Ti._5.getLocaleData();
		if(typeof data[api.currentLanguage] != 'undefined' && typeof data[api.currentLanguage][str] != 'undefined') {
			return data[api.currentLanguage][str];
		} else if (typeof hintText != 'undefined'){
			return hintText;
		}
		return str;
	};
})(Ti._5.createClass("Ti.Locale"));

// L = Ti.Locale.getString;
Object.defineProperty(window, "L", { value: Ti.Locale.getString, enumarable: true });

(function(api){
	// format a generic string using the [IEEE printf specification](http://www.opengroup.org/onlinepubs/009695399/functions/printf.html).
	api.format = function(s) {
		console.debug('Method "String.format" is not implemented yet.');
		return [].concat(Array.prototype.slice.call(arguments, 0)).join(" ");
	};

	// format a date into a locale specific date format. Optionally pass a second argument (string) as either "short" (default), "medium" or "long" for controlling the date format.
	api.formatDate = function(dt, fmt) {
		console.debug('Method "String.formatDate" is not implemented yet.');
		return dt.toString();
	};

	// format a date into a locale specific time format.
	api.formatTime = function(dt) {
		console.debug('Method "String.formatTime" is not implemented yet.');
		return dt.toString();
	};

	// format a number into a locale specific currency format.
	api.formatCurrency = function(amt) {
		console.debug('Method "String.formatCurrency" is not implemented yet.');
		return amt;
	};

	// format a number into a locale specific decimal format.
	api.formatDecimal = function(dec) {
		console.debug('Method "String.formatDecimal" is not implemented yet.');
		return dec;
	};
})(String);
;
(function(api){

	var match = navigator.userAgent.toLowerCase().match(/(webkit|gecko|trident|presto)/),
		runtime = match ? match[0] : "unknown",
		createUUID = Ti._5.createUUID,
		id = localStorage && localStorage.getItem("html5_titaniumPlatformId") ?
			localStorage.getItem("html5_titaniumPlatformId") : createUUID();

	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.propReadOnly(api, {
		BATTERY_STATE_CHARGING: 1,
		BATTERY_STATE_FULL: 2,
		BATTERY_STATE_UNKNOWN: -1,
		BATTERY_STATE_UNPLUGGED: 0,
		address: null,
		architecture: null,
		availableMemory: null,
		batteryLevel: null,
		batteryMonitoring: null,
		batteryState: api.BATTERY_STATE_UNKNOWN,
		id: id,
		isBrowser: true,
		locale: navigator.language,
		macaddress: null,
		model: null,
		name: navigator.userAgent,
		netmask: null,
		osname: "mobileweb",
		ostype: navigator.platform,
		runtime: runtime,
		processorCount: null,
		username: null,
		version: require.config.ti.version
	});

	// Methods
	api.createUUID = createUUID;

	api.canOpenURL = function(url){
		return true;
	};

	api.openURL = function(url){
		var m = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?/.exec(url);
		if ( (/^([tel|sms|mailto])/.test(url) || /^([\/?#]|[\w\d-]+^:[\w\d]+^@)/.test(m[1])) && !/^(localhost)/.test(url) ) {
			setTimeout(function () {
				window.location.href = url;
			}, 1);
		} else {
			window.open(url);
		}
	};

	localStorage.setItem("html5_titaniumPlatformId", id);

})(Ti._5.createClass("Ti.Platform"));
;
(function(api){
	var _backgroundColor = null,
		_backgroundImage = null;

	api.currentWindow = null;
	api.currentTab = null;

	// Properties
	Ti._5.propReadOnly(api, {
		UNKNOWN: 0,
		FACE_DOWN: 1,
		FACE_UP: 2,
		PORTRAIT: 3,
		UPSIDE_PORTRAIT: 4,
		LANDSCAPE_LEFT: 5,
		LANDSCAPE_RIGHT: 6,
		INPUT_BORDERSTYLE_BEZEL: 3,
		INPUT_BORDERSTYLE_LINE: 1,
		INPUT_BORDERSTYLE_NONE: 0,
		INPUT_BORDERSTYLE_ROUNDED: 2,
		INPUT_BUTTONMODE_ALWAYS: 1,
		INPUT_BUTTONMODE_NEVER: 0,
		INPUT_BUTTONMODE_ONBLUR: 0,
		INPUT_BUTTONMODE_ONFOCUS: 1,
		KEYBOARD_APPEARANCE_ALERT: 1,
		KEYBOARD_APPEARANCE_DEFAULT: 0,
		KEYBOARD_ASCII: 1,
		KEYBOARD_DEFAULT: 2,
		KEYBOARD_EMAIL: 3,
		KEYBOARD_NAMEPHONE_PAD: 4,
		KEYBOARD_NUMBERS_PUNCTUATION: 5,
		KEYBOARD_NUMBER_PAD: 6,
		KEYBOARD_PHONE_PAD: 7,
		KEYBOARD_URL: 8,
		NOTIFICATION_DURATION_LONG: 1,
		NOTIFICATION_DURATION_SHORT: 2,
		PICKER_TYPE_COUNT_DOWN_TIMER: 1,
		PICKER_TYPE_DATE: 2,
		PICKER_TYPE_DATE_AND_TIME: 3,
		PICKER_TYPE_PLAIN: 4,
		PICKER_TYPE_TIME: 5,
		RETURNKEY_DEFAULT: 0,
		RETURNKEY_DONE: 1,
		RETURNKEY_EMERGENCY_CALL: 2,
		RETURNKEY_GO: 3,
		RETURNKEY_GOOGLE: 4,
		RETURNKEY_JOIN: 5,
		RETURNKEY_NEXT: 6,
		RETURNKEY_ROUTE: 7,
		RETURNKEY_SEARCH: 8,
		RETURNKEY_SEND: 9,
		RETURNKEY_YAHOO: 10,
		TEXT_ALIGNMENT_CENTER: 1,
		TEXT_ALIGNMENT_RIGHT: 2,
		TEXT_ALIGNMENT_LEFT: 3,
		TEXT_AUTOCAPITALIZATION_ALL: 3,
		TEXT_AUTOCAPITALIZATION_NONE: 0,
		TEXT_AUTOCAPITALIZATION_SENTENCES: 2,
		TEXT_AUTOCAPITALIZATION_WORDS: 1,
		TEXT_VERTICAL_ALIGNMENT_BOTTOM: 2,
		TEXT_VERTICAL_ALIGNMENT_CENTER: 1,
		TEXT_VERTICAL_ALIGNMENT_TOP: 3
	});

	Ti._5.prop(api, {
		backgroundColor: {
			get: function(){return _backgroundColor;},
			set: function(val){
				_backgroundColor = val;
				api.setBackgroundColor(_backgroundColor);
			}
		},
		backgroundImage: {
			get: function(){return _backgroundImage;},
			set: function(val){
				_backgroundImage = val;
				api.setBackgroundImage(_backgroundImage);
			}
		}
	});

	// Methods
	api.setBackgroundColor = function(args) {
		Ti._5.containerDiv.style.backgroundColor = args;
	};
	
	api.setBackgroundImage = function(args) {
		Ti._5.containerDiv.style.backgroundImage = "url(" + Ti._5.getAbsolutePath(args) + ")";
	};
	
	api.create2DMatrix = function(args){
		return new Ti.UI["2DMatrix"](args);
	};
	api.create3DMatrix = function(){
		console.debug('Method "Titanium.UI.create3DMatrix" is not implemented yet.');
	};
	api.createActivityIndicator = function(args){
		return new Ti.UI.ActivityIndicator(args);
	};
	api.createAlertDialog = function(args){
		return new Ti.UI.AlertDialog(args);
	};
	api.createAnimation = function(args){
		return new Ti.UI.Animation(args);
	};
	api.createButton = function(args) {
		return new Ti.UI.Button(args);
	};
	api.createButtonBar = function(){
		console.debug('Method "Titanium.UI.createButtonBar" is not implemented yet.');
	};
	api.createCoverFlowView = function(){
		console.debug('Method "Titanium.UI.createCoverFlowView" is not implemented yet.');
	};
	api.createDashboardItem = function(){
		console.debug('Method "Titanium.UI.createDashboardItem" is not implemented yet.');
	};
	api.createDashboardView = function(){
		console.debug('Method "Titanium.UI.createDashboardView" is not implemented yet.');
	};
	api.createEmailDialog = function(){
		console.debug('Method "Titanium.UI.createEmailDialog" is not implemented yet.');
	};
	api.createImageView = function(args){
		return new Ti.UI.ImageView(args);
	};
	api.createLabel = function(args) {
		return new Ti.UI.Label(args);
	};
	api.createOptionDialog = function(){
		console.debug('Method "Titanium.UI.createOptionDialog" is not implemented yet.');
	};
	api.createPicker = function(args) {
		return new Ti.UI.Picker(args);
	}
	api.createPickerColumn = function(){
		console.debug('Method "Titanium.UI.createPickerColumn" is not implemented yet.');
	};
	api.createPickerRow = function(args){
		return new Ti.UI.PickerRow(args);
	};
	api.createProgressBar = function(){
		console.debug('Method "Titanium.UI.createProgressBar" is not implemented yet.');
	};
	api.createScrollView = function(args) {
		return new Ti.UI.ScrollView(args);
	};
	api.createScrollableView = function(args){
		return new Ti.UI.ScrollableView(args);
	};
	api.createSearchBar = function(args){
		return new Ti.UI.SearchBar(args);
	};
	api.createSlider = function(args){
		return new Ti.UI.Slider(args);
	};
	api.createSwitch = function(args){
		return new Ti.UI.Switch(args);
	};
	api.createTab = function(args){
		return new Ti.UI.Tab(args);
	};
	api.createTabGroup = function(args){
		return new Ti.UI.TabGroup(args);
	};
	api.createTabbedBar = function(){
		console.debug('Method "Titanium.UI.createTabbedBar" is not implemented yet.');
	};
	api.createTableView = function(args) {
		return new Ti.UI.TableView(args);
	};
	api.createTableViewRow = function(args){
		return new Ti.UI.TableViewRow(args);
	};
	api.createTableViewSection = function(args){
		return new Ti.UI.TableViewSection(args);
	};
	api.createTextArea = function(args) {
		return new Ti.UI.TextArea(args);
	};
	api.createTextField = function(args) {
		return new Ti.UI.TextField(args);
	};
	api.createToolbar = function(){
		console.debug('Method "Titanium.UI.createToolbar" is not implemented yet.');
	};
	api.createView = function(args) {
		return new Ti.UI.View(args);
	};
	api.createWebView = function(args) {
		return new Ti.UI.WebView(args);
	};
	api.createWindow = function(args) {
		return new Ti.UI.Window(args);
	};
})(Ti._5.createClass("Ti.UI"));
;
Ti._5.createClass("Ti.UI.TabGroup", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var undef,
		obj = this;
		domNode = Ti._5.DOMView(obj, "div", args, "TabGroup"),
		_activeTabIndex = null,
		_barColor = null;

	// Interfaces
	Ti._5.Screen(obj, args);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	domNode.position = "absolute";

	// create DOM sctructure for the instance
	// lets store tab headers as table - obj is much more easy to resize and rewrap rather then do it manually
	var _headerTable = document.createElement("table");
	_headerTable.cellSpacing = 0;
	_headerTable.className = "tabsHeaders";
	var _tabsHeaders = document.createElement("tbody");
	_headerTable.appendChild(_tabsHeaders);
	var _tabsContent = document.createElement("div");
	_tabsContent.className = "tabsContent";
	_tabsContent.style.width = "100%";
	_tabsContent.style.height = "90%";
	_tabsContent.style.position = "absolute";
	domNode.appendChild(_headerTable);
	domNode.appendChild(_tabsContent);

	obj._tabs = [];

	// Properties
	Ti._5.prop(obj, {
		activeTab: {
			get: function(){return obj._tabs[_activeTabIndex];},
			set: function(val){obj.setActiveTab(val);}
		},
		allowUserCustomization: undef,
		barColor: {
			get: function(){return _barColor;},
			set: function(val){
				_tabsHeaders.style.backgroundColor = _barColor = val;
			}
		},
		editButtonTitle: undef,
		tabs: {
			get: function(){
				var res = [];
				for(var ii = 0; ii < obj._tabs.length; ii++){
					res.push(obj._tabs[ii]);
				}
				return res;
			}
		}
	});

	// Methods
	obj.addTab = function(tab){
		_tabsHeaders.appendChild(tab._header);
		_tabsContent.appendChild(tab.dom);

		obj._tabs.push(tab);
		tab._tabGroup = obj;

		if(_activeTabIndex == null){
			obj.setActiveTab(obj._tabs.length - 1);
		} else {
			tab.hide();
		}
		tab.render();
	};

	obj.removeTab = function(tabObj){
		for(var ii = obj._tabs.length - 1; ii >= 0; ii--){
			var tab = obj._tabs[ii];
			if(tab == tabObj){
				obj._tabs.splice(ii, 1);
				_tabsHeaders.removeChild(tab._header);
				_tabsContent.removeChild(tab.dom);
				tab._tabGroup = null;

				if(_activeTabIndex == ii){
					// removing current opened tab
					_activeTabIndex = null;

					// after removing tab array length is decremented
					if(ii == obj._tabs.length){
						// obj was last tab - open previous
						obj.setActiveTab(obj._tabs.length - 1);
					} else {
						// show tab after removed one
						obj.setActiveTab(ii);
					}
				} else if(_activeTabIndex > ii) {
					_activeTabIndex--;
				}
				break;
			}
		}
	};

	function hideTab(tabIndex){
		if(tabIndex == null && tabIndex > obj._tabs.length){
			return;
		}

		var tab = obj._tabs[tabIndex];
		tab._header.className = tab._header.className.replace(/\bactiveTabHeader\b/, "");
		tab.dom.style.display = "none";
		tab.hide();
	}

	function showTab(tabIndex){
		if(tabIndex == null && tabIndex > obj._tabs.length){
			return;
		}

		var tab = obj._tabs[tabIndex];
		tab._header.className += " activeTabHeader";
		tab.dom.style.display = "";
		tab.show();
	}

	obj.setActiveTab = function(indexOrObject){
		if(typeof indexOrObject === "object"){
			for(var ii = obj._tabs.length - 1; ii >= 0; ii--){
				if(obj._tabs[ii] === indexOrObject){
					obj.setActiveTab(ii);
					return;
				}
			}

			// tab not found - add new
			obj.addTab(indexOrObject);
			obj.setActiveTab(obj._tabs.length - 1);
		} else if (indexOrObject !== _activeTabIndex) {
			if(_activeTabIndex != null){
				obj.fireEvent("blur", {
					globalPoint: {x: null, y: null},
					x: null,
					y: null,
					previousIndex: _activeTabIndex,
					previousTab: obj._tabs[_activeTabIndex],
					tab: obj._tabs[indexOrObject]
				});
				hideTab(_activeTabIndex);
			}

			obj.fireEvent("focus", {
				globalPoint: {x: null, y: null},
				x: null,
				y: null,
				previousIndex: _activeTabIndex,
				previousTab: _activeTabIndex != null && _activeTabIndex < obj._tabs.length ? obj._tabs[_activeTabIndex] : null,
				tab: obj._tabs[indexOrObject]
			});
			_activeTabIndex = indexOrObject;
			showTab(_activeTabIndex);
		}
	};

	obj.open = function(){
		obj.screen_open();
		if(_activeTabIndex > obj.tabs.length){
			_activeTabIndex = null;
		}

		Ti.UI.currentTabGroup = obj;
		obj.show();
		if(obj._tabs.length > 0){
			obj.setActiveTab(_activeTabIndex || 0);
		}

		obj.fireEvent("open", {
			globalPoint: {x: null, y: null},
			x: null,
			y: null
		});
	};

	obj.close = function(){
		obj.screen_close();
		obj.hide();
		if(Ti.UI.currentTabGroup == obj){
			Ti.UI.currentTabGroup = null;
		}

		obj.fireEvent("close", {
			globalPoint: {x: null, y: null},
			x: null,
			y: null
		});
	};

	require.mix(obj, args);
});
;
Ti._5.createClass("Ti.UI.Window", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "Window"),
		domStyle = domNode.style,
		_titleid = null,
		_titlepromptid = null,
		_url = null,
		_title;

	function isHTMLPage(){
		return _url != null && (_url.indexOf("htm") != -1 || _url.indexOf("http") != -1);
	}

	// Interfaces
	Ti._5.Screen(obj, args);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	Ti._5.Clickable(obj);
	Ti._5.Interactable(obj, true);

	// Properties
	Ti._5.prop(obj, {
		backButtonTitle: null,
		backButtonTitleImage: null,
		barColor: null,
		barImage: null,
		exitOnClose: null,
		fullscreen: false,
		leftNavButton: null,
		modal: null,
		navBarHidden: null,
		orientationModes: [],
		rightNavButton: null,
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		softInputMode: null,
		tabBarHidden: null,
		titleControl: null,
		title: {
			get: function() {
				return _title;
			},
			set: function(val) {
				_title = val;
				setTitle();
			}
		},
		titleid: {
			get: function(){return _titleid;},
			set: function(val){obj.title = L(_titleid = val);}
		},
		titleImage: null,
		titlePrompt: null,
		titlepromptid: {
			get: function(){return _titlepromptid;},
			set: function(val){
				obj.titlePrompt = L(_titlepromptid = val);
			}
		},
		toolbar: null,
		translucent: null,
		url: {
			get: function(){return _url;},
			set: function(val){
				_url = val;
				if (isHTMLPage()) {
					window.location.href = Ti._5.getAbsolutePath(_url);
				} else {
					// We need this for proper using window.open in code
					setTimeout(function(){
						var prevWindow = Ti.UI.currentWindow;
						Ti.UI.currentWindow = obj;
						require("include!sandbox!" + _url);
						Ti.UI.currentWindow = prevWindow;
					}, 1);
				}
			}
		}
	});

	var _oldHide = obj.hide; // WARNING: this may cause problems
	obj.hide = function() {
		obj.fireEvent("blur", {source: domNode});
		_oldHide();
	};

	function setTitle() {
		Ti.UI.currentWindow === obj && (document.title = obj.title != null ? obj.title : Ti._5.getArguments().projectName);
	}

	// Methods
	obj.addEventListener("screen_open", function() {
		Ti.UI.currentWindow = obj;
		obj.render(null);
		setTitle();
		obj.fireEvent("open", {source: null});
		obj.fireEvent("focus", {source: domNode});
	});
	obj.addEventListener("screen_close", function() {
		obj.fireEvent("blur", {source: domNode});
		obj.fireEvent("close", {source: null});
		if(!isHTMLPage()){
			// remove script include
			var head = document.getElementsByTagName("head")[0];
			head.removeChild(head.children[head.children.length - 1]);
		}
	});
	obj.open = function(){
		obj.screen_open();
	};

	obj.close = function(){
		obj.screen_close();
	};

	require.mix(obj, args);

	function setMinHeight(oSource) {
		oSource = oSource || obj;
		if (!oSource.dom) {
			return;
		}
		// Set min window height for preventing window heights be smaller then sum of all window children heights  
		var oElOffset = Ti._5._getElementOffset(oSource.dom);
		//domStyle.minHeight = (oElOffset.height - oElOffset.top) + "px";
		domStyle.minHeight = oElOffset.height + "px";
	}

	var _oldRender = obj.render; // WARNING: this may cause problems
	obj.render = function(parent) {
		_oldRender(parent);
		// Get first element margin
		var _maxChildrenHeight = 0;
		if (obj._children) {
			var _padding = 0;
			if (obj._children[0] && obj._children[0].dom) {
				_padding = parseInt(obj._children[0].dom.style.marginTop);
			}
			domStyle.paddingTop = _padding + "px";
			for (var c=0;c<obj._children.length;c++) {
				obj._children[c].render(obj);
			}
		}
		setMinHeight(obj);
	};
	
	obj.addEventListener("html5_child_rendered", function () {
		// Give some time to browser to render the page
		setTimeout(setMinHeight, 100);
	});

	require.on(window, "resize", function() {setMinHeight();});
	require.on(window, "load", function() {setMinHeight();});
});
;
Ti._5.createClass("Ti.UI.Tab", function(args){
	args = require.mix({
		height: "100%",
		width: "100%"
	}, args);

	var undef,
		obj = this,
		_icon = null,
		_title = null,
		_titleid = null,
		_window = null;

	// Interfaces
	Ti._5.DOMView(obj, "div", args, "Tab");
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	obj._header = document.createElement("td");
	obj._header.className = "tabHeader";
	obj._header.onclick = function(){
		if(obj._tabGroup == null){
			return;
		}
		
		for(var ii = obj._tabGroup._tabs.length - 1; ii >= 0; ii--){
			if(obj._tabGroup._tabs[ii] === obj){
				obj._tabGroup.setActiveTab(ii);
				break;
			}
		}
	};
	
	// reference to tabGroup object that holds current tab
	obj._tabGroup = null;

	var _oldShow = obj.show; // WARNING: this may cause problems
	obj.show = function(){
		_oldShow();
		if(_window){
			_window.show();
		}
		Ti.UI.currentTab = obj;
	};

	var _oldHide = obj.hide; // WARNING: this may cause problems
	obj.hide = function(){
		_oldHide();
		if(_window){
			_window.hide();
		}
		if(Ti.UI.currentTab == obj){
			Ti.UI.currentTab = null;
		}
	};

	obj.open = function(win, args){
		win.open(args);
	};

	// Properties
	Ti._5.prop(obj, {
		"badge": undef,
		"icon": {
			get: function(){return _icon;},
			set: function(val){
				if(val == null || val == ''){
					// remove icon
					obj._header.style.backgroundImage = '';
				} else {
					obj._header.style.backgroundImage = 'url(' + Ti._5.getAbsolutePath(val) + ')';
				}
				_icon = val;
			}
		},
		"title": {
			get: function(){return _title;},
			set: function(val){
				obj._header.innerHTML = _title = val;
			}
		},
		"titleid": {
			get: function(){return _titleid;},
			set: function(val){
				obj.title = L(_titleid = val);
			}
		},
		"win": {
			get: function(){return obj.window;},
			set: function(val){obj.window = val;}
		},
		"window": {
			get: function(){return _window;},
			set: function(val){
				_window = val;
				obj.add(_window);
				_window;
			}
		}
	});

	require.mix(obj, args);
});
;
Ti._5.createClass('Titanium.UI.iPhone.AnimationStyle', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.animationstyle', args, 'iPhone.AnimationStyle');

	// Properties
	Ti._5.prop(this, 'CURL_DOWN');

	Ti._5.prop(this, 'CURL_UP');

	Ti._5.prop(this, 'FLIP_FROM_LEFT');

	Ti._5.prop(this, 'FLIP_FROM_RIGHT');

	Ti._5.prop(this, 'NONE');

	require.mix(this, args);
});;
Ti._5.createClass("Ti.UI.View", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "View");

	// Interfaces
	Ti._5.Clickable(obj);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	domNode.style.overflow = args.height === "100%" || args.height === "auto" ? "" : "hidden";

	Ti._5.prop(obj, "size", {
		get: function(){
			return {
				width: obj.width,
				height: obj.height
			}
		},
		set: function(val){
			val.width && (obj.width = Ti._5.px(val.width));
			val.height && (obj.height = Ti._5.px(val.height));
		}
	});

	require.mix(obj, args);

	domNode._calcHeight = false;
	obj.addEventListener("html5_added", function(){
		domNode._calcHeight = false;
	});

	function getLowestPosition(obj) {
		var oSizes = Ti._5._getElementOffset(domNode);
		var iMaxPos = oSizes.height + (parseInt(obj.top) || 0) + (parseInt(obj.bottom) || 0);
		if (obj._children) {
			for (var iCounter = 0; iCounter < obj._children.length; iCounter++) {
				iPos = getLowestPosition(obj._children[iCounter]);
				iMaxPos = iMaxPos < iPos ? iPos : iMaxPos;
			}
		}
		return iMaxPos;
	}

	function setViewHeight() {
		if (
			("undefined" == typeof obj.height || "auto" == obj.height) &&
			false === domNode._calcHeight &&
			obj._children && "vertical" != obj.layout
		) {
			var iMaxPos = 0;
			for (var iCounter = 0; iCounter < obj._children.length; iCounter++) {
				var iPos = getLowestPosition(obj._children[iCounter]);
				iMaxPos = iMaxPos < iPos ? iPos : iMaxPos;
			}
			domNode._calcHeight = iMaxPos;
			domNode.style.height = domNode._calcHeight + "px";
		}
	}

	obj.addEventListener("html5_child_rendered", setViewHeight);
	obj.addEventListener("html5_shown", function() {
		domNode._calcHeight = false;
		setViewHeight();
	});

	require.on(window, "resize", function() {
		domNode._calcHeight = false;
		setViewHeight();
	});
});

;
Ti._5.createClass("Ti.UI.Label", function(args){
	args = require.mix({
		backgroundColor: "none",
		textAlign: "-webkit-auto",
		unselectable: true
	}, args);

	var undef,
		obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "Label"),
		domStyle = domNode.style,
		px = Ti._5.px,
		_shadowColor = null,
		_shadowOffset = null,
		_title = "",
		_textid = null,
		_selectedColor = null,
		_prevTextColor = null,
		_selectedColorLoaded = false;

	// Interfaces
	Ti._5.Clickable(obj);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	args.backgroundPaddingLeft = args.backgroundPaddingLeft || "0";
	args.backgroundPaddingTop = args.backgroundPaddingTop || "0";
	domStyle.overflow = "hidden";

	function setShadow() {
		domStyle["-webkit-box-shadow"] = (_shadowColor || "#000") + " " + 
			(_shadowOffset && _shadowOffset.x || 0) + "px " + 
			(_shadowOffset && _shadowOffset.y || 0) + "px ";
	}

	// Properties
	Ti._5.prop(obj, {
		autoLink: undef,
		backgroundPaddingBottom: undef,
		backgroundPaddingLeft: {
			get: function(){return domStyle.backgroundPositionX;},
			set: function(val){domStyle.backgroundPositionX = px(val);}
		},
		backgroundPaddingRight: undef,
		backgroundPaddingTop: {
			get: function(){return domStyle.backgroundPositionY;},
			set: function(val){domStyle.backgroundPositionY = px(val);}
		},
		ellipsize: false,
		highlightedColor: undef,
		html: {
			get: function(){return obj.text},
			set: function(val){obj.text = val;}
		},
		minimumFontSize: undef,
		selectedColor: {
			get: function(){return _selectedColor;},
			set: function(val) {
				_selectedColor = val;
				if (!_selectedColorLoaded) {
					_selectedColorLoaded = true;
					require.on(domNode, "focus", function() {
						_prevTextColor = obj.color;
						obj.color = _selectedColor;
					});
					require.on(domNode, "blur", function() {
						_prevTextColor && (obj.color = _prevTextColor);
					});
				}
			}
		},
		shadowColor: {
			get: function(){return _shadowColor;},
			set: function(val){_shadowColor = val; setShadow();}
		},
		shadowOffset: {
			get: function(){return _shadowOffset;},
			set: function(val){_shadowOffset = val; setShadow();}
		},
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = px(val.width));
				val.height && (obj.height = px(val.height));
			}
		},
		text: {
			get: function(){return _title ? _title : domNode.innerHTML;},
			set: function(val){
				_title = ""+val; 
				domNode.innerHTML = Ti._5._changeTextToHTML(val); 
				// if we have been rendered and add is called - re-render
				if (
					!obj._rendered ||
					!obj.parent || !obj.parent.dom || 
					!domNode.offsetHeight && !domNode.offsetWidth || 
					!obj.parent.dom.offsetHeight && !obj.parent.dom.offsetWidth
				) {
					return _title;
				}
				obj.render(null);
			}
		},
		textAlign: {
			get: function(){return domStyle.textAlign;},
			set: function(val){domStyle.textAlign = val;}
		},
		textid: {
			get: function(){return _textid;},
			set: function(val){text = L(_textid = val);}
		},
		wordWrap: {
			get: function(){return true;}
		}
	});

	require.mix(obj, args);
});
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Methods
	require.each(["debug", "error", "info", "log", "warn"], function(fn) {
		api[fn] = function(msg) {
			console[fn]("[" + fn.toUpperCase() + "] " + msg);
		};
	});

})(Ti._5.createClass('Ti.API'));;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	require.mix(api, require.config.app, {
		idleTimerDisabled: true,
		proximityDetection: false,
		proximityState: 0
	});

	// Methods
	api.getArguments = function(){
		console.debug('Method "Titanium.App.getArguments" is not implemented yet.');
	};
})(Ti._5.createClass('Ti.App'));
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.prop(api, 'MODAL_PRESENTATION_CURRENT_CONTEXT');

	Ti._5.prop(api, 'MODAL_PRESENTATION_FORMSHEET');

	Ti._5.prop(api, 'MODAL_PRESENTATION_FULLSCREEN');

	Ti._5.prop(api, 'MODAL_PRESENTATION_PAGESHEET');

	Ti._5.prop(api, 'MODAL_TRANSITION_STYLE_COVER_VERTICAL');

	Ti._5.prop(api, 'MODAL_TRANSITION_STYLE_CROSS_DISSOLVE');

	Ti._5.prop(api, 'MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL');

	Ti._5.prop(api, 'MODAL_TRANSITION_STYLE_PARTIAL_CURL');

	Ti._5.prop(api, 'appBadge');

	Ti._5.prop(api, 'appSupportsShakeToEdit');

	Ti._5.prop(api, 'statusBarHidden');

	Ti._5.prop(api, 'statusBarStyle');

	// Methods
	api.createNavigationGroup = function(){
		console.debug('Method "Titanium.UI.iPhone#.createNavigationGroup" is not implemented yet.');
	};
	api.hideStatusBar = function(){
		console.debug('Method "Titanium.UI.iPhone#.hideStatusBar" is not implemented yet.');
	};
	api.showStatusBar = function(){
		console.debug('Method "Titanium.UI.iPhone#.showStatusBar" is not implemented yet.');
	};
})(Ti._5.createClass('Titanium.UI.iPhone'));;
(function(api){
	// Properties
	require.mix(api, {
		"BIG": 3,
		"DARK": 2,
		"PLAIN": 1
	});

})(Ti._5.createClass('Titanium.UI.iPhone.ActivityIndicatorStyle'));
;
Ti._5.createClass("Ti.UI.ActivityIndicator", function(args){
	args = require.mix({
		visible: false
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "ActivityIndicator"),
		domStyle = domNode.style,
		_message = "",
		_style = null,
		_visible = false;

	// Interfaces
	Ti._5.Positionable(obj, args);
	Ti._5.Styleable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		color: {
			get: function(){return domStyle.color;},
			set: function(val) {
				domStyle.color = val;
			}
		},
		message: {
			get: function(){return _message;},
			set: function(val){domNode.innerHTML = _message = val;}
		},
		messageid: "",
		style: {
			get: function(){return _style;},
			set: function(val){
				_style = val;
				if (Ti.UI.iPhone) {
					domNode.className = domNode.className.replace(/\bActivityIndicator_(BIG|DARK)\b/g, "");
					switch (_style) {
						case Ti.UI.iPhone.ActivityIndicatorStyle.BIG:
							domNode.className += " ActivityIndicator_BIG";
							break;
						case Ti.UI.iPhone.ActivityIndicatorStyle.DARK:
							domNode.className += " ActivityIndicator_DARK";
							break;
					}
				}
			}
		},
		visible: {
			get: function() {
				return _visible;
			},
			set: function(val) {
				val ? obj.show() : obj.hide();
			}
		}
	});

	// Methods
	obj.hide = function(){
		domStyle.display = "none";
		_visible = false;
		obj.fireEvent("html5_hidden");
	};
	obj.show = function(){
		// Append activity indicator to current window, if it was not
		//if (!(obj.parent instanceof Ti.UI.Window) && Ti.UI.currentWindow) {
		//	Ti.UI.currentWindow.dom.appendChild(domNode);
		//}
		_visible = true;
		var oWinSizes = Ti._5.getWindowSizes();
		domStyle.display = "block";
		domStyle.top = (args["top"] || (oWinSizes.height - parseInt(domNode.offsetHeight)) * 0.5) + "px";
		domStyle.left = (args["left"] || (oWinSizes.width - parseInt(domNode.offsetWidth)) * 0.5) + "px";
		obj.fireEvent("html5_shown");
	};

	require.mix(obj, args);
});
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.prop(api, 'cancelAllLocalNotifications');

	Ti._5.prop(api, 'cancelLocalNotification');

	Ti._5.prop(api, 'registerBackgroundService');

	Ti._5.prop(api, 'scheduleLocalNotification');

	// Methods
	api.createBackgroundService = function(){
		console.debug('Method "Titanium.App.iOS.createBackgroundService" is not implemented yet.');
	};
	api.createLocalNotification = function(){
		console.debug('Method "Titanium.App.iOS.createLocalNotification" is not implemented yet.');
	};

	// Events
	api.addEventListener('notification', function(){
		console.debug('Event "notification" is not implemented yet.');
	});
})(Ti._5.createClass('Titanium.App.iOS'));;
Ti._5.createClass("Ti.UI.AlertDialog", function(args){
	var obj = this,
		_type = "alert",
		_buttonNames = null,
		_cancel = null;

	// Interfaces
	//Ti._5.DOMView(obj, "alertdialog", args, "AlertDialog");
	Ti._5.EventDriven(obj);

	obj.add = function (){};
	obj.render = function(){};
	obj.layout = null;

	// Properties
	Ti._5.prop(obj, {
		buttonNames: {
			get: function(){return _buttonNames;},
			set: function(val) {
				if (val && val.length > 1) {
					_type = "dialog";	
					_buttonNames = val;
				}
			}
		},
		cancel: {
			get: function(){return _cancel;},
			set: function(val){
				if (parseInt(val) == val) {
					_type = "dialog";	
					_cancel = val;
				}
			}
		},
		message: "",
		messageid: "",
		title: ""
	});

	require.mix(obj, args);

	// Methods
	obj.hide = function(){
		console.debug('Method "Titanium.UI.AlertDialog#.hide" is not implemented yet.');
	};
	obj.show = function(){
		var isConfirm = false;
		if ("alert" == _type) {
			alert(obj.message);
		} else {
			isConfirm = confirm(obj.message);
		}
		obj.fireEvent("click", {
			cancel: !isConfirm,
			index: !isConfirm|0
		});
	};
});;
Ti.UI._capitalizeValue = function (_autocapitalization, sValue) {
	if (!sValue) {
		return;
	}
	var resultValue = '';
	switch (_autocapitalization) {
		case Ti.UI.TEXT_AUTOCAPITALIZATION_NONE:  
			resultValue = sValue;
			break;
		case Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS:
			var sTemp = sValue;
			var sEnd = '', iIndex = sValue.length-1;
			while (/[\s,\.!?]/.test(sValue.charAt(iIndex)) && 0 <= iIndex) {
				sEnd += sValue.charAt(iIndex);
				iIndex--;
			}
			sEnd = sEnd.split("").reverse().join("");
			if (!sValue.match(/^[\s,\.!?]/i)) {
				sTemp = ' '+sValue;
			}
			sTemp = sTemp.match(/[\s,\.!]+\w+/gi);
			if (sTemp) {
				for (var iCounter=0; iCounter < sTemp.length; iCounter++) {
					// Found first letter
					for (var jCounter=0; jCounter < sTemp[iCounter].length; jCounter++) {
						if (/\w/.test(sTemp[iCounter].charAt(jCounter))) {
							break;
						}
					}
					sTemp[iCounter] = sTemp[iCounter].replace(
						sTemp[iCounter].charAt(jCounter),
						sTemp[iCounter].charAt(jCounter).toUpperCase()
					);
				}
				if (!sValue.match(/^[\s,\.!?]/i)) {
					sTemp[0] = sTemp[0].replace(sTemp[0].charAt(0), '');
				}
				resultValue = sTemp.join('')+sEnd;
			} else {
				resultValue = _prevVal+sEnd;
			}
			break;
		case Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES:
			var sTemp = sValue;
			var sEnd = '', iIndex = sValue.length-1;
			while (/[\.!?]/.test(sValue.charAt(iIndex)) && 0 <= iIndex) {
				sEnd += sValue.charAt(iIndex);
				iIndex--;
			}
			sEnd = sEnd.split("").reverse().join("");
			if (sValue.match(/^\w/i)) {
				sTemp = '!'+sValue;
			}
			sTemp = sTemp.match(/[\.!?]+[\s]*[^\.!?]+/gi);
			if (sTemp) {
				var iIndex = 0;
				for (var iCounter=0; iCounter < sTemp.length; iCounter++) {
					iIndex=0; 
					while (false == /\w/.test(sTemp[iCounter][iIndex])) {
						iIndex++;
					}
					sTemp[iCounter] = sTemp[iCounter].substr(0,iIndex) +
						sTemp[iCounter][iIndex].toUpperCase() +
						sTemp[iCounter].substr(iIndex+1);
				}
				if (sValue.match(/^\w/i)) {
					sTemp[0] = sTemp[0].replace(sTemp[0].charAt(0), '');
				}
				resultValue = sTemp.join('')+sEnd;
			} else {
				resultValue = sEnd;
			}
			break;
		case Ti.UI.TEXT_AUTOCAPITALIZATION_ALL:
			resultValue = sValue.toUpperCase();
			break;
	}
	
	return resultValue;
}		

Ti.UI._updateText = function(obj) {
	var _selectionStart = obj.dom.selectionStart;
	var _selectionEnd = obj.dom.selectionEnd;
	obj.value = Ti.UI._capitalizeValue(obj.autocapitalization, obj.value);
	obj.dom.selectionStart = _selectionStart;
	obj.dom.selectionEnd = _selectionEnd;
};
;
Ti._5.createClass("Ti.UI.TextField", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var undef,
		obj = this,
		domNode = Ti._5.DOMView(obj, "input", args, "TextField"),
		domStyle = domNode.style,
		on = require.on,
		_autocapitalization = 0,
		_autocapitalizationLoaded = false,
		_backgroundImage = "",
		_backgroundColor = "",
		_borderStyle = Ti.UI.INPUT_BORDERSTYLE_LINE,
		_clearOnEdit = null,
		_clearOnEditLoaded = false,
		_paddingLeft = null,
		_paddingRight = null,
		_suppressReturn = null,
		_suppressLoaded = false,
		_vertAlign = "auto";

	// Interfaces
	Ti._5.Clickable(obj);
	Ti._5.Interactable(obj);
	Ti._5.Touchable(obj, args, true);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		autocapitalization: {
			get: function() {return _autocapitalization;},
			set: function(val) {
				_autocapitalization = val;
				if (!_autocapitalizationLoaded) {
					on(domNode, "keyup", function() {
						Ti.UI._updateText(obj);
					});
				}
				obj.value = Ti.UI._capitalizeValue(_autocapitalization, obj.value);
			}
		},
		backgroundDisabledColor: "",
		backgroundDisabledImage: "",
		borderStyle: {
			get: function() {
				return _borderStyle ? _borderStyle : "";
			},
			set: function(val) {
				switch(_borderStyle = val){
					case Ti.UI.INPUT_BORDERSTYLE_NONE:
						domStyle.borderStyle = "none";
						break;
					case Ti.UI.INPUT_BORDERSTYLE_LINE:
						domStyle.borderStyle = "solid";
						break;
					case Ti.UI.INPUT_BORDERSTYLE_ROUNDED:
						domStyle.borderStyle = "rounded";
						domStyle.borderRadius = domStyle.borderRadius ? domStyle.borderRadius : domStyle.borderWidth;
						break;
					case Ti.UI.INPUT_BORDERSTYLE_BEZEL:
						domStyle.borderStyle = "solid";
						break;
				}
			}
		},
		clearButtonMode: undef,
		clearOnEdit: {
			get: function(){return _clearOnEdit;},
			set: function(val) {
				_clearOnEdit = val;
				_clearOnEditLoaded || on(domNode, "focus", function() {
					_clearOnEdit && (obj.value = "");
				});
			}
		},
		editable: {
			get: function() { return obj.enabled; },
			set: function(val) {domNode.disabled = !val ? "disabled" : "";}
		},
		enabled: {
			get: function(){return !domNode.disabled;},
			set: function(val) {
				_backgroundImage || (_backgroundImage = obj.backgroundImage);
				_backgroundColor || (_backgroundColor = obj.backgroundColor);
				if (val) {
					domNode.disabled = "";
					obj.backgroundImage = _backgroundImage;
					obj.backgroundColor = _backgroundColor;
				} else {
					domNode.disabled = "disabled";
					obj.backgroundDisabledImage && (obj.backgroundImage = obj.backgroundDisabledImage);
					obj.backgroundDisabledColor && (obj.backgroundColor = obj.backgroundDisabledColor);
				}
			}
		},
		hintText: {
			get: function() {return domNode.placeholder;},
			set: function(val) {
				domNode.placeholder = val;
			}
		},
		keyboardToolbar: undef,
		keyboardToolbarColor: undef,
		keyboardToolbarHeight: undef,
		leftButton: undef,
		leftButtonMode: undef,
		leftButtonPadding: undef,
		minimumFontSize: undef,
		paddingLeft: {
			get: function() {return parseInt(domStyle.paddingLeft);},
			set: function(val) {domStyle.paddingLeft = Ti._5.px(val);}
		},
		paddingRight: {
			get: function() {return parseInt(domStyle.paddingRight);},
			set: function(val) {domStyle.paddingRight = Ti._5.px(val);}
		},
		rightButton: undef,
		rightButtonMode: undef,
		rightButtonPadding: undef,
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		suppressReturn: {
			get: function() {return _suppressReturn;},
			set: function(val) {
				_suppressReturn = val;
				if (!_suppressLoaded) {
					_suppressLoaded = true;
					on(domNode, "keyup", function(evt) {
						if (_suppressReturn && evt.keyCode == 13) {
							evt.preventDefault && evt.preventDefault();
							return false;
						}
						return true;
					});
				}
			}
		},
		value: {
			get: function() {return domNode.value;},
			set: function(val) {
				domNode.value = val ? Ti.UI._capitalizeValue(_autocapitalization, val) : "";
			}
		},
		verticalAlign: {
			get: function(){return _vertAlign;},
			set: function(val){
				if (parseInt(val) == val) {
					domStyle.lineHeight = val + "px";
				} else {
					switch (val) {
						case "top":
							_vertAlign = "top";
							domStyle.lineHeight = "auto";
							break;
						case "bottom":
							_vertAlign = "bottom";
							domStyle.lineHeight = (obj.height + ((obj.height  - obj.fontSize) * 0.5)) + "px";
							break;
						default:
							_vertAlign = val || "auto";
							domStyle.lineHeight = "auto";
					}
				}
			}
		}
	});

	require.mix(obj, args);

	// Methods
	obj.focus = function(ev) {
		domNode.focus(ev);
	}
	obj.blur = function(ev) {
		domNode.blur(ev);
	}
	obj.hasText = function() {
		return !!obj.value;
	}
});
;
Ti._5.createClass("Ti.UI.Button", function(args){
	var obj = this,
		domNode = Ti._5.DOMView(obj, "button", args, "Button"),
		_title = "",
		_titleObj,
		_image,
		_imageObj,
		_backgroundImage = null,
		_borderWidthCache = "",
		_backgroundImageCache = "",
		_backgroundColorCache = "",
		_enabled = true,
		_backgroundDisabledImage = null,
		_backgroundDisabledColor = null,
		_selectedColor = null,
		_prevTextColor = null,
		_selectedColorLoaded = false,
		_titleid = null;

	// Interfaces
	Ti._5.Clickable(obj);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		backgroundDisabledColor: {
			get: function() {
				return _backgroundDisabledColor ? _backgroundDisabledColor : "";
			},
			set: function(val) {
				_backgroundDisabledColor = val;
			}
		},
		backgroundDisabledImage: {
			get: function() {
				return _backgroundDisabledImage ? _backgroundDisabledImage : "";
			},
			set: function(val) {
				_backgroundDisabledImage = val;
			}
		},
		backgroundImage: {
			get: function() {
				return _backgroundImage;
			},
			set: function(val) {
				_backgroundImage = val;
	
				if (val) {
					// cache borderWidth, backgroundColor to restore them later
					_borderWidthCache = obj.borderWidth;
					_backgroundColorCache = obj.dom.style.backgroundColor;
					obj.dom.style.borderWidth = 0;
					obj.dom.style.backgroundColor = "transparent";
					obj.dom.style.backgroundImage = "url(" + Ti._5.getAbsolutePath(val) + ")";
				} else {
					obj.dom.style.borderWidth = _borderWidthCache;
					obj.dom.style.backgroundColor = _backgroundColorCache;
					obj.dom.style.backgroundImage = "";
				}
			}
		},
		enabled: {
			get: function(){return _enabled;},
			set: function(val) {
				// do nothing if widget is already in obj state
				if(_enabled !== val){
					_enabled = val;
					if(_enabled) {
						obj.dom.disabled = false;
						if(_backgroundImageCache){
							obj.backgroundImage = _backgroundImageCache;
						}
						if(_backgroundColorCache){
							obj.backgroundColor = _backgroundColorCache;
						}
		
						_backgroundImageCache = null;
						_backgroundColorCache = null;
					} else {
						obj.dom.disabled = true;
						if (_backgroundDisabledImage) {
							if (obj.backgroundImage) {
								_backgroundImageCache = obj.backgroundImage;
							}
							obj.backgroundImage = _backgroundDisabledImage;
						}
						if (_backgroundDisabledColor) {
							if (obj.backgroundColor) {
								_backgroundColorCache = obj.backgroundColor;
							}
							obj.backgroundColor = _backgroundDisabledColor;
						}
					}
				}
			}
		},
		image: {
			get: function() {return _image;},
			set: function(val){
				if (_imageObj == null) {
					_imageObj = document.createElement("img");
					if(_titleObj){
						// insert image before title
						obj.dom.insertBefore(_imageObj, _titleObj);
					} else {
						obj.dom.appendChild(_imageObj);
					}
				}
				_image = Ti._5.getAbsolutePath(val);
				_imageObj.src = _image;
			}
		},
		selectedColor: {
			get: function(){return _selectedColor;},
			set: function(val) {
				_selectedColor = val;
				if (!_selectedColorLoaded) {
					_selectedColorLoaded = true;
					require.on(obj.dom, "focus", function() {
						_prevTextColor = obj.color;
						obj.color = _selectedColor;
					});
					require.on(obj.dom, "blur", function() {
						_prevTextColor && (obj.color = _prevTextColor);
					});
				}
			}
		},
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		style: null,
		title: {
			get: function() {return _title || obj.dom.innerHTML;},
			set: function(val) {
				_title = val;
				_titleObj && obj.dom.removeChild(_titleObj);
				_titleObj = document.createTextNode(_title);
				obj.dom.appendChild(_titleObj);
			}
		},
		titleid: {
			get: function(){return _titleid;},
			set: function(val){obj.title = L(_titleid = val);}
		}
	});

	obj.add = function(view) {
		obj._children = obj._children || [];
		obj._children.push(view);

		// if we have been rendered and add is called - re-render
		obj._rendered && obj.parent && obj.parent.dom && (obj.dom.offsetHeight || obj.dom.offsetWidth) && (obj.parent.dom.offsetHeight || obj.parent.dom.offsetWidth) && obj.render(null);
	};

	require.mix(obj, args);
});
;
Ti._5.createClass("Ti.UI.PickerRow", function(args){
	args = require.mix({
		backgroundColor: "white",
		font: require.mix({
			fontFamily: "Arial",
			fontSize: 13,
			fontStyle: "normal",
			fontVariant: "normal",
			fontWeight: "normal"
		}, args.font),
		unselectable: true
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "option", args, "PickerRow"),
		domStyle = domNode.style,
		_title = null,
		_prevDisplay = "";

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		selected: {
			get: function(){return domNode.selected;},
			set: function(val){domNode.selected = !!val;}
		},
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		title: {
			get: function(){return _title;},
			set: function(val){
				_title = val; 
				domNode.innerHTML = Ti._5._changeTextToHTML(_title); 
				obj.render(null);
			}
		}
	});

	obj.show = function() {
		domStyle.display = _prevDisplay ? _prevDisplay : "";
		if (obj.parent) {
			obj.parent.dom.innerHTML = "";
			obj.parent.render(null);
		}
	};
	obj.hide = function() {
		if ("none" != domStyle.display) {
			_prevDisplay = domStyle.display;
			domStyle.display = "none";
			if (obj.parent) {
				if (domNode.selected && 1 < obj.parent._children.length) {
				obj.parent._children.length > obj.parent.dom.selectedIndex ? 
					obj.parent.setSelectedRow(0, obj.parent.dom.selectedIndex+1) :
					obj.parent.setSelectedRow(0, obj.parent.dom.selectedIndex-1);
				}
				obj.parent.dom.innerHTML = "";
				obj.parent.render(null);
			}
		}
	};

	require.mix(obj, args);
});;
Ti._5.createClass('Ti.UI.2DMatrix', function(args) {
	var obj = this;

	// Initialize the matrix to unity
	require.mix(obj, {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		tx: 0,
		ty: 0
	}, args);

	// Internal methods
	function _multiplyInternal(a, b, c, d, tx, ty) {
		return Ti.UI.create2DMatrix({
			a: obj.a * a + obj.b * c,
			b: obj.a * b + obj.b * d,
			c: obj.c * a + obj.d * c,
			d: obj.c * b + obj.d * d,
			tx: obj.a * tx + obj.b * ty + obj.tx,
			ty: obj.c * tx + obj.d * ty + obj.ty
		});
	}
	
	this.toCSS = function() {
		// Round off the elements because scientific notation in CSS isn't allowed (apparently)
		var roundedValues = [obj.a.toFixed(6), obj.b.toFixed(6), obj.c.toFixed(6), obj.d.toFixed(6), obj.tx.toFixed(6), obj.ty.toFixed(6)];

		// Firefox requires tx and ty to have "px" postfixed, but the other browsers require it *not* to be there.
		if (navigator.userAgent.indexOf("Firefox") !== -1) {
			roundedValues[4] += "px";
			roundedValues[5] += "px";
		}

		return "matrix(" + roundedValues.join(",") + ")";
	};

	this.fromCSS = function(matrixString) {
		var parsedString = matrixString.replace(/^matrix\((.+)\)$/, function(x, y){ return y; }).split(",");
		obj.a = parseFloat(parsedString[0] | 0);
		obj.b = parseFloat(parsedString[1] | 0);
		obj.c = parseFloat(parsedString[2] | 0);
		obj.d = parseFloat(parsedString[3] | 0);
		obj.tx = parseFloat(parsedString[4] | 0);
		obj.ty = parseFloat(parsedString[5] | 0);
	};

	// Methods
	this.invert = function() {
		console.debug('Method "Titanium.UI.2DMatrix#.invert" is not implemented yet.');
	};
	this.multiply = function(m) {
		return _multiplyInternal(m.a, m.b, m.c, m.d, m.tx, m.ty);
	};
	this.rotate = function(angle) {
		// Math.* trig functions take radians, so convert from degrees first
		var angleInRadians = angle * Math.PI / 180;
		return _multiplyInternal(Math.cos(angleInRadians), Math.sin(angleInRadians), -Math.sin(angleInRadians), Math.cos(angleInRadians), 0, 0);
	};
	this.scale = function(sx, sy) {
		return _multiplyInternal(sx, 0, 0, sy, 0, 0);
	};
	this.translate = function(tx, ty) {
		return _multiplyInternal(1, 0, 0, 1, tx, ty);
	};
});;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.propReadOnly(api, {
		MODE_APPEND: 1,
		MODE_READ: 2,
		MODE_WRITE: 3,
		applicationDataDirectory: "/",
		applicationDirectory: "/",
		lineEnding: "\n",
		resourcesDirectory: "/",
		separator: "/",
		tempDirectory: null
	});

	// Methods
	api.createFile = function(){
		console.debug('Method "Titanium.Filesystem.createFile" is not implemented yet.');
	};
	api.createTempDirectory = function(){
		console.debug('Method "Titanium.Filesystem.createTempDirectory" is not implemented yet.');
	};
	api.createTempFile = function(){
		console.debug('Method "Titanium.Filesystem.createTempFile" is not implemented yet.');
	};
	api.getFile = function(){
		console.debug('Method "Titanium.Filesystem.getFile" is not implemented yet.');
		return new Ti.Filesystem.File;
	};
	api.isExternalStoragePresent = function(){
		console.debug('Method "Titanium.Filesystem.isExternalStoragePresent" is not implemented yet.');
	};
})(Ti._5.createClass('Ti.Filesystem'));;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	var _httpURLFormatter = null;

	// Properties
	Ti._5.propReadOnly(api, {
		INADDR_ANY: null,
		NETWORK_LAN: 1,
		NETWORK_MOBILE: 3,
		NETWORK_NONE: 0,
		NETWORK_UNKNOWN: -1,
		NETWORK_WIFI: 2,
		NOTIFICATION_TYPE_ALERT: 0,
		NOTIFICATION_TYPE_BADGE: 1,
		NOTIFICATION_TYPE_SOUND: 2,
		READ_MODE: 0,
		READ_WRITE_MODE: 2,
		WRITE_MODE: 1,
		networkType: function() {
			if (!api.online) {
				return api.NETWORK_NONE;
			}		
			if (navigator.connection && navigator.connection.type == navigator.connection.WIFI) {
				return api.NETWORK_WIFI;
			}
			if (navigator.connection && navigator.connection.type == navigator.connection.ETHERNET) {
				return api.NETWORK_LAN;
			}
			if (
				navigator.connection &&
				(navigator.connection.type == navigator.connection.CELL_2G ||
				navigator.connection.type == navigator.connection.CELL_3G)			
			) {
				return api.NETWORK_MOBILE;
			}
			
			return api.NETWORK_UNKNOWN;
		},
		networkTypeName: function() {
			if (!api.online) {
				return "NONE";
			}		
			if (navigator.connection && navigator.connection.type == navigator.connection.WIFI) {
				return "WIFI";
			}
			if (navigator.connection && navigator.connection.type == navigator.connection.ETHERNET) {
				return "LAN";
			}
			if (
				navigator.connection &&
				(navigator.connection.type == navigator.connection.CELL_2G ||
				navigator.connection.type == navigator.connection.CELL_3G)			
			) {
				return "MOBILE";
			}
			
			return "UNKNOWN";
		},
		online: function() {
			return navigator.onLine;
		}
	});
	
	Ti._5.prop(api, "httpURLFormatter", {
		get: function() {return _httpURLFormatter;},
		set: function(val) {_httpURLFormatter = val;}
	});

	// Methods
	api.createHTTPClient = function(args) {
		return new Ti.Network.HTTPClient(args);
	};

	api.decodeURIComponent = function(value) {
		return decodeURIComponent(value);
	};

	api.encodeURIComponent = function(value) {
		return encodeURIComponent(value);
	};
	
	// IPhone only
	api.registerForPushNotifications = function(){
		console.debug('Method "Titanium.Network.registerForPushNotifications" is not implemented yet.');
	};

	// deprecated since 1.7.0
	api.removeConnectivityListener = function(){
		console.debug('Method "Titanium.Network.removeConnectivityListener" is not implemented yet.');
	};

	// Events
	require.on(window, "online", function(evt) {
		api.online || api.fireEvent("change", {
			networkType		: api.networkType,
			networkTypeName	: api.networkTypeName,
			online			: true,
			source			: evt.target,
			type			: evt.type
		});
		api.online = true;
	});
	
	require.on(window, "offline", function(evt) {
		api.online && api.fireEvent("change", {
			networkType		: api.networkType,
			networkTypeName	: api.networkTypeName,
			online			: false,
			source			: evt.target,
			type			: evt.type
		});
		api.online = false;
	});
})(Ti._5.createClass("Ti.Network"));
;
Ti._5.createClass("Ti.Network.HTTPClient", function(args){
	var obj = this,
		on = require.on,
		xhr = new XMLHttpRequest(),
		requestComplete = false,
		_callErrorFunc = function(error) {
			obj.responseText = obj.responseXML = obj.responseData = "";
			require.is(error, "Object") || (error = { message: error });
			error.error || (error.error = error.message ? error.message : xhr.status);
			parseInt(error.error) || (error.error = "Can`t reach host");
			require.is(obj.onerror, "Function") && obj.onerror(error);
		};

	//xhr.overrideMimeType("text/xml");
	xhr.timeout = 60000; // Default timeout = 1 minute
	xhr.ontimeout = function(error) {
		_callErrorFunc(error);
	};
	xhr.onreadystatechange = function() {
		require.is(obj.onreadystatechange, "Function") && obj.onreadystatechange();
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				obj.connected = true;
				obj.responseText = xhr.responseText;
				obj.responseXML = xhr.responseXML;
				obj.responseData = xhr.responceHeader;
				require.is(obj.onload, "Function") && obj.onload();
			} else {
				obj.connected = false;
			}
			requestComplete = true;
		}
	};
	on(xhr, "error", function(error) {
		_callErrorFunc(error);
	});
	on(xhr.upload, "error", function(error) {
		_callErrorFunc(error);
	});
	on(xhr, "progress", function(evt) {
		evt.progress = evt.lengthComputable ? evt.loaded / evt.total : false;
		require.is(obj.onsendstream, "Function") && obj.onsendstream(evt);
	});
	on(xhr.upload, "progress", function(evt) {
		evt.progress = evt.lengthComputable ? evt.loaded / evt.total : false;
		require.is(obj.onsendstream, "Function") && obj.onsendstream(evt);
	});

	// Properties
	Ti._5.prop(obj, {
		DONE: function() {return _xml.DONE;},
		HEADERS_RECEIVED: function(){return _xml.HEADERS_RECEIVED;},
		LOADING: function(){return _xml.LOADING;},
		OPENED: function(){return _xml.OPENED;},
		UNSENT: function(){return _xml.UNSENT;},
		readyState: function() { return xhr.readyState; },
		status: function() { return xhr.status; }
	});

	Ti._5.prop(obj, {
		connected: false,
		connectionType: null,
		file: null,
		location: null,
		ondatastream: null,
		onerror: null,
		onload: null,
		onreadystatechange: null,
		onsendstream: null,
		responseData: null,
		responseText: null,
		responseXML: null,
		timeout: {
			get: function() {return xhr.timeout;},
			set: function(val) {xhr.timeout = val;}
		},
		validatesSecureCertificate: false
	});

	// Methods
	obj.abort = function() {
		xhr.abort();
	};
	obj.getResponseHeader = function(name) {
		return xhr.readyState === 2 ? xhr.getResponseHeader(name) : null;
	};
	obj.open = function(method, url, async) {
		var u,
			httpURLFormatter = Ti.Network.httpURLFormatter;

		httpURLFormatter && (url = httpURLFormatter(url));

		requestComplete = false;
		obj.connectionType = method;
		obj.location = Ti._5.getAbsolutePath(url);
		async === u && (async = true);

		xhr.open(obj.connectionType, obj.location, async);
		xhr.setRequestHeader("UserAgent", Ti.userAgent);
		//xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
		//xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	};
	obj.send = function(args){
		requestComplete = false;
		obj.responseText = "";
		obj.responseXML = "";
		obj.responseData = "";
		try {
			xhr.send(args || null);
		} catch (error) {
			_callErrorFunc(error);
		}
	};
	obj.setRequestHeader = function(label,value) {
		xhr.setRequestHeader(label,value);
	};
	obj.setTimeout = function(timeout) {
		if ("undefined" == typeof timeout) {
			timeout = _timeout;
		}
		setTimeout(function(){
			if (!requestComplete){
				xhr.abort();
				_callErrorFunc("Request was aborted");
			}
		}, timeout);
	};
});
;
Ti._5.createClass("Ti.UI.Animation", function(args){
	args = args || {};

	// Properties
	Ti._5.prop(this, {
		autoreverse: args.autoreverse,
		backgroundColor: args.backgroundColor,
		bottom: args.bottom,
		center: args.center,
		color: args.color,
		curve: args.curve,
		delay: args.delay,
		duration: args.duration,
		height: args.height,
		left: args.left,
		opacity: args.opacity,
		opaque: args.opaque,
		repeat: repeat,
		right: args.right,
		rotation: args.rotation,
		transform: args.transform,
		transition: args.transition,
		top: args.top,
		visible: args.visible,
		width: args.width,
		zIndex: args.zIndex
	});
});;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	var undef,
		lastShake = (new Date()).getTime(),
		lastAccel = {};

	require.on(window, "devicemotion", function(evt) {
		var e = evt.acceleration || evt.accelerationIncludingGravity,
			currentTime,
			accel = e && {
				x: e.x,
				y: e.y,
				z: e.z,
				source: evt.source
			};
		if (accel) {
			if (lastAccel.x !== undef && (
				Math.abs(lastAccel.x - accel.x) > 0.2 || 
				Math.abs(lastAccel.y - accel.y) > 0.2 ||
				Math.abs(lastAccel.z - accel.z) > 0.2
			)) {
				currentTime = (new Date()).getTime();
				accel.timestamp = currentTime - lastShake;
				lastShake = currentTime;
				api.fireEvent("update", accel);
			}
			lastAccel = accel;
		}
	});

})(Ti._5.createClass("Ti.Accelerometer"));;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.propReadOnly(api, {
		HYBRID_TYPE: 0,
		SATELLITE_TYPE: 1,
		STANDARD_TYPE: 2
	});

	// Methods
	api.createAnnotation = function(){
		console.debug('Method "Titanium.Map.createAnnotation" is not implemented yet.');
	};
	api.createMapView = function(){
		console.debug('Method "Titanium.Map.createMapView" is not implemented yet.');
	};
})(Ti._5.createClass('Ti.Map'));;
Ti._5.createClass('Titanium.UI.iPhone.SystemButton', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.systembutton', args, 'iPhone.SystemButton');

	// Properties
	Ti._5.prop(this, 'ACTION');

	Ti._5.prop(this, 'ACTIVITY');

	Ti._5.prop(this, 'ADD');

	Ti._5.prop(this, 'BOOKMARKS');

	Ti._5.prop(this, 'CAMERA');

	Ti._5.prop(this, 'CANCEL');

	Ti._5.prop(this, 'COMPOSE');

	Ti._5.prop(this, 'CONTACT_ADD');

	Ti._5.prop(this, 'DISCLOSURE');

	Ti._5.prop(this, 'DONE');

	Ti._5.prop(this, 'EDIT');

	Ti._5.prop(this, 'FAST_FORWARD');

	Ti._5.prop(this, 'FIXED_SPACE');

	Ti._5.prop(this, 'FLEXIBLE_SPACE');

	Ti._5.prop(this, 'INFO_DARK');

	Ti._5.prop(this, 'INFO_LIGHT');

	Ti._5.prop(this, 'ORGANIZE');

	Ti._5.prop(this, 'PAUSE');

	Ti._5.prop(this, 'PLAY');

	Ti._5.prop(this, 'REFRESH');

	Ti._5.prop(this, 'REPLY');

	Ti._5.prop(this, 'REWIND');

	Ti._5.prop(this, 'SAVE');

	Ti._5.prop(this, 'SPINNER');

	Ti._5.prop(this, 'STOP');

	Ti._5.prop(this, 'TRASH');


	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.iPhone.SystemButtonStyle', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.systembuttonstyle', args, 'iPhone.SystemButtonStyle');

	// Properties
	Ti._5.prop(this, 'BAR');

	Ti._5.prop(this, 'BORDERED');

	Ti._5.prop(this, 'DONE');

	Ti._5.prop(this, 'PLAIN');

	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.Android', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'android', args, 'Android');

	// Properties
	api.SWITCH_STYLE_CHECKBOX = 1;
	api.SWITCH_STYLE_TOGGLEBUTTON = 2;

	Ti._5.prop(this, 'LINKIFY_ALL');

	Ti._5.prop(this, 'LINKIFY_EMAIL_ADDRESSES');

	Ti._5.prop(this, 'LINKIFY_MAP_ADDRESSES');

	Ti._5.prop(this, 'LINKIFY_MAP_LINKS');

	Ti._5.prop(this, 'LINKIFY_PHONE_NUMBERS');

	Ti._5.prop(this, 'LINKIFY_WEB_URLS');

	Ti._5.prop(this, 'SOFT_INPUT_ADJUST_PAN');

	Ti._5.prop(this, 'SOFT_INPUT_ADJUST_RESIZE');

	Ti._5.prop(this, 'SOFT_INPUT_ADJUST_UNSPECIFIED');

	Ti._5.prop(this, 'SOFT_INPUT_STATE_HIDDEN');

	Ti._5.prop(this, 'SOFT_INPUT_STATE_UNSPECIFIED');

	Ti._5.prop(this, 'SOFT_INPUT_STATE_VISIBLE');

	Ti._5.prop(this, 'SOFT_KEYBOARD_DEFAULT_ON_FOCUS');

	Ti._5.prop(this, 'SOFT_KEYBOARD_HIDE_ON_FOCUS');

	Ti._5.prop(this, 'SOFT_KEYBOARD_SHOW_ON_FOCUS');

	// Methods
	this.hideSoftKeyboard = function(){
		console.debug('Method "Titanium.UI.Android#.hideSoftKeyboard" is not implemented yet.');
	};
	this.openPreferences = function(){
		console.debug('Method "Titanium.UI.Android#.openPreferences" is not implemented yet.');
	};

	require.mix(this, args);
});;
(function(api){

	// Properties
	require.mix(api, {
		"NONE": 0,
		"SINGLE_LINE": 1
	});

})(Ti._5.createClass('Titanium.UI.iPhone.TableViewSeparatorStyle'));;
Ti._5.createClass("Ti.UI.TableViewRow", function(args){
	args = require.mix({
		backgroundColor: "transparent",
		font: require.mix({
			fontFamily: "Helvetica",
			fontSize: 20,
			fontStyle: "normal",
			fontVariant: "normal",
			fontWeight: "bold"
		}, args.font),
		unselectable: true,
		width: "100%"
	}, args);

	var undef,
		obj = this,
		domNode = Ti._5.DOMView(obj, "li", args, "TableViewRow"),
		domStyle = domNode.style,
		on = require.on,
		px = Ti._5.px;

	obj._rowData = args || {};

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Set needed style rules
	//domStyle.display = "table-cell";
	domStyle.lineHeight = args["height"] ? args["height"] : "50px";

	// use single DOM element for all row states - this is required to show only one state at a time and avoid creating
	// too many DOM elements
	var _stateObj = document.createElement("div"),
		// stack for holding states
		_statesStack = [],
		_colorRow = "#000000",
		_hasCheck,
		_hasChild,
		_hasDetail,
		_indentionLevel = 0,
		_leftImage = null,
		_leftImageObj = null,
		_rightImage = null,
		_rightImageObj = null,
		_selectionStyle = null,
		_title = "",
		_titleObj = document.createElement("span"),
		_height;

	_stateObj.className = "";

	domNode.appendChild(_titleObj);

	// remove given state from stack
	function _removeFromStack(state){
		var res = [];
		for(var ii = 0; ii < _statesStack.length; ii++){
			var val = _statesStack[ii];
			if(val != state){
				res.push(val);
			}
		}
		_statesStack = res;
	}

	// add new state - visualize latest available state
	function _addState(state){
		if(_stateObj.className == state){
			// do nothing if already in this state
			return;
		}
		if(_stateObj.className != ""){
			_statesStack.push(_stateObj.className);
		}
		_removeFromStack(state);
		_stateObj.className = state;
		domNode.appendChild(_stateObj);
	}

	// remove given state
	function _removeState(state){
		if(_stateObj.className != ""){
			_statesStack.push(_stateObj.className);
		}
		_removeFromStack(state);
		if(_statesStack.length > 0){
			_stateObj.className = _statesStack[_statesStack.length - 1];
		} else if(_stateObj.parentNode == domNode){
			domNode.removeChild(_stateObj);
		}
	}

	// Properties
	Ti._5.prop(obj, {
		backgroundDisabledColor: undef,
		backgroundDisabledImage: undef,
		className: undef,
		color: {
			get: function(){return _colorRow;},
			set: function(val){
				domStyle.color = _colorRow = val;
			}
		},
		hasCheck: {
			get: function(){return _hasCheck;},
			set: function(val){
				_hasCheck = val;
				if(val){
					_addState("hasCheck");
				} else {
					_removeState("hasCheck");
				}
			}
		},
		hasChild: {
			get: function(){return _hasChild;},
			set: function(val){
				_hasChild = val;
				if(val){
					_addState("hasChild");
				} else {
					_removeState("hasChild");
				}
			}
		},
		hasDetail: {
			get: function(){return _hasDetail;},
			set: function(val){
				_hasDetail = val;
				if(val){
					_addState("hasDetail");
				} else {
					_removeState("hasDetail");
				}
			}
		},
		indentionLevel: {
			get: function(){return _indentionLevel;},
			set: function(val){_indentionLevel = parseInt(val);}
		},
		layout: undef,
		leftImage: {
			get: function(){return _leftImage;},
			set: function(val){
				_leftImage = val;
				var img;
				if(_leftImageObj == null){
					_leftImageObj = document.createElement("div");
					_leftImageObj.className = "leftImage";
					var inner = document.createElement("div");
					_leftImageObj.appendChild(inner);
					img = document.createElement("img");
					inner.appendChild(img);
				} else {
					img = _leftImageObj.firstChild.firstChild;
				}
				if(_leftImage == "" || _leftImage == null){
					domNode.removeChild(_leftImageObj);
				} else {
					img.src = Ti._5.getAbsolutePath(_leftImage);
					domNode.appendChild(_leftImageObj);
				}
			}
		},
		rightImage: {
			get: function(){return _rightImage;},
			set: function(val){
				_rightImage = val;
				var img;
				if(_rightImageObj == null){
					_rightImageObj = document.createElement("div");
					_rightImageObj.className = "rightImage";
					var inner = document.createElement("div");
					_rightImageObj.appendChild(inner);
					img = document.createElement("img");
					inner.appendChild(img);
				} else {
					img = _rightImageObj.firstChild.firstChild;
				}
				if(_rightImage == "" || _rightImage == null){
					domNode.removeChild(_rightImageObj);
					domNode.className = domNode.className.replace(/\s*hasRightImage/, "");
				} else {
					img .src = Ti._5.getAbsolutePath(_rightImage);
					domNode.appendChild(_rightImageObj);
					domNode.className += " hasRightImage";
				}
			}
		},
		selectedBackgroundColor: "#cccccc",
		selectedBackgroundImage: undef,
		selectedColor: obj.color,
		selectionStyle: {
			get: function(){return _selectionStyle;},
			set: function(val){
				_selectionStyle = val;
				for (var sProp in val) {
					if ("undeined" != typeof obj[sProp]) {
						obj[sProp] = val[sProp];
					}
				}
			}
		},
		title: {
			get: function(){return _title;},
			set: function(val) {
				_titleObj.innerHTML = Ti._5._changeTextToHTML(_title = val);
			}
		},
		top: {
			get: function() {
				return domStyle.paddingTop ? parseInt(domStyle.paddingTop) : "";
			},
			set: function(val) {
				domStyle.paddingBottom = "";
				domStyle.paddingTop = px(val);
			}
		},
		bottom: {
			get: function() {
				return domStyle.paddingBottom ? parseInt(domStyle.paddingBottom) : "";
			},
			set: function(val) {
				domStyle.paddingTop = "";
				domStyle.paddingBottom = px(val);
			}
		},
		left: {
			get: function() {
				return domStyle.paddingLeft ? parseInt(domStyle.paddingLeft) : "";
			},
			set: function(val) {
				domStyle.paddingRight = "";
				domStyle.paddingLeft = px(val);
			}
		},
		right: {
			get: function() {
				return domStyle.paddingRight ? parseInt(domStyle.paddingRight) : "";
			},
			set: function(val) {
				domStyle.paddingLeft = "";
				domStyle.paddingRight = px(val);
			}
		},
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = px(val.width));
				val.height && (obj.height = px(val.height));
			}
		},
		height: {
			get: function() {
				return _height;
			},
			set: function(val) {
				domStyle.lineHeight = domStyle.height = _height = val + (/^\d+$/.test(val) ? "px" : "");
			}
		},
		header: {
			get: function(){return obj._rowData.header;},
			set: function(val) {
				obj._rowData.header = val;
				if (obj.parent && obj.parent instanceof Ti.UI.TableViewSection) {
					obj.parent.headerTitle = val;
				}
			}
		},
		footer: {
			get: function(){return obj._rowData.footer;},
			set: function(val) {
				obj._rowData.footer = val;
				if (obj.parent && obj.parent instanceof Ti.UI.TableViewSection) {
					obj.parent.footerTitle = val;
				}
			}
		}
	});

	require.mix(obj, args);

	domNode._calcHeight = false;
	obj.addEventListener("html5_added", function(){
		domNode._calcHeight = false;
	});

	function getLowestPosition(obj) {
		var i,
			pos,
			maxPos = oSizes.height + (parseInt(obj.top) || 0) + (parseInt(obj.bottom) || 0),
			children = obj._children,
			len = children.length,
			oSizes = Ti._5._getElementOffset(domNode);
		//var maxPos = oSizes.height + oSizes.top;
		for (i = 0; i < len; i++) {
			pos = getLowestPosition(children[i]);
			maxPos = Math.max(maxPos, pos);
		}
		return maxPos;
	}

	function setRowHeight() {
		var i,
			pos,
			maxPos = 0,
			children = obj._children,
			len = children.length;
		if ((obj.height === undef || obj.height === "auto") && domNode._calcHeight === false && len) {
			for (i = 0; i < len; i++) {
				pos = getLowestPosition(children[i]);
				maxPos = Math.max(maxPos, pos);
			}
			domNode._calcHeight = maxPos;
			domStyle.height = domNode._calcHeight + "px";
		}
	}

	obj.addEventListener("html5_child_rendered", setRowHeight);
	obj.addEventListener("html5_shown", function () {domNode._calcHeight = false; setRowHeight();});
	on(window, "resize", function() {
		domNode._calcHeight = false;
		setRowHeight();
	});

	function setColoredStyle() {
		if (obj.selectedBackgroundImage) {
			domStyle.backgroundImage = "url(" + Ti._5.getAbsolutePath(obj.selectedBackgroundImage) + ")";
			domStyle.backgroundRepeat = "no-repeat";
		} else if (obj.selectedBackgroundColor) {
			domStyle.backgroundColor = obj.selectedBackgroundColor;
		} else if (obj.selectedColor){
			domStyle.color = obj.selectedColor;
		}
	}

	function setStatusQuo() {
		if(obj.backgroundImage != null){
			domStyle.backgroundImage = "url(" + Ti._5.getAbsolutePath(obj.backgroundImage) + ")";
		}
		if(obj.backgroundColor != null){
			domStyle.backgroundColor = obj.backgroundColor;
		}
		if(obj.color != null){
			domStyle.color = obj.color;
		}
		domNode.selected = false;
	}

	obj._selectRow = function() {
		domNode.selected = true;
		setColoredStyle();
	};

	obj._deselectRow = function() {
		setStatusQuo();
	};

	on(domNode, "touchstart", function() { setColoredStyle(); });
	on(document, "touchend", function() { setStatusQuo(); });
	on(domNode, "mousedown", function() { setColoredStyle(); });
	on(document, "mouseup", function() { setStatusQuo(); });
	on(domNode, "mouseout", function() {
		// If row was selected don`t need to deselect it
		domNode.selected || setStatusQuo();
	});

	on(domNode, "click", function(event) {
		var oEl = event.target, row = null;
		while ("LI" != oEl.tagName.toUpperCase() && oEl.parentNode) {
			oEl = oEl.parentNode;
		}
		var parent = obj.parent, index = -1;
		for (var iCounter = 0; iCounter < parent._children.length; iCounter++) {
			if (parent._children[iCounter] instanceof Ti.UI.TableViewRow) {
				index++;
				if (parent._children[iCounter].dom == oEl) {
					break;
				}
			}
		}

		var oSource = obj 
		var children = obj._children;
		if (children){
			for (var iCounter = 0; iCounter < children.length; iCounter++) {
				if (children[iCounter].dom == event.target){
					oSource = children[iCounter];
					break;
				}
			}
		} 		
		var oEvent = {
			detail		: event.srcElement == _stateObj || false,
			globalPoint	: { x:event.pageX, y:event.pageY }, 
			index		: index,
			row			: obj,
			rowData		: obj._rowData,
			searchMode	: false,
			section		: obj.parent && obj.parent.parent && obj.parent.parent instanceof Ti.UI.TableViewSection ? obj.parent.parent : null,
			source		: oSource,
			type		: event.type,
			x			: event.pageX,
			y			: event.pageY
		};
		obj.fireEvent("click", oEvent);
		// Fire section event
		obj.parent && obj.parent.fireEvent("click", oEvent);
	});

	on(domNode, "dblclick", function(event) {
		var oEvent = {
			globalPoint	: { x:event.pageX, y:event.pageY }, 
			source		: obj,
			type		: event.type,
			x			: event.pageX,
			y			: event.pageY
		};
		obj.fireEvent("dblclick", oEvent);
		// Fire section event
		obj.parent && obj.parent.fireEvent("dblclick", oEvent);
	});
});
;
Ti._5.createClass("Ti.UI.TableViewSection", function(args){
	args = require.mix({
		backgroundColor: "transparent",
		layout: "vertical",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		_headerTitle = "",
		_footerTitle = "";

	// Interfaces
	Ti._5.DOMView(obj, "div", args, "TableViewSection");
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
		
	// Create default header & footer
	var _oHeader = Ti.UI.createLabel({
		isvisible: true,
		textAlign: "left",
		backgroundColor: "#424542",
		color: "#FFFFFF"
	});
	_oHeader.dom.style.paddingLeft = "10px";
	_oHeader.addEventListener("click", function(event) {
		obj.fireEvent("click", {
			globalPoint: event.globalPoint,
			x: event.x,
			y: event.y
		});
	});
	obj.add(_oHeader);
	
	var _oRowsArea = {};
	obj._oRowsArea = _oRowsArea;
	Ti._5.DOMView(_oRowsArea, "ul", args, "TableViewSectionTable");
	Ti._5.Touchable(_oRowsArea, args);
	Ti._5.Styleable(_oRowsArea, args);
	_oRowsArea.dom.style.listStyleType = "none";
	_oRowsArea.dom.style.paddingLeft = "0";
	_oRowsArea.dom.style.position = "";
	_oRowsArea.dom.style.marginTop = "0";
	_oRowsArea.dom.style.marginBottom = "0";
	_oRowsArea.dom.style.minHeight = "1px";
	_oRowsArea.dom._system = true;
	_oRowsArea.addEventListener("html5_added", function(parent) {
		if (_oRowsArea._children) {
			for (var iCounter = 0; iCounter < _oRowsArea._children.length; iCounter++) {
				if (obj.parent && _oRowsArea._children[iCounter] instanceof Ti.UI.TableViewRow) {
					_oRowsArea._children[iCounter] = obj.parent._addRowAdditionalData(_oRowsArea._children[iCounter]);
					// Restore parent reference, broke by _addRowAdditionalData function
					_oRowsArea._children[iCounter].parent = _oRowsArea;
				} 
				_oRowsArea._children[iCounter].render(obj);
			}
		}
	});
	_oRowsArea.addEventListener("click", function(oEvent) {
		// If tableviewsection has children they will fire obj event 
		if (!obj._children || 0 == obj._children.length) {
			oEvent = {
				detail		: false,
				globalPoint	: { x:oEvent.pageX, y:oEvent.pageY }, 
				index		: null,
				row			: null,
				rowData		: null,
				searchMode	: false,
				section		: obj,
				source		: obj,
				type		: oEvent.type,
				x			: oEvent.pageX,
				y			: oEvent.pageY
			};
		}
		obj.fireEvent("click", oEvent);
		// Fire table view event
		obj.parent && obj.parent.fireEvent("click", oEvent);
	});
	_oRowsArea.addEventListener("dblclick", function(event) {
		var oEvent = {
			globalPoint	: { x:event.pageX, y:event.pageY }, 
			x			: event.pageX,
			y			: event.pageY
		};
		obj.fireEvent("dblclick", oEvent);
		// Fire table view event
		obj.parent && obj.parent.fireEvent("dblclick", oEvent);
	});
	obj.add(_oRowsArea);
	
	var _oFooter = Ti.UI.createLabel({
		isvisible:true,
		textAlign:"left",
		backgroundColor:"#424542",
		color:"#FFFFFF"
	});
	_oFooter.dom.style.paddingLeft = "10px";
	_oFooter.addEventListener("click", function(event) {
		obj.fireEvent("click", {
			globalPoint: event.globalPoint,
			x: event.x,
			y: event.y
		});
	});
	obj.add(_oFooter);
	
	// Properties
	Ti._5.prop(obj, {
		footerTitle: {
			get: function(){return _footerTitle;},
			set: function(val){
				_footerTitle = val;
				if ("undefined" != typeof _oFooter.html) {
					_oFooter.html = _footerTitle;
				}
				if ("undefined" != typeof _oFooter.text) {
					_oFooter.text = _footerTitle;
				}
				if ("undefined" != typeof _oFooter.title) {
					_oFooter.title = _footerTitle;
				}
				if ("undefined" != typeof _oFooter.message) {
					_oFooter.message = _footerTitle;
				}
			}
		},
		footerView: {
			get: function(){return _oFooter;},
			set: function(val){
				if (val && val.dom) {
					obj._children.splice(2, 1, val);
					_oFooter = val;
					obj.dom.innerHTML = "";
					obj.render(null);
				}
			}
		},
		headerTitle: {
			get: function(){return _headerTitle;},
			set: function(val){
				_headerTitle = val;
				if (_headerTitle) {
					_oHeader.borderColor = "#000000";
				} else {
					_oHeader.borderColor = "";
				}
				_oHeader.dom.style.borderLeftWidth = 0;
				_oHeader.dom.style.borderRightWidth = 0;
				_oHeader.dom.style.borderBottomWidth = 0;
				if ("undefined" != typeof _oHeader.html) {
					_oHeader.html = _headerTitle;
				}
				if ("undefined" != typeof _oHeader.text) {
					_oHeader.text = _headerTitle;
				}
				if ("undefined" != typeof _oHeader.title) {
					_oHeader.title = _headerTitle;
				}
				if ("undefined" != typeof _oHeader.message) {
					_oHeader.message = _headerTitle;
				}
			}
		},
		headerView: {
			get: function(){return _oHeader;},
			set: function(val){
				if (val && val.dom) {
					obj._children.splice(0, 1, val);
					_oHeader = val;
					obj.dom.innerHTML = "";
					obj.render(null);
				}
			}
		}
	});

	Ti._5.propReadOnly(obj, "rowCount", function() {
		var _rowCount = 0;
		for (var iCounter = 0; iCounter < _oRowsArea._children.length; iCounter++) {
			if (_oRowsArea._children[iCounter] instanceof Ti.UI.TableViewRow) {
				_rowCount++;
			}
		}
		return _rowCount;
	});

	require.mix(obj, args);

	var bBlockRender = false,
		_data = null;
	obj.add = function(view) {
		if (view instanceof Ti.UI.TableViewRow) {
			_oRowsArea.add(view);
		} else {
			obj._children = obj._children || [];
			// creating cross-link
			obj._children.push(view);
			view.parent = obj;
		}
		if (!obj.parent || !obj.parent.bBlockRender) {
			obj.render(null);
		}
	};
});;
Ti._5.createClass("Ti.UI.TableView", function(args){
	args = require.mix({
		height: "100%",
		layout: "vertical",
		unselectable: true,
		width: "100%"
	}, args);

	var undef,
		obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "TableView"),
		on = require.on,
		_data = [],
		activeSection = null;

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	function _createActiveSection(header, footer) {
		activeSection = Ti.UI.createTableViewSection({
			headerTitle: header || "",
			footerTitle: footer || "",
		});
		activeSection.parent = obj;
		obj._children.splice(obj._children.length - 1, 0, activeSection);
	}

	function _clearTopSection() {
		if (!activeSection) {
			return;
		}
		for (var ii = 0; ii < activeSection._children.length; ii++) {
			if (activeSection._children[ii] instanceof Ti.UI.TableViewSection) {
				activeSection._children.splice(ii, 1);
			}
		}
		activeSection = null;
	}

	// Create default header & footer
	obj._children = obj._children || [];
	var _oHeader = Ti.UI.createLabel({
		isvisible:true,
		textAlign:"left",
		backgroundColor:"#424542",
		color:"#FFFFFF"
	});
	_oHeader.dom.style.paddingLeft = "10px";
	_oHeader.addEventListener("click", function(event) {
		obj.fireEvent("click", {
			globalPoint: event.globalPoint,
			x: event.x,
			y: event.y
		});
	});
	obj._children.push(_oHeader);
	_oHeader.parent = obj;

	var _oFooter = Ti.UI.createLabel({
		isvisible:true,
		textAlign:"left",
		backgroundColor:"#424542",
		color:"#FFFFFF"
	});
	_oFooter.dom.style.paddingLeft = "10px";
	_oFooter.addEventListener("click", function(event) {
		obj.fireEvent("click", {
			globalPoint: event.globalPoint,
			x: event.x,
			y: event.y
		});
	});
	obj._children.push(_oFooter);
	_oFooter.parent = obj;
	
	function _searchForRowByIndex(iIndex) {
		obj._children = obj._children || [];
		
		var iChildIndex = {x:-1,y:-1,oRow:null,oSection:null}, iRowCounter = -1;
		// Search in sections
		for (var iCounter = 0; iCounter < obj._children.length; iCounter++) {
			if (obj._children[iCounter] instanceof Ti.UI.TableViewSection) {
				var oSection = obj._children[iCounter];
				// Search in section children
				if (
					oSection._children[1] &&
					oSection._children[1]._children &&
					oSection._children[1]._children[0] instanceof Ti.UI.TableViewRow
				) {
					var oSectionRows = oSection._children[1];
					// Search in section rows
					for (var jCounter = 0; jCounter < oSectionRows._children.length; jCounter++) {
						iChildIndex.y++;
						iRowCounter++;
						if (iRowCounter == iIndex) {
							iChildIndex.oRow = oSectionRows._children[jCounter];
							break;
						}
					}
				}
			}
			iChildIndex.x++;
			if (iRowCounter == iIndex) {
				iChildIndex.oSection = oSection;
				break;
			}
			iChildIndex.y = -1;			
		}
		
		return iChildIndex;
	}
	
	var needNewSection = false;
	obj.add = function(view) {
		var aData = view instanceof Array ? view : [view];
		for (var ii = 0; ii < aData.length; ii++) {
			var row = aData[ii];
			// creating cross-link
			if (row instanceof Ti.UI.TableViewRow) {
				if (row.header || needNewSection) {
					_createActiveSection(row.header, row.footer);
				} else if (!activeSection) {
					_createActiveSection();
				}
				if (row.footer) {
					activeSection.footerTitle = row.footer;
					needNewSection = true;
				} else {
					needNewSection = false;
				}
				activeSection.add(row);
			} else {
				activeSection = row;
				needNewSection = false;
				row.parent = obj;
				// Footer must be the last element
				obj._children.splice(obj._children.length - 1, 0, row);
			}
				
			if (
				row instanceof Ti.UI.TableViewRow ||
				row instanceof Ti.UI.TableViewSection
			) {
				_data.push(row._rowData || row.args);
			} else {
				_data.push(row);
			}
		}
		if (!bBlockRender) {
			obj.render(null);
		}
	};
	
	obj._addRowAdditionalData = function (row) {
		if (Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE == obj.separatorStyle) {
			row.dom.style.borderBottom = "1px solid " + obj.separatorColor;
		} else {
			row.dom.style.borderBottom = "none";
		}
		row.dom.style.height = obj.rowHeight ? obj.rowHeight + "px" : row.dom.style.height;
		row.dom.style.minHeight = obj.minRowHeight + "px";
		row.dom.style.maxHeight = obj.maxRowHeight + "px";
		if (activeSection) {
			//_createActiveSection();
			row.parent = activeSection;
		}
		
		return row;
	};

	// Block rendering rows to improve performance  
	var bBlockRender = false,
		_footerTitle = "",
		_headerTitle = "",
		_scrollable = true,
		_searchHidden = true,
		_separatorStyle = Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE;

	// Properties
	Ti._5.prop(obj, {
		allowsSelection: true,
		allowsSelectionDuringEditing: true,
		data: {
			get: function(){return _data;},
			set: function(val){
				// clean all the data we have
				_data = [];
				obj._children = [];
				domNode.innerHTML = "";
				_clearTopSection();
				bBlockRender = true;
				val = val instanceof Array ? val : [val];
				for (var ii = 0; ii < val.length; ii++) {
					var row = val[ii];
					if (!(row instanceof Ti.UI.TableViewRow) && !(row instanceof Ti.UI.TableViewSection)) {
						row = Ti.UI.createTableViewRow(row);
					}
					if (row instanceof Ti.UI.TableViewRow) {
						row = obj._addRowAdditionalData(row);
					}
					obj.add(row);
				}
				bBlockRender = false;
				if (obj._children && obj._children.length) {
					obj.render(null);
				}
			}
		},
		editable: undef,
		editing: undef,
		filterAttribute: undef,
		filterCaseInsensitive: undef,
		footerTitle: {
			get: function(){return _footerTitle;},
			set: function(val){
				_footerTitle = val;
				_oFooter.html !== undef && (_oFooter.html = _footerTitle);
				_oFooter.text !== undef && (_oFooter.text = _footerTitle);
				_oFooter.title !== undef && (_oFooter.title = _footerTitle);
				_oFooter.message !== undef && (_oFooter.message = _footerTitle);
			}
		},
		footerView: {
			get: function(){return _oFooter;},
			set: function(val){
				if (val && val.dom) {
					obj._children.splice(2, 1, val);
					_oFooter = val;
					domNode.innerHTML = "";
					obj.render(null);
				}
			}
		},
		headerTitle: {
			get: function(){return _headerTitle;},
			set: function(val){
				_headerTitle = val;
				_oHeader.borderColor = _headerTitle ? "#000000" : "";
				var style = _oHeader.dom.style;
				style.borderLeftWidth = 0;
				style.borderRightWidth = 0;
				style.borderBottomWidth = 0;
				_oHeader.html !== undef && (_oHeader.html = _headerTitle);
				_oHeader.text !== undef && (_oHeader.text = _headerTitle);
				_oHeader.title !== undef && (_oHeader.title = _headerTitle);
				_oHeader.message !== undef && (_oHeader.message = _headerTitle);
			}
		},
		headerView: {
			get: function(){return _oHeader;},
			set: function(val){
				if (val && val.dom) {
					obj._children.splice(0, 1, val);
					_oHeader = val;
					domNode.innerHTML = "";
					obj.render(null);
				}
			}
		},
		index: undef,
		maxRowHeight: "",
		minRowHeight: 1,
		moving: undef,
		rowHeight: args.rowHeight,
		scrollable: {
			get: function(){return _scrollable;},
			set: function(val){
				_scrollable = val;
				domNode.style.overflow = _scrollable ? "auto" : "hidden";
			}
		},
		search: undef,
		searchHidden: {
			get: function(){return _searchHidden;},
			set: function(val){_searchHidden = !!val;}
		},
		separatorColor: "#e0e0e0",
		separatorStyle: {
			get: function(){return _separatorStyle;},
			set: function(val){
				if (Ti.UI.iPhone.TableViewSeparatorStyle.NONE == val) {
					_separatorStyle = Ti.UI.iPhone.TableViewSeparatorStyle.NONE;
				} else {
					_separatorStyle = Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE;
				}
				if (obj._children && obj._children.length) {
					for (var iCounter = obj._children.length; iCounter >= 0; iCounter--) {
						if (obj._children[iCounter] instanceof Ti.UI.TableViewSection) {
							for (var jCounter = obj._children[iCounter]._children.length; jCounter >= 0; jCounter--) {
								if (obj._children[iCounter]._children[jCounter] instanceof Ti.UI.TableViewRow) {
									obj._addRowAdditionalData(obj._children[iCounter]._children[jCounter]);
								}  
							}
						}
					}
				}
			}
		},
		style: undef,
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		}
	});

	require.mix(obj, args);

	on(domNode, "click", function(event) {
		// If tableview has children they will fire this event
		if (obj._children && 0 < obj._children.length) {
			return true;
		}
		obj.fireEvent("click", {
			detail		: false,
			globalPoint	: { x:event.pageX, y:event.pageY }, 
			index		: null,
			row			: null,
			rowData		: null,
			searchMode	: false,
			section		: null,
			type		: event.type,
			x			: event.pageX,
			y			: event.pageY
		});
	});
	
	on(domNode, "dblclick", function(event) {
		// If tableview has children they will fire this event 
		if (obj._children && 0 < obj._children.length) {
			return true;
		}
		obj.fireEvent("dblclick", {
			globalPoint	: { x:event.pageX, y:event.pageY }, 
			type		: event.type,
			x			: event.pageX,
			y			: event.pageY
		});
	});

	// Methods
	obj.appendRow = function(row, properties){
		if (row instanceof Ti.UI.TableViewRow) {
			obj.add(obj._addRowAdditionalData(row));
		} else {
			obj.add(obj._addRowAdditionalData(Ti.UI.createTableViewRow(row)));
		}
	};
	obj.deleteRow = function(row, properties){
		var oIndex = _searchForRowByIndex(row);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		if (0 == oIndex.x && _data && !(_data[0] instanceof Ti.UI.TableViewSection)) {
			_data.splice(oIndex.y, 1);
		}
		var oRow = obj._children[oIndex.x]._children[1]._children.splice(oIndex.y, 1);
		oRow = oRow ? oRow[0] : null;
		obj._children[oIndex.x]._children[1].dom.innerHTML = "";
		obj._children[oIndex.x]._children[1].render(null);
		obj.fireEvent("delete", {
			detail		: false,
			index		: row,
			row			: oRow,
			rowData		: oRow._rowData || oRow.args,
			searchMode	: false,
			section		: oRow.parent,
			source		: obj,
			type		: "delete"
		});
	};
	obj.insertRowAfter = function(index, row, properties){
		var oIndex = _searchForRowByIndex(index);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		var oData = null;
		if (0 == oIndex.x && _data && !(_data[0] instanceof Ti.UI.TableViewSection)) {
			_data.splice(oIndex.y + 1, 0, row._rowData || row.args);
		}
		row = obj._addRowAdditionalData(row);
		obj._children[oIndex.x]._children[1]._children.splice(oIndex.y + 1, 0, row);
		obj.render(null);
	};
	obj.insertRowBefore = function(index, row, properties){
		var oIndex = _searchForRowByIndex(index);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		var oData = null;
		if (0 == oIndex.x && _data && !(_data[0] instanceof Ti.UI.TableViewSection)) {
			_data.splice(oIndex.y, 0, row._rowData || row.args);
		}
		row = obj._addRowAdditionalData(row);
		obj._children[oIndex.x]._children[1]._children.splice(oIndex.y, 0, row);
		obj.render(null);
	};
	obj.updateRow = function(index, row, properties){
		var oIndex = _searchForRowByIndex(index);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		if (0 == oIndex.x && _data && !(_data[0] instanceof Ti.UI.TableViewSection)) {
			_data = _data.splice(oIndex.y, 1, row._rowData || row.args);
		}
		row = obj._addRowAdditionalData(row);
		obj._children[oIndex.x]._children[1]._children.splice(oIndex.y, 1, row);
		obj._children[oIndex.x]._children[1].dom.innerHTML = "";
		obj._children[oIndex.x]._children[1].render(null);
	};
	obj.scrollToIndex = function(index, properties) {
		var oIndex = _searchForRowByIndex(index);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		domNode.scrollTop = parseInt(Ti._5._getElementOffset(oIndex.oRow.dom).top);
	};
	obj.scrollToTop = function(yCoord, properties) {
		domNode.scrollTop = parseFloat(yCoord);
	};
	obj.selectRow = function(row){
		if (!obj.allowsSelection) {
			return false;
		}
		for (var iCounter=0; iCounter < obj._children.length; iCounter++) {
			if (obj._children[iCounter] instanceof Ti.UI.TableViewSection) {
				var oSection = obj._children[iCounter];
				// Search in section children
				if (
					oSection._children[1] &&
					oSection._children[1]._children &&
					oSection._children[1]._children[0] instanceof Ti.UI.TableViewRow
				) {
					var oSectionRows = oSection._children[1];
					// Search in section rows
					for (var jCounter = 0; jCounter < oSectionRows._children.length; jCounter++) {
						oSectionRows._children[jCounter]._deselectRow();
					}
				}
			}
		}
		var oIndex = _searchForRowByIndex(row);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		obj._children[oIndex.x]._children[1]._children[oIndex.y]._selectRow();
	};
	obj.deselectRow = function(row){
		if (!obj.allowsSelection) {
			return false;
		}
		var oIndex = _searchForRowByIndex(row);
		// if row was found
		if (0 > oIndex.y) {
			return;
		}
		obj._children[oIndex.x]._children[1]._children[oIndex.y]._deselectRow();
	};
	obj.setData = function(data, properties) {
//		if (data == null || data.length == 0) {
//			_data = [];
//			obj._children = [];
//			domNode.innerHTML = "";
//		} else {
			obj.data = data;
//		}
	};

	// Events
	obj.addEventListener("delete", function(){
		console.debug('Event "delete" is not implemented yet.');
	});
	obj.addEventListener("move", function(){
		console.debug('Event "move" is not implemented yet.');
	});
	
	var _scrollTimer = null;
	on(domNode, "scroll", function(event) {
		clearTimeout(_scrollTimer);
		var iFirstIndex = 0, bFirstIndexFound = false, iTotal = 0, iVisibleCount = 0;
		var iHeight = domNode.offsetHeight;
		var iTop = Ti._5._getElementOffset(domNode).top;
		for (var iCounter=0; iCounter < obj._children.length; iCounter++) {
			if (obj._children[iCounter] instanceof Ti.UI.TableViewSection) {
				var oSection = obj._children[iCounter];
				// Search in section children
				if (
					oSection._children[1] &&
					oSection._children[1]._children &&
					oSection._children[1]._children[0] instanceof Ti.UI.TableViewRow
				) {
					var oSectionRows = oSection._children[1];
					// Search in section rows
					for (var jCounter = 0; jCounter < oSectionRows._children.length; jCounter++) {
						var oSizes = Ti._5._getElementOffset(oSectionRows._children[jCounter].dom);
						if (!bFirstIndexFound && (oSizes.top + 0.5*oSizes.height) < iTop + domNode.scrollTop) {
							iFirstIndex++;
						} else {
							bFirstIndexFound = true;
						}
						if (
							
							((oSizes.top + oSizes.height - domNode.scrollTop) >= iTop && 
							(oSizes.top + oSizes.height - domNode.scrollTop) <= iTop + iHeight &&
							(oSizes.top + 0.5*oSizes.height - domNode.scrollTop) >= iTop &&
							(oSizes.top + 0.5*oSizes.height - domNode.scrollTop) <= iTop + iHeight )
							||
							((oSizes.top - domNode.scrollTop) >= iTop && 
							(oSizes.top - domNode.scrollTop) <= iTop + iHeight &&
							(oSizes.top + 0.5*oSizes.height - domNode.scrollTop) >= iTop &&
							(oSizes.top + 0.5*oSizes.height - domNode.scrollTop) <= iTop + iHeight)
						) {
							iVisibleCount++;
						}
						iTotal++;
					}
				}
			}
		}
		var oEvent =  {
			contentOffset		: {x: domNode.scrollLeft, y:domNode.scrollTop},
			contentSize			: {width: domNode.scrollWidth, height: domNode.scrollHeight},
			firstVisibleItem	: iFirstIndex,
			size				: {width: domNode.offsetWidth, height: domNode.offsetHeight},
			totalItemCount		: iTotal,
			visibleItemCount	: iVisibleCount
		};
		_scrollTimer = setTimeout(function() {
			obj.fireEvent("scrollEnd", {
				contentOffset		: oEvent.contentOffset,
				contentSize			: oEvent.contentSize,
				size				: oEvent.size,
				type				: "scrollEnd"
			});
		}, 300);	
		obj.fireEvent("scroll", oEvent);
	});
});
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);	
	
	// Properties	
	Ti._5.prop(api, 'ACTION_AIRPLANE_MODE_CHANGED');
	Ti._5.prop(api, 'ACTION_ALL_APPS');
	Ti._5.prop(api, 'ACTION_ANSWER');
	Ti._5.prop(api, 'ACTION_ATTACH_DATA');
	Ti._5.prop(api, 'ACTION_BATTERY_CHANGED');
	Ti._5.prop(api, 'ACTION_BATTERY_LOW');
	Ti._5.prop(api, 'ACTION_BATTERY_OKAY');
	Ti._5.prop(api, 'ACTION_BOOT_COMPLETED');
	Ti._5.prop(api, 'ACTION_BUG_REPORT');
	Ti._5.prop(api, 'ACTION_CALL');
	Ti._5.prop(api, 'ACTION_CALL_BUTTON');
	Ti._5.prop(api, 'ACTION_CAMERA_BUTTON');
	Ti._5.prop(api, 'ACTION_CHOOSER');
	Ti._5.prop(api, 'ACTION_CLOSE_SYSTEM_DIALOGS');
	Ti._5.prop(api, 'ACTION_CONFIGURATION_CHANGED');
	Ti._5.prop(api, 'ACTION_CREATE_SHORTCUT');
	Ti._5.prop(api, 'ACTION_DATE_CHANGED');
	Ti._5.prop(api, 'ACTION_DEFAULT');
	Ti._5.prop(api, 'ACTION_DELETE');
	Ti._5.prop(api, 'ACTION_DEVICE_STORAGE_LOW');
	Ti._5.prop(api, 'ACTION_DIAL');
	Ti._5.prop(api, 'ACTION_EDIT');
	Ti._5.prop(api, 'ACTION_GET_CONTENT');
	Ti._5.prop(api, 'ACTION_GTALK_SERVICE_CONNECTED');
	Ti._5.prop(api, 'ACTION_GTALK_SERVICE_DISCONNECTED');
	Ti._5.prop(api, 'ACTION_HEADSET_PLUG');
	Ti._5.prop(api, 'ACTION_INPUT_METHOD_CHANGED');
	Ti._5.prop(api, 'ACTION_INSERT');
	Ti._5.prop(api, 'ACTION_INSERT_OR_EDIT');
	Ti._5.prop(api, 'ACTION_MAIN');
	Ti._5.prop(api, 'ACTION_MANAGE_PACKAGE_STORAGE');
	Ti._5.prop(api, 'ACTION_MEDIA_BAD_REMOVAL');
	Ti._5.prop(api, 'ACTION_MEDIA_BUTTON');
	Ti._5.prop(api, 'ACTION_MEDIA_CHECKING');
	Ti._5.prop(api, 'ACTION_MEDIA_EJECT');
	Ti._5.prop(api, 'ACTION_MEDIA_MOUNTED');
	Ti._5.prop(api, 'ACTION_MEDIA_NOFS');
	Ti._5.prop(api, 'ACTION_MEDIA_REMOVED');
	Ti._5.prop(api, 'ACTION_MEDIA_SCANNER_FINISHED');
	Ti._5.prop(api, 'ACTION_MEDIA_SCANNER_SCAN_FILE');
	Ti._5.prop(api, 'ACTION_MEDIA_SCANNER_STARTED');
	Ti._5.prop(api, 'ACTION_MEDIA_SHARED');
	Ti._5.prop(api, 'ACTION_MEDIA_UNMOUNTABLE');
	Ti._5.prop(api, 'ACTION_MEDIA_UNMOUNTED');
	Ti._5.prop(api, 'ACTION_NEW_OUTGOING_CALL');
	Ti._5.prop(api, 'ACTION_PACKAGE_ADDED');
	Ti._5.prop(api, 'ACTION_PACKAGE_CHANGED');
	Ti._5.prop(api, 'ACTION_PACKAGE_DATA_CLEARED');
	Ti._5.prop(api, 'ACTION_PACKAGE_INSTALL');
	Ti._5.prop(api, 'ACTION_PACKAGE_REMOVED');
	Ti._5.prop(api, 'ACTION_PACKAGE_REPLACED');
	Ti._5.prop(api, 'ACTION_PACKAGE_RESTARTED');
	Ti._5.prop(api, 'ACTION_PICK');
	Ti._5.prop(api, 'ACTION_PICK_ACTIVITY');
	Ti._5.prop(api, 'ACTION_POWER_CONNECTED');
	Ti._5.prop(api, 'ACTION_POWER_DISCONNECTED');
	Ti._5.prop(api, 'ACTION_POWER_USAGE_SUMMARY');
	Ti._5.prop(api, 'ACTION_PROVIDER_CHANGED');
	Ti._5.prop(api, 'ACTION_REBOOT');
	Ti._5.prop(api, 'ACTION_RUN');
	Ti._5.prop(api, 'ACTION_SCREEN_OFF');
	Ti._5.prop(api, 'ACTION_SCREEN_ON');
	Ti._5.prop(api, 'ACTION_SEARCH');
	Ti._5.prop(api, 'ACTION_SEARCH_LONG_PRESS');
	Ti._5.prop(api, 'ACTION_SEND');
	Ti._5.prop(api, 'ACTION_SENDTO');
	Ti._5.prop(api, 'ACTION_SEND_MULTIPLE');
	Ti._5.prop(api, 'ACTION_SET_WALLPAPER');
	Ti._5.prop(api, 'ACTION_SHUTDOWN');
	Ti._5.prop(api, 'ACTION_SYNC');
	Ti._5.prop(api, 'ACTION_SYSTEM_TUTORIAL');
	Ti._5.prop(api, 'ACTION_TIME_CHANGED');
	Ti._5.prop(api, 'ACTION_TIME_TICK');
	Ti._5.prop(api, 'ACTION_UID_REMOVED');
	Ti._5.prop(api, 'ACTION_UMS_CONNECTED');
	Ti._5.prop(api, 'ACTION_UMS_DISCONNECTED');
	Ti._5.prop(api, 'ACTION_USER_PRESENT');
	Ti._5.prop(api, 'ACTION_VIEW');
	Ti._5.prop(api, 'ACTION_VOICE_COMMAND');
	Ti._5.prop(api, 'ACTION_WALLPAPER_CHANGED');
	Ti._5.prop(api, 'ACTION_WEB_SEARCH');
	Ti._5.prop(api, 'CATEGORY_ALTERNATIVE');
	Ti._5.prop(api, 'CATEGORY_BROWSABLE');
	Ti._5.prop(api, 'CATEGORY_DEFAULT');
	Ti._5.prop(api, 'CATEGORY_DEVELOPMENT_PREFERENCE');
	Ti._5.prop(api, 'CATEGORY_EMBED');
	Ti._5.prop(api, 'CATEGORY_FRAMEWORK_INSTRUMENTATION_TEST');
	Ti._5.prop(api, 'CATEGORY_HOME');
	Ti._5.prop(api, 'CATEGORY_INFO');
	Ti._5.prop(api, 'CATEGORY_LAUNCHER');
	Ti._5.prop(api, 'CATEGORY_MONKEY');
	Ti._5.prop(api, 'CATEGORY_OPENABLE');
	Ti._5.prop(api, 'CATEGORY_PREFERENCE');
	Ti._5.prop(api, 'CATEGORY_SAMPLE_CODE');
	Ti._5.prop(api, 'CATEGORY_SELECTED_ALTERNATIVE');
	Ti._5.prop(api, 'CATEGORY_TAB');
	Ti._5.prop(api, 'CATEGORY_TEST');
	Ti._5.prop(api, 'CATEGORY_UNIT_TEST');
	Ti._5.prop(api, 'DEFAULT_ALL');
	Ti._5.prop(api, 'DEFAULT_LIGHTS');
	Ti._5.prop(api, 'DEFAULT_SOUND');
	Ti._5.prop(api, 'DEFAULT_VIBRATE');
	Ti._5.prop(api, 'EXTRA_ALARM_COUNT');
	Ti._5.prop(api, 'EXTRA_BCC');
	Ti._5.prop(api, 'EXTRA_CC');
	Ti._5.prop(api, 'EXTRA_DATA_REMOVED');
	Ti._5.prop(api, 'EXTRA_DONT_KILL_APP');
	Ti._5.prop(api, 'EXTRA_EMAIL');
	Ti._5.prop(api, 'EXTRA_INTENT');
	Ti._5.prop(api, 'EXTRA_KEY_EVENT');
	Ti._5.prop(api, 'EXTRA_PHONE_NUMBER');
	Ti._5.prop(api, 'EXTRA_REPLACING');
	Ti._5.prop(api, 'EXTRA_SHORTCUT_ICON');
	Ti._5.prop(api, 'EXTRA_SHORTCUT_ICON_RESOURCE');
	Ti._5.prop(api, 'EXTRA_SHORTCUT_INTENT');
	Ti._5.prop(api, 'EXTRA_SHORTCUT_NAME');
	Ti._5.prop(api, 'EXTRA_STREAM');
	Ti._5.prop(api, 'EXTRA_SUBJECT');
	Ti._5.prop(api, 'EXTRA_TEMPLATE');
	Ti._5.prop(api, 'EXTRA_TEXT');
	Ti._5.prop(api, 'EXTRA_TITLE');
	Ti._5.prop(api, 'EXTRA_UID');
	Ti._5.prop(api, 'FILL_IN_ACTION');
	Ti._5.prop(api, 'FILL_IN_CATEGORIES');
	Ti._5.prop(api, 'FILL_IN_COMPONENT');
	Ti._5.prop(api, 'FILL_IN_DATA');
	Ti._5.prop(api, 'FILL_IN_PACKAGE');
	Ti._5.prop(api, 'FLAG_ACTIVITY_BROUGHT_TO_FRONT');
	Ti._5.prop(api, 'FLAG_ACTIVITY_CLEAR_TOP');
	Ti._5.prop(api, 'FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET');
	Ti._5.prop(api, 'FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS');
	Ti._5.prop(api, 'FLAG_ACTIVITY_FORWARD_RESULT');
	Ti._5.prop(api, 'FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY');
	Ti._5.prop(api, 'FLAG_ACTIVITY_MULTIPLE_TASK');
	Ti._5.prop(api, 'FLAG_ACTIVITY_NEW_TASK');
	Ti._5.prop(api, 'FLAG_ACTIVITY_NO_HISTORY');
	Ti._5.prop(api, 'FLAG_ACTIVITY_NO_USER_ACTION');
	Ti._5.prop(api, 'FLAG_ACTIVITY_PREVIOUS_IS_TOP');
	Ti._5.prop(api, 'FLAG_ACTIVITY_REORDER_TO_FRONT');
	Ti._5.prop(api, 'FLAG_ACTIVITY_RESET_TASK_IF_NEEDED');
	Ti._5.prop(api, 'FLAG_ACTIVITY_SINGLE_TOP');
	Ti._5.prop(api, 'FLAG_AUTO_CANCEL');
	Ti._5.prop(api, 'FLAG_CANCEL_CURRENT');
	Ti._5.prop(api, 'FLAG_DEBUG_LOG_RESOLUTION');
	Ti._5.prop(api, 'FLAG_FROM_BACKGROUND');
	Ti._5.prop(api, 'FLAG_GRANT_READ_URI_PERMISSION');
	Ti._5.prop(api, 'FLAG_GRANT_WRITE_URI_PERMISSION');
	Ti._5.prop(api, 'FLAG_INSISTENT');
	Ti._5.prop(api, 'FLAG_NO_CLEAR');
	Ti._5.prop(api, 'FLAG_NO_CREATE');
	Ti._5.prop(api, 'FLAG_ONE_SHOT');
	Ti._5.prop(api, 'FLAG_ONGOING_EVENT');
	Ti._5.prop(api, 'FLAG_ONLY_ALERT_ONCE');
	Ti._5.prop(api, 'FLAG_RECEIVER_REGISTERED_ONLY');
	Ti._5.prop(api, 'FLAG_SHOW_LIGHTS');
	Ti._5.prop(api, 'FLAG_UPDATE_CURRENT');
	Ti._5.prop(api, 'PENDING_INTENT_FOR_ACTIVITY');
	Ti._5.prop(api, 'PENDING_INTENT_FOR_BROADCAST');
	Ti._5.prop(api, 'PENDING_INTENT_FOR_SERVICE');
	Ti._5.prop(api, 'PENDING_INTENT_MAX_VALUE');
	Ti._5.prop(api, 'RESULT_CANCELED');
	Ti._5.prop(api, 'RESULT_FIRST_USER');
	Ti._5.prop(api, 'RESULT_OK');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_BEHIND');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_LANDSCAPE');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_NOSENSOR');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_PORTRAIT');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_SENSOR');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_UNSPECIFIED');
	Ti._5.prop(api, 'SCREEN_ORIENTATION_USER');
	Ti._5.prop(api, 'STREAM_DEFAULT');
	Ti._5.prop(api, 'URI_INTENT_SCHEME');	
	
	// Methods
	api.createBroadcastIntent = function(){
		console.debug('Method "Titanium.Android.createBroadcastIntent" is not implemented yet.');
	};
	api.createIntent = function(){
		console.debug('Method "Titanium.Android.createIntent" is not implemented yet.');
	};
	api.createIntentChooser = function(){
		console.debug('Method "Titanium.Android.createIntentChooser" is not implemented yet.');
	};
	api.createNotification = function(){
		console.debug('Method "Titanium.Android.createNotification" is not implemented yet.');
	};
	api.createPendingIntent = function(){
		console.debug('Method "Titanium.Android.createPendingIntent" is not implemented yet.');
	};
	api.createService = function(){
		console.debug('Method "Titanium.Android.createService" is not implemented yet.');
	};
	api.createServiceIntent = function(){
		console.debug('Method "Titanium.Android.createServiceIntent" is not implemented yet.');
	};
	api.isServiceRunning = function(){
		console.debug('Method "Titanium.Android.isServiceRunning" is not implemented yet.');
	};
	api.startService = function(){
		console.debug('Method "Titanium.Android.startService" is not implemented yet.');
	};
	api.stopService = function(){
		console.debug('Method "Titanium.Android.stopService" is not implemented yet.');
	};
})(Ti._5.createClass('Titanium.Android'));;
Ti._5.createClass("Ti.UI.ScrollView", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "ScrollView"),
		domStyle = domNode.style,
		px = Ti._5.px,
		_innerContainer = document.createElement("div"),
		_contentHeight,
		_contentOffset = null,
		_contentWidth,
		_showHorizontalScrollIndicator = null,
		_showVerticalScrollIndicator = null,
		_size;

	// outer container
	Ti._5.Clickable(obj);
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	domStyle.position = "absolute";
	domStyle.overflow = "auto";

	// we need to do some DOM manipulations here - ScrollView needs to have 2 containers - outer for setting contentWidth && contentHeight,
	// and inner one - to apply everything else
	// inner container
	_innerContainer.style.overflow = "hidden";
	_innerContainer.style.position = "absolute";
	domNode.appendChild(_innerContainer);
	obj._getAddContainer = function(){
		return _innerContainer;
	};

	// Properties
	Ti._5.prop(obj, {
		canCancelEvents: true,
		contentHeight: {
			get: function(){return _contentHeight;},
			set: function(val){
				_contentHeight = val;
				obj._getAddContainer().style.height = px(val);
			}
		},
		contentOffset: {
			get: function(){return _contentOffset;},
			set: function(val){
				_contentOffset = val;
				x in val && (domStyle.paddingLeft = px(val.x));
				y in val && (domStyle.paddingTop = px(val.y));
			}
		},
		contentWidth: {
			get: function(){return _contentWidth;},
			set: function(val){
				_contentWidth = val;
				obj._getAddContainer().style.width = px(val);
			}
		},
		disableBounce: false,
		horizontalBounce: false,
		maxZoomScale: null,
		minZoomScale: null,
		scrollType: null,
		showHorizontalScrollIndicator: {
			get: function(){return _showHorizontalScrollIndicator;},
			set: function(val){
				_showHorizontalScrollIndicator = val;
				domStyle.overflowX = _showHorizontalScrollIndicator ? "scroll" : "hidden";
			}
		},
		showVerticalScrollIndicator: {
			get: function(){return _showVerticalScrollIndicator;},
			set: function(val){
				_showVerticalScrollIndicator = val;
				domStyle.overflowY = _showVerticalScrollIndicator ? "scroll" : "hidden";
			}
		},
		size: {
			get: function(){return _size;},
			set: function(val){
				if (val != null && val.width != null) {
					_innerContainer.style.width = px(val.width);
				}
				if (val != null && val.height != null) {
					_innerContainer.style.height = px(val.height);
				}
			}
		},
		verticalBounce: null,
		zoomScale: null
	});

	// Methods
	obj.scrollTo = function(x, y){
		if(x != null){
			domNode.scrollLeft = parseInt(x);
		}
		if(y != null){
			domNode.scrollTop = parseInt(y);
		}
	};

	// Events
	require.on(domNode, "scroll", function(evt) {
		obj.fireEvent("scroll", {
			source: evt.target,
			x: evt.pageX,
			y: evt.pageY
		});
	});

	require.mix(obj, args);
});
;
Ti._5.createClass('Titanium.Network.TCPSocket', function(args){

	// deprecated in 1.7.0 in favor for Titanium.Network.Socket.TCP

	var obj = this;
	var _socket = null;
	
	// Properties
	var _hostName = '';
	Ti._5.prop(api, 'hostName', {
		get: function(){return _hostName;},
		set: function(val){_hostName = val;}
	});
	obj.hostName = args && args[0] ? args[0] : '';

	Ti._5.prop(api, 'isValid', {
		get: function() {return _socket && !!_socket.close;}
	});

	var _mode = 0;
	Ti._5.prop(api, 'mode', {
		get: function(){return _mode;},
		set: function(val){_mode = val || Titanium.Network.READ_WRITE_MODE;}
	});
	obj.mode =  args && args[2] ? args[2] : 0;

	var _port = 0;
	Ti._5.prop(api, 'port', {
		get: function(){return _port;},
		set: function(val){_port = val || 81;}
	});
	obj.port =  args && args[1] ? args[1] : 0;

	var _stripTerminator = false;
	Ti._5.prop(api, 'stripTerminator', {
		get: function(){return _stripTerminator;},
		set: function(val){_stripTerminator = val;}
	});

	// Methods
	api.close = function(){
		_socket.close();
	};
	api.connect = function(){
		var full = obj.hostName.split('/');
		var host = full[0], path = [];
		for (var iCounter = 1; iCounter < full.length; iCounter++) {
			path.push(full[iCounter]);
		}
		_socket = new WebSocket("ws://"+host+":"+obj.port+"/"+path.join("/"));
	};
	api.listen = function(){
		_socket.addEventListener("message", function(event) {
			obj.fireEvent('read', {
				data		: event && event.data ? event.data : null, 
				from		: _socket,
				source		: event.target,
				type		: event.type
			});
		}, false);
	};
	api.write = function(val){
		if (_socket && _socket.send) {
			_socket.send(val); 
		} else {
			obj.fireEvent("writeError", {
				code		: 0, 
				error		: 'Sockets does not supported',
				type		: ''
			});
		}
	};

	// Events
	var _errorSet = false;
	api.addEventListener('error', function(event){
		var oEvent = {
			code		: 0, 
			error		: event.description, 
			source		: event.target,
			type		: event.type
		};
		obj.fireEvent('readError', oEvent);
		obj.fireEvent('writeError', oEvent);
	});
});;
Ti._5.createClass('Titanium.UI.iPhone.TableViewStyle', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.tableviewstyle', args, 'iPhone.TableViewStyle');

	// Properties
	Ti._5.prop(this, 'GROUPED');

	Ti._5.prop(this, 'PLAIN');

	require.mix(this, args);
});;
Ti._5.createClass("Ti.UI.ImageView", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "img", args, "ImageView"),
		domStyle = domNode.style,
		isError = false,
		_reverse = false,
		_canScale = true,
		_src = "",
		_images = [],
		_preventDefaultImage = false,
		_height;

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	Ti._5.Clickable(obj, args);

	function loadImages(images) {
		isError = false;
		_preventDefaultImage || (domNode.src = Ti._5.getAbsolutePath(obj.defaultImage));

		var counter = 0,
			img = new Image(),
			h = require.on(img, "load", function () {
				h && h();
				if (++counter < images.length) {
					domNode.src = Ti._5.getAbsolutePath(images[0]);
					obj.fireEvent("load", {
						state: images.length > 1 ? obj.images : obj.image
					});
				}
			});

		require.on(img, "error",  function () {
			isError = true;
			h && h();
			counter++;
		});

		// start preloading
		require.each(images, function(i) {
			img.src = Ti._5.getAbsolutePath(i);
		});
	}

	// Properties
	Ti._5.prop(obj, {
		animating: null,
		canScale: {
			get: function(){return _canScale;},
			set: function(val){
				_canScale = !!val;
				if (!_canScale) {
					domStyle.width = "auto";
					domStyle.height = "auto";
				}
			}
		},
		defaultImage: "",
		duration: null,
		enableZoomControls: true,
		height: {
			get: function() {
				return _height;
			},
			set: function(val) {
				_height = val;
				domStyle.height = Ti._5.px(val);
			}
		},
		// indicates whether or not the source image is in 2x resolution for retina displays. 
		// Use for remote images ONLY. (iOS)
		hires: false,
		image: {
			get: function(){return _src;},
			set: function(val){loadImages([_src = val]);}
		},
		images: {
			get: function(){return _images;},
			set: function(val){
				_images = -1 != val.constructor.toString().indexOf("Array") ? val : [val];
				loadImages(_images);
			}
		},
		paused: null,
		preventDefaultImage: {
			get: function(){return _preventDefaultImage;},
			set: function(val){_preventDefaultImage = !!val;}
		},
		repeatCount: 0,
		reverse: {
			get: function(){return _reverse;},
			set: function(val){_reverse = !!val;}
		},
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		width: {
			get: function() {
				if (!domStyle.width || !obj.canScale) {
					return "";
				}
				return /%/.test(domStyle.width) ? parseInt(domStyle.width)+"%" : parseInt(domStyle.width);
			},
			set: function(val) {
				obj.canScale && (domStyle.width = /%/.test(val+"") ? parseInt(val) + "%" : parseInt(val) + "px");
			}
		}
	});

	require.mix(obj, args);

	// Methods
	obj.pause = function(){
		console.debug('Method "Titanium.UI.ImageView#.pause" is not implemented yet.');
	};
	obj.start = function(){
		console.debug('Method "Titanium.UI.ImageView#.start" is not implemented yet.');
	};
	obj.stop = function(){
		console.debug('Method "Titanium.UI.ImageView#.stop" is not implemented yet.');
	};
	obj.toBlob = function(){
		console.debug('Method "Titanium.UI.ImageView#.toBlob" is not implemented yet.');
	};

	// Events
	obj.addEventListener("change", function(){
		console.debug('Event "change" is not implemented yet.');
	});
	obj.addEventListener("start", function(){
		console.debug('Event "start" is not implemented yet.');
	});
	obj.addEventListener("stop", function(){
		console.debug('Event "stop" is not implemented yet.');
	});
});
;
Ti._5.createClass("Ti.UI.ButtonBar", function(args){

	// Interfaces
	Ti._5.DOMView(this, "buttonbar", args, "ButtonBar");
	Ti._5.Touchable(this, args);
	Ti._5.Styleable(this, args);
	Ti._5.Positionable(this, args);

	// Properties
	Ti._5.prop(this, {
		index: args.index,
		labels: args.labels,
		style: args.style
	});
});
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.propReadOnly(api, {
		UNKNOWN_ERROR: 0,
		DEVICE_BUSY: 1,
		NO_CAMERA: 2,
		NO_VIDEO: 3,

		VIDEO_CONTROL_DEFAULT: 4,
		VIDEO_CONTROL_EMBEDDED: 5,
		VIDEO_CONTROL_FULLSCREEN: 6,
		VIDEO_CONTROL_NONE: 7,
		VIDEO_CONTROL_HIDDEN: 8,

		VIDEO_SCALING_NONE: 9,
		VIDEO_SCALING_ASPECT_FILL: 10,
		VIDEO_SCALING_ASPECT_FIT: 11,
		VIDEO_SCALING_MODE_FILL: 12,

		VIDEO_PLAYBACK_STATE_STOPPED: 13,
		VIDEO_PLAYBACK_STATE_PLAYING: 14,
		VIDEO_PLAYBACK_STATE_PAUSED: 15,

		VIDEO_LOAD_STATE_PLAYABLE: 16,
		VIDEO_LOAD_STATE_PLAYTHROUGH_OK: 17,
		VIDEO_LOAD_STATE_STALLED: 18,
		VIDEO_LOAD_STATE_UNKNOWN: 19,

		VIDEO_REPEAT_MODE_NONE: 20,
		VIDEO_REPEAT_MODE_ONE: 21,

		VIDEO_FINISH_REASON_PLAYBACK_ENDED: 22,
		VIDEO_FINISH_REASON_PLAYBACK_ERROR: 23,
		VIDEO_FINISH_REASON_USER_EXITED: 24
	});

	// Methods
	api.beep = function(){
		console.debug('Method "Titanium.Media.beep" is not implemented yet.');
	};
	api.createAudioPlayer = function(){
		console.debug('Method "Titanium.Media.createAudioPlayer" is not implemented yet.');
	};
	api.createAudioRecorder = function(){
		console.debug('Method "Titanium.Media.createAudioRecorder" is not implemented yet.');
	};
	api.createItem = function(){
		console.debug('Method "Titanium.Media.createItem" is not implemented yet.');
	};
	api.createMusicPlayer = function(){
		console.debug('Method "Titanium.Media.createMusicPlayer" is not implemented yet.');
	};
	api.createSound = function(){
		console.debug('Method "Titanium.Media.createSound" is not implemented yet.');
	};
	api.createVideoPlayer = function(args){
		return new Ti.Media.VideoPlayer(args);
	};
})(Ti._5.createClass("Ti.Media"));;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	var undef;

	// Properties
	Ti._5.propReadOnly(api, {
		ACCURACY_BEST: 0,
		ACCURACY_HUNDRED_METERS: 2,
		ACCURACY_KILOMETER: 3,
		ACCURACY_NEAREST_TEN_METERS: 1,
		ACCURACY_THREE_KILOMETERS: 4,

		AUTHORIZATION_AUTHORIZED: 4,
		AUTHORIZATION_DENIED: 1,
		AUTHORIZATION_RESTRICTED: 2,
		AUTHORIZATION_UNKNOWN: 0,

		ERROR_DENIED: 1,
		ERROR_HEADING_FAILURE: 2,
		ERROR_LOCATION_UNKNOWN: 3,
		ERROR_NETWORK: 0,
		ERROR_REGION_MONITORING_DELAYED: 4,
		ERROR_REGION_MONITORING_DENIED: 5,
		ERROR_REGION_MONITORING_FAILURE: 6,

		PROVIDER_GPS: 1,
		PROVIDER_NETWORK: 2
	});

	Ti._5.prop(api, {
		accuracy: api.ACCURACY_BEST,
		locationServicesAuthorization: undef,
		locationServicesEnabled: undef,
		preferredProvider: undef,
		purpose: undef,
		showCalibration: true
	});

	// Methods
	api.getCurrentPosition = function(callbackFunc) {
		if (_lastPosition && require.is(callbackFunc, "Function")) {
			callbackFunc(_lastPosition);
			return;
		}
		if (_lastError) {
			require.is(callbackFunc, "Function") && callbackFunc(_lastError);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			function(oPos){
				require.is(callbackFunc, "Function") && callbackFunc({
					code: 0,
					coords: {
						latitude : oPos.coords.latitude,
						longitude : oPos.coords.longitude,
						altitude : oPos.coords.altitude,
						heading : oPos.coords.heading,
						accuracy : oPos.coords.accuracy,
						speed : oPos.coords.speed,
						altitudeAccuracy : oPos.coords.altitudeAccuracy,
						timestamp : oPos.timestamp
					},
					error: "",
					success: true
				});
			},
			function(oError){
				require.is(callbackFunc, "Function") && callbackFunc({
					coords: null,
					error: oError.message,
					message: oError.message,
					success: false
				});
			},
			{
				enableHighAccuracy : _accuracy < 3 || api.ACCURACY_BEST === _accuracy
			}
		);
	};

	var _watchId,
		_oldAddEventListener = api.addEventListener, // WARNING: this may cause problems
		_lastPosition = null,
		_lastError = null;

	api.addEventListener = function(eventType, callback){
		_oldAddEventListener(eventType, callback);
		if(eventType == "location"){
			_watchId = navigator.geolocation.watchPosition(
				function(oPos){
					_lastError = null;

					api.fireEvent("location", _lastPosition = {
						code: 0,
						coords : {
							latitude : oPos.coords.latitude,
							longitude : oPos.coords.longitude,
							altitude : oPos.coords.altitude,
							heading : oPos.coords.heading,
							accuracy : oPos.coords.accuracy,
							speed : oPos.coords.speed,
							altitudeAccuracy : oPos.coords.altitudeAccuracy,
							timestamp : oPos.timestamp
						},
						error: "",
						provider: null,
						success: true
					});
					/*
					if (oPos.heading) {
						api.fireEvent("heading", oPos);
					}
					*/
				},
				function(oError){
					_lastPosition = null;

					api.fireEvent("location", _lastError = {
						coords: null,
						error: oError.message,
						message: oError.message,
						provider: null,
						success: false
					});
					/*
					if (oPos.heading) {
						api.fireEvent("heading", oPos);
					}
					*/
				},
				{
					enableHighAccuracy : _accuracy < 3 || api.ACCURACY_BEST === _accuracy
				}
			);
		}
	};
	var _oldRemoveEventlistener = api.removeEventListener; // WARNING: this may cause problems
	api.removeEventListener = function(eventName, cb){
		_oldRemoveEventlistener(eventName, cb);
		if(eventName == "location"){
			navigator.geolocation.clearWatch(_watchId);
		}
	};

	api.forwardGeocoder = function(address, callbackFunc) {};
	api.getCurrentHeading = function(callbackFunc) {};
	api.reverseGeocoder = function(latitude, longitude, callbackFunc) {};
	api.setShowCalibration = function(val) {
		/*
		if ("undefined" == typeof val) {
			val = true;
		}
		*/
		api.showCalibration = !!val;
	};
})(Ti._5.createClass("Ti.Geolocation"));
;
Ti._5.createClass("Ti.UI.WebView", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "iframe", args, "WebView"),
		_executeWhenLoaded = null,
		_loading = false,
		_url = "";

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	Ti._5.Clickable(obj);

	// For width & height on iPhone
	domNode.scrolling = "no";

	require.on(domNode, "load", function(evt) {
		if (!domNode.contentWindow) {
			obj.fireEvent("error", {
				message	: "The page couldn`t be found",
				url		: obj.url
			});
		} else {
			obj.fireEvent("load", {
				url: obj.url
			});
		}
		if (require.is(_executeWhenLoaded, "Function")) {
			_executeWhenLoaded(evt);
			_executeWhenLoaded = null;
		}
	});

	require.on(domNode, "error", function(evt) {
		obj.fireEvent("error", {
			message	: "The page couldn't be found",
			url		: obj.url
		});
		if ("function" == typeof _executeWhenLoaded) {
			_executeWhenLoaded(evt);
			_executeWhenLoaded = null;
		}
	});
	
	// Properties
	Ti._5.prop(obj, {
		data: null,
		html: {
			get: function() {
				try {
					return domNode.contentWindow.document.body.innerHTML;
				} catch (ex) {
					obj.fireEvent("error", {
						message	: ex.description || ex,
						url		: obj.url
					});
					return "";
				} 
			},
			set: function(val) {
				domNode.src = "about:blank";
				_loading = true;
				_executeWhenLoaded = function () {
					// We need some delay, when setting window html from constructor
					setTimeout(function() {
						domNode.contentWindow.document.body.innerHTML = val;
						_loading = false;
					}, 0);
				};
			}
		},
		scalesPageToFit: null,
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		url: {
			get: function(){return _url;},
			set: function(val){
				if (val.substring(0,1) == "/"){
					val = val.substring(1);
				}
				obj.fireEvent("beforeload", {
					url: val
				});
				_loading = true;
				domNode.src = Ti._5.getAbsolutePath(val);
				_executeWhenLoaded = function() {
					_loading = false;
				};
			}
		}
	});

	Ti._5.propReadOnly(obj, "loading", function(){return _loading;});

	require.mix(obj, args);

	// Methods
	obj.canGoBack = function() {
		return domNode.contentWindow && domNode.contentWindow.history && !!obj.url;
	};
	obj.canGoForward = function() {
		return domNode.contentWindow && domNode.contentWindow.history && !!obj.url;
	};
	obj.evalJS = function(sJScript){
		return domNode.contentWindow.eval ? domNode.contentWindow.eval(sJScript) : "";
	};
	obj.goBack = function() {
		obj.canGoBack() && domNode.contentWindow.history.back();
	};
	obj.goForward = function(){
		obj.canGoForward() && domNode.contentWindow.history.forward();
	};
	obj.reload = function(){
		if (obj.url) {
			obj.url = obj.url;
		} else if (obj.html) {
			obj.html = obj.html;
		}
	};
	obj.repaint = function() {
		obj.reload();
	};
	obj.setBasicAuthentication = function(){
		console.debug('Method "Titanium.UI.WebView#.setBasicAuthentication" is not implemented yet.');
	};
	obj.stopLoading = function(){
		// we have no permission to stop loading current iframe, so we can only stop loading all frames in window
		window.stop();
	};
});;
Ti._5.createClass("Ti.Media.VideoPlayer", function(args){
	args = args || {};

	var self = this,
		media = Ti.Media,
		on = require.on,
		handles,
		STOPPED = 0,
		STOPPING = 1,
		PAUSED = 2,
		PLAYING = 3,
		currentState = STOPPED,
		video = document.createElement("video"),
		nativeFullscreen,
		fakeFullscreen = true,
		mimeTypes = {
			"m4v": "video/mp4",
			"mov": "video/quicktime",
			"mp4": "video/mp4",
			"ogg": "video/ogg",
			"ogv": "video/ogg",
			"webm": "video/webm"
		},

		// TODO: Add check for Firefox <http://www.thecssninja.com/javascript/fullscreen>
		_fullscreen = (function(s){ return args.fullscreen || s && s(); }(video.webkitDisplayingFullscreen)),

		_playbackState = media.VIDEO_PLAYBACK_STATE_STOPPED,
		_playing = false,
		_currentPlaybackTime = 0,
		_endPlaybackTime = 0,
		_playableDuration = 0,
		_duration = 0,
		_loadState = media.VIDEO_LOAD_STATE_UNKNOWN,
		_scalingMode = args.scalingMode || media.VIDEO_SCALING_ASPECT_FIT,
		_mediaControlStyle = args.mediaControlStyle || media.VIDEO_CONTROL_DEFAULT,
		_url = args.url;

	// Interfaces
	Ti._5.DOMView(this, "div", args, "VideoPlayer");
	Ti._5.Touchable(this);
	Ti._5.Styleable(this, args);
	Ti._5.EventDriven(this);
	Ti._5.Positionable(this, args);

	// Properties
	Ti._5.propReadOnly(this, {
		playbackState: function(){ return _playbackState; },
		playing: function(){ return _playing; },
		initialPlaybackTime: 0,
		currentPlaybackTime: function(){ return _currentPlaybackTime; },
		endPlaybackTime: function(){ return _endPlaybackTime; },
		playableDuration: function(){ return _playableDuration; },
		loadState: function(){ return _loadState; },
		duration: function(){ return _duration; }
	});

	Ti._5.prop(this, {
		autoplay: !!args.autoplay,
		repeatMode: args.repeatMode === media.VIDEO_REPEAT_MODE_ONE ? media.VIDEO_REPEAT_MODE_ONE : media.VIDEO_REPEAT_MODE_NONE,
		fullscreen: {
			get: function(){ return _fullscreen; },
			set: function(fs){
				var h;
	
				fs = !!fs;
				if (nativeFullscreen) {
					try {
						if (fs) {
							video.webkitEnterFullscreen();
						} else {
							video.webkitExitFullscreen();
						}
					} catch(ex) {}
				} else if (fakeFullscreen) {
					video.className = fs ? "fullscreen" : "";
					fs && (h = on(window, "keydown", function(e){
						if (e.keyCode === 27) {
							this.fullscreen = 0;
							h();
						}
					}));
				}
	
				// need to set this after we've already switched to fullscreen
				_fullscreen = fs;
	
				this.fireEvent("fullscreen", {
					entering: _fullscreen
				});
			}
		},
		scalingMode: {
			get: function() {
				return _scalingMode;
			},
			set: function(val) {
				_scalingMode = val;
				setSize();
			}
		},
		url: {
			get: function() { return _url; },
			set: function(val) {
				_url = val;
				_playing = false;
				currentState = STOPPED;
				createVideo();
			}
		},
		mediaControlStyle: {
			get: function() { return _mediaControlStyle; },
			set: function(val) {
				video.controls = val === media.VIDEO_CONTROL_DEFAULT;
				_mediaControlStyle = val;
			}
		}
	});

	function setDuration(t) {
		_duration = _playableDuration = _endPlaybackTime = t;
	}
	setDuration(0.0);

	function setSize() {
		self.dom.className = self.dom.className.replace(/(scaling\-[\w\-]+)/, "") + ' '
			+ (_scalingMode === media.VIDEO_SCALING_NONE ? "scaling-none" : "scaling-aspect-fit");
	}

	function setPlaybackState(state) {
		self.fireEvent("playbackState", {
			playbackState: _playbackState = state
		});
	}

	function setLoadState(state) {
		self.fireEvent("loadstate", {
			loadState: _loadState = state
		});
	}

	function complete(evt) {
		var ended = evt.type === "ended";
		_playing = false;
		currentState = STOPPED;
		self.fireEvent("complete", {
			reason: ended ? media.VIDEO_FINISH_REASON_PLAYBACK_ENDED : media.VIDEO_FINISH_REASON_USER_EXITED
		});
		ended && self.repeatMode === media.VIDEO_REPEAT_MODE_ONE && setTimeout(function(){ video.play(); }, 1);
	}

	function stalled() {
		setLoadState(media.VIDEO_LOAD_STATE_STALLED);
	}

	function fullscreenChange(e) {
		_fullscreen && (_fullscreen = !_fullscreen);
	}

	function metaDataLoaded() {
		// TODO: Add check for Firefox <http://www.thecssninja.com/javascript/fullscreen>
		nativeFullscreen = this.webkitSupportsFullscreen;
		durationChange();
	}

	function durationChange() {
		var d = this.duration;
		if (d !== Infinity) {
			self.duration || self.fireEvent("durationAvailable", {
				duration: d
			});
			setDuration(d);
		}
	}

	function paused() {
		var pbs = media.VIDEO_PLAYBACK_STATE_STOPPED;
		_playing = false;
		if (currentState === PLAYING) {
			currentState = PAUSED;
			pbs = media.VIDEO_PLAYBACK_STATE_PAUSED;
		} else if (currentState === STOPPING) {
			video.currentTime = 0;
		}
		setPlaybackState(pbs);
	}

	function createVideo(dontCreate) {
		var i, src, match,
			url = self.url;

		if (dontCreate && video && video.parentNode) {
			return video;
		}

		self.release();

		video = document.createElement("video");
		video.tabindex = 0;
		_mediaControlStyle === media.VIDEO_CONTROL_DEFAULT && (video.controls = 1);

		handles = [
			on(video, "playing", function() {
				currentState = PLAYING;
				_playing = true;
				self.fireEvent("playing", {
					url: video.currentSrc
				});
				setPlaybackState(media.VIDEO_PLAYBACK_STATE_PLAYING);
			}),
			on(video, "pause", paused),
			on(video, "canplay", function() {
				setLoadState(media.VIDEO_LOAD_STATE_PLAYABLE);
				currentState === STOPPED && self.autoplay && video.play();
			}),
			on(video, "canplaythrough", function() {
				setLoadState(media.VIDEO_LOAD_STATE_PLAYTHROUGH_OK);
				self.fireEvent("preload");
			}),
			on(video, "loadeddata", function() {
				self.fireEvent("load");
			}),
			on(video, "loadedmetadata", metaDataLoaded),
			on(video, "durationchange", durationChange),
			on(video, "timeupdate", function(){
				_currentPlaybackTime = Math.round(this.currentTime);
				currentState === STOPPING && this.pause();
			}),
			on(video, "error", function() {
				var msg = "Unknown error";
				switch (this.error.code) {
					case 1: msg = "Aborted"; break;
					case 2: msg = "Decode error"; break;
					case 3: msg = "Network error"; break;
					case 4: msg = "Unsupported format";
				}
				_playing = false;
				setLoadState(media.VIDEO_LOAD_STATE_UNKNOWN);
				self.fireEvent("error", {
					message: msg
				});
				self.fireEvent("complete", {
					reason: media.VIDEO_FINISH_REASON_PLAYBACK_ERROR
				});
			}),
			on(video, "abort", complete),
			on(video, "ended", complete),
			on(video, "stalled", stalled),
			on(video, "waiting", stalled),
			on(video, "mozfullscreenchange", fullscreenChange),
			on(video, "webkitfullscreenchange", fullscreenChange)
		];

		setSize();
		self.dom.appendChild(video);

		require.is(url, "Array") || (url = [url]);

		for (i = 0; i < url.length; i++) {
			src = document.createElement("source");
			src.src = url[i];
			match = url[i].match(/.+\.([^\/\.]+?)$/);
			match && mimeTypes[match[1]] && (src.type = mimeTypes[match[1]]);
			video.appendChild(src);
		}

		return video;
	}

	// Methods
	self.play = function(){
		currentState !== PLAYING && createVideo(1).play();
	};

	self.pause = function(){
		currentState === PLAYING && createVideo(1).pause();
	};

	self.release = function(){
		var i,
			parent = video && video.parentNode;
		if (parent) {
			for (i = 0; i < handles.length; i++) {
				handles[i]();
			}
			parent.removeChild(video);
		}
		video = null;
	};

	self.stop = function(){
		currentState = STOPPING;
		video.pause();
		video.currentTime = 0;
	};

	// if we have a url, then create the video
	self.url && createVideo();
});;
(function(api){
	var obj = this,
		_data = {
			'text/plain' : "",
			'text/uri-list' : "",
			'image' : ""
		};

	// Interfaces
	Ti._5.EventDriven(api);

	// Methods
	api.clearData = function(type){
		if (type && 'undefined' != typeof _data[type]) {
			_data[type] = "";
		}
		if (!type) {
			_data = {
				'text/plain' : "",
				'text/uri-list' : "",
				'image' : ""
			}
		}
	};
	api.clearText = function(){
		_data['text/plain'] = "";
	};
	api.getData = function(type){
		return _data[type];
	};
	api.getText = function(){
		return _data['text/plain'];
	};
	api.hasData = function(){
		for (var sKey in _data) {
			if (_data.hasOwnProperty(sKey) && 'text/plain' != sKey && _data[sKey]) {
				return true;
			}
		}
		return false;
	};
	api.hasText = function(){
		return !!_data['text/plain'];
	};
	api.setData = function(type, data){
		if ('text' == type) {
			type = 'text/plain';
		}
		if ('undefined' != typeof _data[type]) {
			_data[type] = data;
		}
	};
	api.setText = function(text){
		api.setData('text/plain', text);
	};

})(Ti._5.createClass('Ti.UI.Clipboard'));
;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);

	// Properties
	Ti._5.propReadOnly(api, {
		CONTACTS_KIND_ORGANIZATION: 0,
		CONTACTS_KIND_PERSON: 1,
		CONTACTS_SORT_FIRST_NAME: 2,
		CONTACTS_SORT_LAST_NAME: 3
	});

	// Methods
	api.createGroup = function(){
		console.debug('Method "Titanium.Contacts.createGroup" is not implemented yet.');
	};
	api.createPerson = function(){
		console.debug('Method "Titanium.Contacts.createPerson" is not implemented yet.');
	};
	api.getAllGroups = function(){
		console.debug('Method "Titanium.Contacts.getAllGroups" is not implemented yet.');
	};
	api.getAllPeople = function(){
		console.debug('Method "Titanium.Contacts.getAllPeople" is not implemented yet.');
	};
	api.getGroupByID = function(){
		console.debug('Method "Titanium.Contacts.getGroupByID" is not implemented yet.');
	};
	api.getPeopleWithName = function(){
		console.debug('Method "Titanium.Contacts.getPeopleWithName" is not implemented yet.');
	};
	api.getPersonByID = function(){
		console.debug('Method "Titanium.Contacts.getPersonByID" is not implemented yet.');
	};
	api.removeGroup = function(){
		console.debug('Method "Titanium.Contacts.removeGroup" is not implemented yet.');
	};
	api.removePerson = function(){
		console.debug('Method "Titanium.Contacts.removePerson" is not implemented yet.');
	};
	api.revert = function(){
		console.debug('Method "Titanium.Contacts.revert" is not implemented yet.');
	};
	api.save = function(){
		console.debug('Method "Titanium.Contacts.save" is not implemented yet.');
	};
	api.showContacts = function(){
		console.debug('Method "Titanium.Contacts.showContacts" is not implemented yet.');
	};
})(Ti._5.createClass("Ti.Contacts"));;
Ti._5.createClass("Ti.UI.Picker", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var obj = this,
		domNode,
		_columnIndex = 0,
		_type = args.type || Ti.UI.PICKER_TYPE_PLAIN,
		_minuteInterval = 1,
		_visibleItems = null,
		_rows = null;

	// Interfaces
	switch (_type) {
		case Ti.UI.PICKER_TYPE_DATE_AND_TIME:
			(domNode = Ti._5.DOMView(obj, "input", args, "Picker")).type = "datetime";
			break;
		case Ti.UI.PICKER_TYPE_DATE:
		case Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER:
		case Ti.UI.PICKER_TYPE_TIME:
			(domNode = Ti._5.DOMView(obj, "input", args, "Picker")).type = "date";
			break;
		case Ti.UI.PICKER_TYPE_PLAIN:
		default:
			domNode = Ti._5.DOMView(obj, "select", args, "Picker");
	}
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	
	// Properties
	Ti._5.prop(obj, {
		columns: [],
		countDownDuration: 0,
		locale: null,
		minDate: null,
		minuteInterval: {
			get: function(){return _minuteInterval;},
			set: function(val){_minuteInterval = Math.max(Math.min(val, 30), 1);}
		},
		selectionIndicator: false,
		type: {
			get: function(){return _type;},
			set: function(val){_type = val;}
		},
		useSpinner: null,
		value: null,
		visibleItems: {
			get: function(){return domNode.size;},
			set: function(val){ 
				// We need this for setting "size" property in constructor
				setTimeout(function() {
					domNode.size = parseInt(val);
				}, 1);
			}
		}
	});

	require.mix(obj, args);

	// Methods
	obj.add = function(rows){
		if (-1 == rows.constructor.toString().indexOf("Array")) {
			rows = [rows];
		}
		if (!_rows) {
			_rows = [];
		}
		obj._children = obj._children || [];
		for (var iCounter = 0; iCounter < rows.length; iCounter++) {
			obj._children.push(rows[iCounter]);
			_rows.push(rows[iCounter]);
		}

		obj.render(null);
	};
	obj.getSelectedRow = function(col){
		return _rows[domNode.selectedIndex];
	};
	obj.reloadColumn = function(){
		console.debug('Method "Ti.UI.Picker#.reloadColumn" is not implemented yet.');
	};
	obj.setSelectedRow = function(col, row, animated){
		if (Ti.UI.PICKER_TYPE_PLAIN != obj.type) {
			return;
		}
		/*
		if (animated) {
			obj.animate({"props": "opacity", "duration": "2s"});
		}
		*/
		domNode.selectedIndex = row;
		// The onchange event does not fire when the selected option of the
		// select object is changed programatically
		obj.fireEvent("change", {
			value			: obj.value,
			column			: obj.columns[_columnIndex], 
			columnIndex		: _columnIndex,
			selectedValue	: _rows[domNode.selectedIndex].title,
			rowIndex		: domNode.selectedIndex,
			row				: _rows[domNode.selectedIndex]
		});
	};

	// Events
	require.on(domNode, "change", function() {
		var selectedRow = _rows[domNode.selectedIndex];
		// Copy some style rules
		if (_rows[domNode.selectedIndex].dom.style.backgroundColor) {
			obj.backgroundColor = _rows[domNode.selectedIndex].backgroundColor;
		}
		if (selectedRow.dom.style.color) {
			obj.color = selectedRow.color;
		}
		obj.font = selectedRow.font;
		obj.opacity = selectedRow.opacity;
		obj.borderRadius = selectedRow.borderRadius;
		obj.borderColor = selectedRow.borderColor;
		obj.borderWidth = selectedRow.borderWidth;
		if (selectedRow.dom.style.backgroundImage) {
			obj.backgroundImage = selectedRow.backgroundImage;
		}
		if (selectedRow.dom.style.backgroundGradient) {
			obj.backgroundGradient = selectedRow.backgroundGradient;
		}

		obj.fireEvent("change", {
			value			: obj.value,
			column			: obj.columns[_columnIndex], 
			columnIndex		: _columnIndex,
			selectedValue	: "undefined" != typeof domNode.selectedIndex ? _rows[domNode.selectedIndex].title : domNode.value,
			rowIndex		: domNode.selectedIndex,
			row				: "undefined" != typeof domNode.selectedIndex ? _rows[domNode.selectedIndex] : null
		});
	});
});
;
Ti._5.createClass("Ti.UI.Switch", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var obj = this,
		on = require.on,
		domNode = Ti._5.DOMView(obj, "div", args, "Switch"),
		checkboxNode = document.createElement("input"),
		_titleContainer = document.createTextNode(""),
		_touchEnabled = true,
		_enabled = true,
		_backgroundDisabledImage = "",
		_backgroundImage = "",
		_backgroundDisabledColor = "",
		_backgroundColor = "",
		_title = "",
		_titleOff = null,
		_titleOn = null;

	// Interfaces
	Ti._5.Touchable(obj, args, true);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	checkboxNode.type =  "checkbox";
	domNode.appendChild(checkboxNode);
	domNode.appendChild(_titleContainer);

	// Properties
	Ti._5.prop(obj, {
		backgroundDisabledColor: {
			get: function() {
				return _backgroundDisabledColor ? _backgroundDisabledColor : "";
			},
			set: function(val) {
				_backgroundDisabledColor = val;
			}
		},
		backgroundDisabledImage: {
			get: function() {
				return _backgroundDisabledImage ? _backgroundDisabledImage : "";
			},
			set: function(val) {
				_backgroundDisabledImage = val;
			}
		},
		enabled: {
			get: function(){return !checkboxNode.disabled;},
			set: function(val) {
				_enabled = !!val;
				if (!_backgroundImage && obj.backgroundImage) {
					_backgroundImage = obj.backgroundImage;
				}
				if (!_backgroundColor && obj.backgroundColor) {
					_backgroundColor = obj.backgroundColor;
				}
				if (!val || !_touchEnabled) {
					checkboxNode.disabled = "disabled";
					if (_backgroundDisabledImage) {
						obj.backgroundImage = _backgroundDisabledImage;
					}
					if (_backgroundDisabledColor) {
						obj.backgroundColor = _backgroundDisabledColor;
					}
				} else {
					checkboxNode.disabled = "";
					obj.backgroundImage = _backgroundImage;
					obj.backgroundColor = _backgroundColor;
				}
			}
		},
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
		title: {
			get: function() {return _title ? _title : domNode.innerHTML;},
			set: function(val) {
				if (obj.style == Ti.UI.Android.SWITCH_STYLEcheckboxNode) {
					_title = val;
					domNode.innerHTML = "";
					domNode.appendChild(checkboxNode);
					domNode.appendChild(document.createTextNode(Ti._5._changeTextToHTML(val)));
					obj.render(null);
				}
			}
		},
		titleOff: {
			get: function(){return _titleOff;},
			set: function(val){
				_titleOff = val;
				if (!domNode.checked && obj.style == Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON) {
					obj.title = _titleOff;
				}
			}
		},
		titleOn: {
			get: function(){return _titleOn;},
			set: function(val){
				_titleOn = val; 
				if (domNode.checked && obj.style == Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON) {
					obj.title = _titleOn;
				}
			}
		},
		touchEnabled: {
			get: function() {
				return _touchEnabled ? _touchEnabled : "";
			},
			set: function(val) {
				_touchEnabled = val;
				if (!_touchEnabled) {
					checkboxNode.disabled = "disabled";
				} else {
					obj.enabled = _enabled;
				}
			}
		},
		value: {
			get: function(){return checkboxNode.checked;},
			set: function(val){checkboxNode.checked = val;onCheck(null);}
		}
	});

	require.mix(obj, args);

	function onCheck() {
		if (checkboxNode.checked && _titleOn && obj.style == Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON) {
			obj.title = _titleOn;
		}
		if (!checkboxNode.checked && _titleOff && obj.style == Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON) {
			obj.title = _titleOff;
		}
		obj.fireEvent("change", {
			value: checkboxNode.checked
		});
	}

	// Events
	on(domNode, "click", function(evt) {
		if (_touchEnabled && checkboxNode !== evt.target) {
			checkboxNode.checked = !checkboxNode.checked;
			onCheck();
		}
	});

	on(domNode, "touchstart", function(evt) {
		if (_touchEnabled && checkboxNode !== evt.target && checkboxNode.touchstart) {
			checkboxNode.checked = !checkboxNode.checked;
			onCheck();
		}
	});

	// We need this here for firing "click"/"touchstart" & "change" events in native order
	// QUESTION: is there a better way to do this?
	Ti._5.Clickable(obj);

	on(checkboxNode, "change", onCheck);
});
;
Ti._5.createClass("Ti.UI.DashboardItem", function(args){
	var obj = this;

	// Interfaces
	Ti._5.DOMView(obj, "dashboarditem", args, "DashboardItem");

	// Properties
	Ti._5.prop(obj, {
		badge: null,
		canDelete: null,
		image: null,
		selectedImage: null
	});

	// Events
	obj.addEventListener("click", function(){
		console.debug('Event "click" is not implemented yet.');
	});
	obj.addEventListener("delete", function(){
		console.debug('Event "delete" is not implemented yet.');
	});
	obj.addEventListener("move", function(){
		console.debug('Event "move" is not implemented yet.');
	});

	require.mix(obj, args);
});;
Ti._5.createClass('Ti.UI.DashboardView', function(args){
	var obj = this;

	// Interfaces
	Ti._5.DOMView(obj, 'dashboardview', args, 'DashboardView');
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		data: null,
		wobble: null
	});

	// Methods
	obj.startEditing = function(){
		console.debug('Method "Titanium.UI.DashboardView#.startEditing" is not implemented yet.');
	};
	obj.stopEditing = function(){
		console.debug('Method "Titanium.UI.DashboardView#.stopEditing" is not implemented yet.');
	};

	// Events
	obj.addEventListener('commit', function(){
		console.debug('Event "commit" is not implemented yet.');
	});
	obj.addEventListener('delete', function(){
		console.debug('Event "delete" is not implemented yet.');
	});
	obj.addEventListener('edit', function(){
		console.debug('Event "edit" is not implemented yet.');
	});
	obj.addEventListener('move', function(){
		console.debug('Event "move" is not implemented yet.');
	});

	require.mix(obj, args);
});;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);
	// Methods
	api.install = function(){
		console.debug('Method "Titanium.Database.install" is not implemented yet.');
	};
	api.open = function(name, version, desc, size) {
		return new api.DB({
			name: name,
			version: version,
			desc: desc,
			size: size
		});
	};
})(Ti._5.createClass('Ti.Database'));
;
Ti._5.createClass('Ti.Database.DB', function(args){
	var obj = this;
	var isIndexedDB = false, _db = null;
	
	if ("function" == typeof openDatabase) {
		_db = openDatabase(args.name, args.version || "1.0", args.desc || args.name,  args.size || 65536);
	} else {
		isIndexedDB = true;
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.moz_indexedDB;
		var request = indexedDB.open(args.name);
		request.onsuccess = function(event){
			_db = event.target.result || event.result;
		};
	}

	// Properties
	this.lastInsertRowId = null;
	this.name = args.name;
	this.rowsAffected = null;

	// Methods
	this.close = function() {
		if (isIndexedDB) {
			_db.close();
		}
		_db = null;
	};
	this.execute = function(sql){
		if (!_db || isIndexedDB) {
			return;
		}
		var values = arguments[1] instanceof Array ? arguments[1] : [];
		var callback = null;
		for (var i = 1; i < arguments.length; i++){
			var val = arguments[i];

			if (typeof val == 'function'){
				callback = val;
			} else if(!(val instanceof Array)){
				values.push(val);
			}
		}
		var tiResults = {};
		_db.transaction(function(tx){
			tx.executeSql(sql, values, function(tx, results){
				obj.rowsAffected = results.rowsAffected;
				
				try {
					obj.lastInsertRowId = results.insertId;
				} catch (e) {
					obj.lastInsertRowId = null;
				}
				
				if (callback) {
					callback(new Ti.Database.ResultSet(results));
				}
			}, 
			// error callback
			function(tx, error){
				if (callback){
					tiResults['error'] = error;
					callback(tiResults);
				}
			});
		});
	};
	this.remove = function(){
		obj.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",  function(rows){
			var str = "";
			while (rows.isValidRow()) {
				if ('__WebKitDatabaseInfoTable__' != rows.field(0)) { // do not delete system table
					obj.execute("DROP TABLE " + rows.field(0));
				}
				rows.next();
			}
			rows.close();
		});
	};
});
;
Ti._5.createClass("Ti.Database.ResultSet", function(args){
	var obj = this,
		currentRow = 0,
		results = args,
		aRows = args.rows;

	// Properties
	Ti._5.propReadOnly(obj, {
		rowCount: function() {return aRows.length;},
		validRow: function() {return currentRow < aRows.length;}
	});

	// Methods
	obj.close = function() {
		results.close();
	};
	obj.getRowCount = function() {
		return obj.rowCount;
	};
	obj.field = function(index){
		var v,
			row = aRows.item(currentRow),
			count = 0;
		for (v in row){
			if (count == index) {
				return row[v];
			}
			count++;
		}
	};
	obj.fieldByName = function(name) {
		var row = aRows.item(currentRow);
		return row[name.toUpperCase()];	
	};
	obj.fieldCount = function() {
		var v,
			row = aRows.item(currentRow),
			count = 0;
		for (v in row){
			count++;
		}
		//console.log(row.length, count);
		return count; 
	};
	obj.fieldName = function(index) {
		var v,
			row = aRows.item(currentRow),
			count = 0;
		for (v in row){
			if (count == index) {
				return v;
			}
			count++;
		}
	};
	obj.isValidRow = function() {
		return obj.validRow;
	};
	obj.next = function() {
		currentRow++;
	};
	obj.close = function() {
		delete this;
	}
});;
Ti._5.createClass("Ti.UI.EmailDialog", function(args){
	var obj = this;

	// Interfaces
	Ti._5.DOMView(obj, "emaildialog", args, "EmailDialog");

	// Properties
	Ti._5.prop(obj, {
		CANCELLED: 0,
		FAILED: 1,
		SAVED: 2,
		SENT: 3,
		barColor: null,
		bccRecipients: null,
		ccRecipients: null,
		html: null,
		messageBody: null,
		subject: null,
		toRecipients: null
	});

	// Methods
	obj.addAttachment = function(){
		console.debug('Method "Titanium.UI.EmailDialog#.addAttachment" is not implemented yet.');
	};
	obj.isSupported = function(){
		console.debug('Method "Titanium.UI.EmailDialog#.isSupported" is not implemented yet.');
	};
	obj.open = function(){
		console.debug('Method "Titanium.UI.EmailDialog#.open" is not implemented yet.');
	};

	// Events
	obj.addEventListener("complete", function(){
		console.debug('Event "complete" is not implemented yet.');
	});

	require.mix(obj, args);
});;
(function(api){

	var undef,
		facebookInitialized = false,
		loginAfterInitialization = false,
		appid = null,
		notLoggedInMessage = "not logged in",
		facebookDiv = document.createElement("div"),
		facebookScriptTagID = "facebook-jssdk",
		facebookLoaded = false;

	// Interfaces
	Ti._5.EventDriven(api);

	function initFacebook() {
		FB.init({
			appId: appid, // App ID
			status: true, // check login status
			cookie: true, // enable cookies to allow the server to access the session
			oauth: true, // enable OAuth 2.0
			xfbml: true  // parse XFBML
		});
		FB.getLoginStatus(function(response){
			facebookInitialized = true;
			(response.status == "connected" && initSession(response)) || loginAfterInitialization && loginInternal();
		});
	}

	function initSession(response) {
		var ar = response.authResponse;
		if (ar) {
			// Set the various status members
			loggedIn = true;
			api.uid = ar.userID;
			api.expirationDate = new Date((new Date()).getTime() + ar.expiresIn * 1000);

			// Set a timeout to match when the token expires
			ar.expiresIn && setTimeout(function(){ 
				api.logout();
			}, ar.expiresIn * 1000);

			// Fire the login event
			api.fireEvent("login", {
				cancelled: false,
				data: response,
				success: true,
				uid: api.uid
			});

			return true;
		}
	}

	// Properties
	Ti._5.prop(api, {
		accessToken: undef,
		appid: {
			get: function(){return appid;},
			set: function(val){
				facebookLoaded && initFacebook();
				appid = val;
			}
		},
		expirationDate: undef,
		forceDialogAuth: {
			get: function(){return true;},
			set: function(){}
		},
		loggedIn: false,
		permissions: undef,
		uid: undef
	});

	// Create the div required by Facebook
	facebookDiv.id = "fb-root";
	document.body.appendChild(facebookDiv);

	// Load the Facebook SDK Asynchronously.
	if (!document.getElementById(facebookScriptTagID)) {
		var facebookScriptTag = document.createElement("script"),
			head = document.getElementsByTagName("head")[0];
		facebookScriptTag.id = facebookScriptTagID; 
		facebookScriptTag.async = true;
		facebookScriptTag.src = "//connect.facebook.net/en_US/all.js";
		head.insertBefore(facebookScriptTag, head.firstChild);
	}

	window.fbAsyncInit = function() {
		facebookLoaded = true;
		appid && initFacebook();
	};

	function processResponse(response, requestParamName, requestParamValue, callback) {
		result = {source:api,success:false};
		result[requestParamName] = requestParamValue;
		if (!response || response.error) {
			response && (result["error"] = response.error);
		} else {
			result["success"] = true;
			result["result"] = JSON.stringify(response);
		}
		callback(result);
	}
		
	function loginInternal() {
		FB.login(function(response) {
			initSession(response) || api.fireEvent("login", {
				cancelled	: true,
				data		: response,
				error		: "user cancelled or an internal error occured.",
				success		: false,
				uid			: response.id
			});
		}, {"scope":api.permissions.join()});
	}

	// Methods
	api.authorize = function() {
		// Sanity check
		if (appid == null) {
			throw new Error("App ID not set. Facebook authorization cancelled.");
		}

		// Check if facebook is still initializing, and if so queue the auth request
		if (facebookInitialized) {
			// Authorize
			loginInternal();
		} else {
			loginAfterInitialization = true;
		}
	};
	api.createLoginButton = function(parameters) {
		throw new Error('Method "Titanium.Facebook.createLoginButton" is not implemented yet.');
	};
	api.dialog = function(action, params, callback) {
		if (loggedIn) {
			params.method = action;
			FB.ui(params,function(response){
				processResponse(response,"action",action,callback);
			});
		} else {
			callback({
				success	: false,
				error	: notLoggedInMessage,
				action	: action,
				source	: api
			});
		}
	};
	api.logout = function() {
		loggedIn && FB.logout(function(response) {
			loggedIn = false;
			api.fireEvent("logout", {
				success	: true
			});
		});
	};
	api.request = function(method, params, callback) {
		if (loggedIn) {
			params.method = method;
			params.urls = "facebook.com,developers.facebook.com";
			FB.api(params,function(response){
				processResponse(response,"method",method,callback);
			});
		} else {
			callback({
				success	: false,
				error	: notLoggedInMessage,
				method	: method,
				source	: api
			});
		}
	};
	api.requestWithGraphPath = function(path, params, httpMethod, callback) {
		if (loggedIn) {
			FB.api(path,httpMethod,params,function(response){
				processResponse(response,"path",path,callback);
			});
		} else {
			callback({
				success	: false,
				error	: notLoggedInMessage,
				path	: path,
				source	: api
			});
		}
	};
})(Ti._5.createClass("Ti.Facebook"));;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);
	
	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	// private method for UTF-8 encoding
	function _utf8_encode (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};
	// private method for UTF-8 decoding
	function _utf8_decode (utftext) {
	   var string = "";
	   var i = 0;
	   var c = c1 = c2 = 0;

	   while ( i < utftext.length ) {

		   c = utftext.charCodeAt(i);

		   if (c < 128) {
			   string += String.fromCharCode(c);
			   i++;
		   }
		   else if((c > 191) && (c < 224)) {
			   c2 = utftext.charCodeAt(i+1);
			   string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			   i += 2;
		   }
		   else {
			   c2 = utftext.charCodeAt(i+1);
			   c3 = utftext.charCodeAt(i+2);
			   string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			   i += 3;
		   }

	   }

		return string;
	};
	
	// Methods
	api.base64decode = function(input){
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = _utf8_decode(output);

		return output;
	};
	api.base64encode = function(input){
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = _utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

		}

		return output;
	};
	api.md5HexDigest = function(input){
		// +   original by: javascript.ru (http://www.javascript.ru/)

		var RotateLeft = function(lValue, iShiftBits) {
				return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
			};
	 
		var AddUnsigned = function(lX,lY) {
				var lX4,lY4,lX8,lY8,lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
				if (lX4 & lY4) {
					return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
				}
				if (lX4 | lY4) {
					if (lResult & 0x40000000) {
						return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
					} else {
						return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
					}
				} else {
					return (lResult ^ lX8 ^ lY8);
				}
			};
	 
		var F = function(x,y,z) { return (x & y) | ((~x) & z); };
		var G = function(x,y,z) { return (x & z) | (y & (~z)); };
		var H = function(x,y,z) { return (x ^ y ^ z); };
		var I = function(x,y,z) { return (y ^ (x | (~z))); };
	 
		var FF = function(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			};
	 
		var GG = function(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			};
	 
		var HH = function(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			};
	 
		var II = function(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			};
	 
		var ConvertToWordArray = function(str) {
				var lWordCount;
				var lMessageLength = str.length;
				var lNumberOfWords_temp1=lMessageLength + 8;
				var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
				var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
				var lWordArray=Array(lNumberOfWords-1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while ( lByteCount < lMessageLength ) {
					lWordCount = (lByteCount-(lByteCount % 4))/4;
					lBytePosition = (lByteCount % 4)*8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
					lByteCount++;
				}
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
				lWordArray[lNumberOfWords-2] = lMessageLength<<3;
				lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
				return lWordArray;
			};
	 
		var WordToHex = function(lValue) {
				var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
				for (lCount = 0;lCount<=3;lCount++) {
					lByte = (lValue>>>(lCount*8)) & 255;
					WordToHexValue_temp = "0" + lByte.toString(16);
					WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
				}
				return WordToHexValue;
			};
	 
		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;
	 
		str = _utf8_encode(input);
		x = ConvertToWordArray(str);
		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	 
		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}
	 
		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	 
		return temp.toLowerCase();

	};
})(Ti._5.createClass('Ti.Utils'));;
(function(api){

	Ti.Platform.displayCaps = api;

	// Properties
	Ti._5.propReadOnly(api, {
		density: function(){
			switch (navigator.userAgent.toLowerCase()) {
				case "iphone":
					return "medium";
				case "ipad":
					return "medium";
				default:
					return "";
			}
		},
		dpi: function(){
			switch (navigator.userAgent.toLowerCase()) {
				case "iphone":
					return 160;
				case "ipad":
					return 130;
				default:
					return 0;
			}
		},
		platformHeight: window.innerHeight,
		platformWidth: window.innerWidth
	});

})(Ti._5.createClass("Ti.Platform.DisplayCaps"));;
Ti._5.createClass("Ti.UI.TextArea", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var undef,
		obj = this,
		on = require.on,
		domNode = Ti._5.DOMView(obj, "textarea", args, "TextArea"),
		_autoLink = null,
		_autoLinkLoaded = false,
		_autocapitalization = 0,
		_autocapitalizationLoaded = false,
		_backgroundImage = "",
		_backgroundColor = "",
		_suppressReturn = null,
		_suppressLoaded = false,
		isIOS = /(iphone|ipod|ipad)/i.test(Ti.Platform.ostype),
		timeoutId  = null;

	// Interfaces
	Ti._5.Clickable(obj);
	Ti._5.Interactable(obj);
	Ti._5.Touchable(obj, args, true);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	domNode.style.resize = "none";

	// Properties
	Ti._5.prop(obj, {
		autoLink: {
			get: function() {return _autoLink;},
			set: function(val) { _autoLink = val; }
		},
		autocapitalization: {
			get: function() {return _autocapitalization;},
			set: function(val) {
				_autocapitalization = val;
				_autocapitalizationLoaded || on(domNode, "keyup", function() {
					Ti.UI._updateText(obj);
				});
				obj.value = Ti.UI._capitalizeValue(_autocapitalization, obj.value);
			}
		},
		backgroundDisabledImage: undef,
		backgroundDisabledColor: undef,
		editable: {
			get: function() { return obj.enabled; },
			set: function(val) {domNode.disabled = !val ? "disabled" : "";}
		},
		enabled: {
			get: function(){return !domNode.disabled;},
			set: function(val) {
				if (!_backgroundImage && obj.backgroundImage) {
					_backgroundImage = obj.backgroundImage;
				}
				if (!_backgroundColor && obj.backgroundColor) {
					_backgroundColor = obj.backgroundColor;
				}
				if (!val) {
					domNode.disabled = "disabled";
					obj.backgroundDisabledImage && (obj.backgroundImage = obj.backgroundDisabledImage);
					obj.backgroundDisabledColor && (obj.backgroundColor = obj.backgroundDisabledColor);
				} else {
					domNode.disabled = "";
					obj.backgroundImage = _backgroundImage;
					obj.backgroundColor = _backgroundColor;
				}
			}
		},
		keyboardToolbar: undef,
		keyboardToolbarColor: undef,
		keyboardToolbarHeight: undef,
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		suppressReturn: {
			get: function() {return _suppressReturn;},
			set: function(val) {
				_suppressReturn = val;
				if (!_suppressLoaded) {
					_suppressLoaded = true;
					on(domNode, "keyup", function(evt) {
						if (_suppressReturn && evt.keyCode == 13) {
							evt.preventDefault && evt.preventDefault();
							return false;
						}
						return true;
					});
				}
			}
		},
		value: {
			get: function() {return domNode.value;},
			set: function(val) {
				domNode.value = val ? Ti.UI._capitalizeValue(_autocapitalization, val) : "";
			}
		}
	});

	// Improve change event for textarea
	on(domNode, "keyup", function(evt) {
		obj.fireEvent("change", {
			source: evt.target,
			type: evt.type,
			value: domNode && domNode.value
		});
	});

	require.mix(obj, args);

	// Methods
	obj.blur = function(){
		domNode.blur();
	};
	obj.focus = function(){
		domNode.focus();
	};
	obj.hasText = function(){
		return !!obj.value;
	};
	
	function isSelected(event, isMouse) {
		var startPos = domNode.selectionStart,
			endPos = domNode.selectionEnd;
		if (obj.value.substring(startPos,endPos).length != 0 && (!event.shiftKey || isMouse)){
			obj.fireEvent("selected", {
				range: {
					location: startPos,
					length: obj.value.substring(startPos,endPos).length
				}
			});
			return true;
		}
		return false;
	}
	
	function iOSFix() {
		if (timeoutId) {
			return;
		}
		timeoutId = setTimeout(function() {
			timeoutId = null;
			if (!isSelected({shiftKey: false}, true)) {
				iOSFix();
			} 
		}, 500);
	};
	
	on(domNode, "keyup", function(evt) {
		isSelected(evt, false);
		isIOS && iOSFix();
	});

	on(domNode, "mouseup", function(evt) {
		isSelected(evt, true);
		isIOS && iOSFix();
	});
});
;
Ti._5.createClass('Ti.UI.PickerColumn', function(args){
	var obj = this;

	// Interfaces
	Ti._5.DOMView(obj, 'pickercolumn', args, 'PickerColumn');
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		rowCount: 0,
		rows: 0
	});

	// Methods
	obj.addRow = function(){
		console.debug('Method "Titanium.UI.PickerColumn#.addRow" is not implemented yet.');
	};
	obj.removeRow = function(){
		console.debug('Method "Titanium.UI.PickerColumn#.removeRow" is not implemented yet.');
	};

	require.mix(obj, args);
});;
Ti._5.createClass("Ti.UI.ProgressBar", function(args){

	// Interfaces
	Ti._5.DOMView(this, "progressbar", args, "ProgressBar");

	// Methods
	this.color = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.color" is not implemented yet.');
	};
	this.font = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.font" is not implemented yet.');
	};
	this.max = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.max" is not implemented yet.');
	};
	this.message = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.message" is not implemented yet.');
	};
	this.min = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.min" is not implemented yet.');
	};
	this.style = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.style" is not implemented yet.');
	};
	this.value = function(){
		console.debug('Method "Titanium.UI.ProgressBar#.value" is not implemented yet.');
	};
	
	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.iPhone.ProgressBarStyle', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.progressbarstyle', args, 'iPhone.ProgressBarStyle');

	// Properties
	Ti._5.prop(this, 'BAR');

	Ti._5.prop(this, 'DEFAULT');

	Ti._5.prop(this, 'PLAIN');


	require.mix(this, args);
});;
Ti._5.createClass("Ti.UI.OptionDialog", function(args){
	var obj = this;

	// Interfaces
	Ti._5.DOMView(obj, "optiondialog", args, "OptionDialog");

	// Properties
	Ti._5.prop(obj, {
		androidView: null,
		cancel: null,
		destructive: null,
		options: null,
		selectedIndex: null,
		title: null,
		titleid: null
	});

	// Methods
	obj.show = function(){
		console.debug('Method "Titanium.UI.OptionDialog#.show" is not implemented yet.');
	};

	// Events
	obj.addEventListener("click", function(){
		console.debug('Event "click" is not implemented yet.');
	});

	require.mix(obj, args);
});;
(function(api){
	var undef,
		on = require.on,
		lastOrient = null,
		lastShake = (new Date()).getTime(),
		lastAccel = {};

	// Interfaces
	Ti._5.EventDriven(api);

	Ti._5.prop(api, "orientation", Ti.UI.UNKNOWN);

	function getWindowOrientation() {
		api.orientation = Ti.UI.PORTRAIT;
		switch (window.orientation) {
			case 90:
				api.orientation = Ti.UI.LANDSCAPE_LEFT;
				break;
			case -90:
				api.orientation = Ti.UI.LANDSCAPE_RIGHT;
				break;
			case 180:
				api.orientation = Ti.UI.UPSIDE_PORTRAIT;
				break;
		}
		return api.orientation;
	}
	getWindowOrientation();

	on(window, "orientationchange", function(evt) {
		getWindowOrientation();
		lastOrient !== api.orientation && api.fireEvent('orientationchange', {
			orientation: lastOrient = api.orientation,
			source: evt.source
		});
	});

	function deviceOrientation(evt) {
		var orient = null,
			beta = Math.abs(evt.beta || evt.y|0 * 90),
			gamma = Math.abs(evt.gamma || evt.x|0 * 90);

		beta < 5 && gamma > 170 && (orient = Ti.UI.FACE_DOWN);
		beta < 5 && gamma < 5 && (orient = Ti.UI.FACE_UP);
		beta > 50 && 0 > beta && lastOrient != orient && (orient = Ti.UI.UPSIDE_PORTRAIT);

		if (orient !== null && lastOrient !== orient) {
			api.fireEvent('orientationchange', {
				orientation: lastOrient = orient,
				source: evt.source
			});
		}
	}

	on(window, "MozOrientation", deviceOrientation);
	on(window, "deviceorientation", deviceOrientation);

	on(window, "devicemotion", function(evt) {
		var e = evt.acceleration || evt.accelerationIncludingGravity,
			x, y, z,
			currentTime,
			accel = e && {
				x: e.x,
				y: e.y,
				z: e.z,
				source: evt.source
			};

		if (accel) {
			if (lastAccel.x !== undef) {
				x = Math.abs(lastAccel.x - accel.x) > 10;
				y = Math.abs(lastAccel.y - accel.y) > 10;
				z = Math.abs(lastAccel.z - accel.z) > 10;
				if ((x && (y || z)) || (y && z)) {
					currentTime = (new Date()).getTime();
					if ((accel.timestamp = currentTime - lastShake) > 300) {
						lastShake = currentTime;
						api.fireEvent('shake', accel);
					}
				}
			}
			lastAccel = accel;
		}
	});

})(Ti._5.createClass('Ti.Gesture'));;
Ti._5.createClass('Titanium.UI.iPad', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'ipad', args, 'iPad');

	// Properties
	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_ANY');

	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_DOWN');

	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_LEFT');

	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_RIGHT');

	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_UNKNOWN');

	Ti._5.prop(this, 'POPOVER_ARROW_DIRECTION_UP');

	// Methods
	this.createPopover = function(){
		console.debug('Method "Titanium.UI.iPad#.createPopover" is not implemented yet.');
	};
	this.createSplitWindow = function(){
		console.debug('Method "Titanium.UI.iPad#.createSplitWindow" is not implemented yet.');
	};

	require.mix(this, args);
});;
Ti._5.createClass("Ti.UI.ScrollableView", function(args){
	args = require.mix({
		height: "100%",
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "div", args, "ScrollableView"),
		_currentPage = args.currentPage || -1,
		_interval = null;

	// Interfaces
	Ti._5.Touchable(obj, args);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);	

	domNode.style.position = "absolute";
	domNode.style.overflow = "hidden";

	// Properties
	Ti._5.prop(obj, {
		currentPage: {
			get: function(){return _currentPage;},
			set: function(val){
				if (val >= 0 && val < obj.views.length) {
					obj._scrollToViewPosition(val);
					_currentPage = val;
				}
			}
		},
		maxZoomScale: null,
		minZoomScale: null,
		pagingControlColor: null,
		pagingControlHeight: null,
		showPagingControl: null,
		views: []
	});

	// Methods
	obj.addView = function(view) {
		// Sanity check
		if (view) {
			obj.views.push(view);

			// Check if any children have been added yet, and if not load this view
			_currentPage === -1 && obj._scrollToViewPosition(0);
		}
	};
	obj._viewToRemoveAfterScroll = -1;
	obj._removeViewFromList = function(viewIndex) {
		// Remove the view
		obj.views.splice(viewIndex,1);

		// Update the current view if necessary
		if (viewIndex < _currentPage){
			_currentPage--;
		}
	}
	obj.removeView = function(view) {
		// Get and validate the location of the view
		var viewIndex = obj.views.indexOf(view);
		if (viewIndex == -1) {
			return;
		}

		// Update the view if this view was currently visible
		if (viewIndex == _currentPage) {
			obj._viewToRemoveAfterScroll = viewIndex;
			if (obj.views.length == 1) {
				obj._removeViewFromList(viewIndex);
				domNode.removeChild(domNode.firstChild);
			} else {
			    obj._scrollToViewPosition(viewIndex == obj.views.length -1 ? --viewIndex : ++viewIndex);
			}
		} else {
			obj._removeViewFromList(viewIndex);
		}
	};
	obj.scrollToView = function(view) {
		obj._scrollToViewPosition(obj.views.indexOf(view))
	};
	obj._scrollToViewPosition = function(viewIndex) {
		// Sanity check
		if (viewIndex < 0 || viewIndex >= obj.views.length || viewIndex == _currentPage) {
			return;
		}

		obj._attachFinalView = function(view) {
			// Remove the previous container
			if (domNode.childNodes.length > 0) {
				domNode.removeChild(domNode.firstChild);
			}

			// Attach the new container
			var _contentContainer = document.createElement("div");
			_contentContainer.style.position = "absolute";
			_contentContainer.style.width = "100%";
			_contentContainer.style.height = "100%";
			_contentContainer.appendChild(view);
			domNode.appendChild(_contentContainer);
		};

		// If the scrollableView hasn"t been laid out yet, we can"t do much since the scroll distance is unknown.
		// At the same time, it doesn"t matter since the user won"t see it anyways. So we just append the new
		// element and don"t show the transition animation.
		if (!domNode.offsetWidth) {
			obj._attachFinalView(obj.views[viewIndex].dom);
		} else {
			// Stop the previous timer if it is running (i.e. we are in the middle of an animation)
			_interval && clearInterval(_interval);

			// Remove the previous container
			if (domNode.childNodes.length) {
				domNode.removeChild(domNode.firstChild);
			}

			// Calculate the views to be scrolled
			var _w = domNode.offsetWidth,
				_viewsToScroll = [],
				_scrollingDirection = -1,
				_initialPosition = 0;
			if (viewIndex > _currentPage) {
				for (var i = _currentPage; i <= viewIndex; i++) {
					_viewsToScroll.push(obj.views[i].dom);
				}
			} else {
				for (var i = viewIndex; i <= _currentPage; i++) {
					_viewsToScroll.push(obj.views[i].dom);
				}
				_initialPosition = -(_viewsToScroll.length - 1) * _w;
				_scrollingDirection = 1;
			}

			// Create the animation div
			var _contentContainer = document.createElement("div");
			_contentContainer.style.position = "absolute";
			_contentContainer.style.width = _viewsToScroll.length * _w;
			_contentContainer.style.height = "100%";
			domNode.appendChild(_contentContainer);

			// Attach the child views, each contained in their own div so we can mess with positioning w/o touching the views
			for (var i = 0; i < _viewsToScroll.length; i++) {
				var _viewDiv = document.createElement("div");
				_viewDiv.style.position = "absolute";
				_viewDiv.style.width = _w + "px";
				_viewDiv.style.height = "100%";
				_viewDiv.appendChild(_viewsToScroll[i]);
				_contentContainer.appendChild(_viewDiv);
				_viewDiv.style.left = i * _w + "px";
			}

			// Attach the div to the scrollableView
			domNode.appendChild(_contentContainer);
			_contentContainer.style.left = _initialPosition + "px";

			// Set the start time
			var _startTime = (new Date()).getTime(),
				_duration = 300 + 0.2 * _w, // Calculate a weighted duration so that larger views take longer to scroll.
				_distance = (_viewsToScroll.length - 1) * _w;

			// Start the timer
			_interval = setInterval(function(){
				// Calculate the new position
				var _currentTime = ((new Date()).getTime() - _startTime),
					_normalizedTime = _currentTime / (_duration / 2),
					_newPosition;
				if (_normalizedTime < 1) {
					_newPosition = _distance / 2 * _normalizedTime * _normalizedTime;
				} else {
					_normalizedTime--;
					_newPosition = -_distance / 2 * (_normalizedTime * (_normalizedTime - 2) - 1);
				}

				// Update the position of the div
				_contentContainer.style.left = _scrollingDirection * Math.round(_newPosition) + _initialPosition + "px";

				// Check if the transition is finished.
				if (_currentTime >= _duration) {
					clearInterval(_interval);
					_interval = null;
					obj._attachFinalView(obj.views[viewIndex].dom);
					if (obj._viewToRemoveAfterScroll != -1) {
						obj._removeViewFromList(obj._viewToRemoveAfterScroll);
						obj._viewToRemoveAfterScroll = -1;
					}
		    	}
			},32); // Update around 32 FPS.
		}
		_currentPage = viewIndex;
	};

	// If some views were defined via args, process them now
	obj.views.length && obj._scrollToViewPosition(_currentPage != -1 ? _currentPage : 0);

	// Events
	obj.addEventListener("scroll", function() {
		console.debug('Event "scroll" is not implemented yet.');
	});

	require.mix(obj, args);
});;
Ti._5.createClass('Titanium.UI.iPhone.StatusBar', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.statusbar', args, 'iPhone.StatusBar');

	// Properties
	Ti._5.prop(this, 'DEFAULT');

	Ti._5.prop(this, 'GRAY');

	Ti._5.prop(this, 'OPAQUE_BLACK');

	Ti._5.prop(this, 'TRANSLUCENT_BLACK');

	require.mix(this, args);
});;
Ti._5.createClass("Ti.UI.SearchBar", function(args){
	args = require.mix({
		unselectable: true
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "input", args, "SearchBar"),
		_autocapitalization = 0,
		_autocapitalizationLoaded = false,
		_hinttextid = null,
		_promptid = null;

	// Interfaces
	Ti._5.Touchable(obj, args, true);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);
	Ti._5.Interactable(obj);
	Ti._5.Clickable(obj);

	domNode.type = "search";

	// Properties
	Ti._5.prop(obj, {
		autocapitalization: {
			get: function() {return _autocapitalization;},
			set: function(val) {
				_autocapitalization = val;
				if (!_autocapitalizationLoaded) {
					require.on(domNode, "keyup", function() {
						Ti.UI._updateText(obj);
					});
				}
				obj.value = Ti.UI._capitalizeValue(_autocapitalization, obj.value);
			}
		},
		autocorrect: false,
		barColor: null,
		hintText: {
			get: function() {return domNode.placeholder;},
			set: function(val) {
				domNode.placeholder = Ti.UI._capitalizeValue(_autocapitalization, val);
			}
		},
		hinttextid: {
			get: function(){return _hinttextid;},
			set: function(val){obj.hintText = L(_hinttextid = val);}
		},
		keyboardType: null,
		prompt: "",
		promptid: {
			get: function(){return _promptid;},
			set: function(val){obj.prompt = L(_promptid = val);}
		},
		showCancel: false,
		size: {
			get: function() {
				return {
					width	: obj.width,
					height	: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		},
		value: {
			get: function() {return domNode.value;},
			set: function(val) {domNode.value = val ? Ti.UI._capitalizeValue(_autocapitalization, val) : "";}
		}
	});

	require.mix(obj, args);

	// Methods
	obj.focus = function(){ domNode.focus(); };
	obj.blur = function(){ domNode.blur(); };
});
;
Ti._5.createClass("Ti.UI.Slider", function(args){
	args = require.mix({
		unselectable: true,
		width: "100%"
	}, args);

	var obj = this,
		domNode = Ti._5.DOMView(obj, "input", args, "Slider"),
		_backgroundDisabledImage = "",
		_backgroundImage = "", 
		_backgroundDisabledColor = "",
		_backgroundColor = "",
		_max = null,
		_min = null,
		_value = "";
	
	// Interfaces
	domNode.type = "range"; 
	Ti._5.Clickable(obj);
	Ti._5.Touchable(obj, args, true);
	Ti._5.Styleable(obj, args);
	Ti._5.Positionable(obj, args);

	// Properties
	Ti._5.prop(obj, {
		disabledLeftTrackImage: null,
		disabledRightTrackImage: null,
		disabledThumbImage: null,
		enabled: {
			get: function(){return !domNode.disabled;},
			set: function(val) {
				if (!_backgroundImage && obj.backgroundImage) {
					_backgroundImage = obj.backgroundImage;
				}
				if (!_backgroundColor && obj.backgroundColor) {
					_backgroundColor = obj.backgroundColor;
				}
				if (!val) {
					domNode.disabled = "disabled";
					if (_backgroundDisabledImage) {
						obj.backgroundImage = _backgroundDisabledImage;
					}
					if (_backgroundDisabledColor) {
						obj.backgroundColor = _backgroundDisabledColor;
					}
				} else {
					domNode.disabled = "";
					obj.backgroundImage = _backgroundImage;
					obj.backgroundColor = _backgroundColor;
				}
			}
		},
		backgroundDisabledImage: {
			get: function() {
				return _backgroundDisabledImage ? _backgroundDisabledImage : "";
			},
			set: function(val) {
				_backgroundDisabledImage = val;
			}
		},
		backgroundDisabledColor: {
			get: function() {
				return _backgroundDisabledColor ? _backgroundDisabledColor : "";
			},
			set: function(val) {
				_backgroundDisabledColor = val;
			}
		},
		highlightedLeftTrackImage: null,
		highlightedRightTrackImage: null,
		highlightedThumbImage: null,
		leftTrackImage: null,
		max: {
			get: function(){return domNode.max;},
			set: function(val){domNode.max = parseFloat(val);}
		},
		maxRange: null,
		min: {
			get: function(){return domNode.min;},
			set: function(val){domNode.min = parseFloat(val);}
		},
		minRange: null,
		rightTrackImage: null,
		selectedLeftTrackImage: null,
		selectedRightTrackImage: null,
		selectedThumbImage: null,
		thumbImage: null,
		value: {
			get: function(){return _value;},
			set: function(val){
				_value = val;
				domNode.value = Ti._5._changeTextToHTML(val);
				obj.fireEvent("change", {
					thumbOffset	: null,
					thumbSize	: null,
					value		: val
				});
			}
		},
		size: {
			get: function() {
				return {
					width: obj.width,
					height: obj.height
				}
			},
			set: function(val) {
				val.width && (obj.width = Ti._5.px(val.width));
				val.height && (obj.height = Ti._5.px(val.height));
			}
		}
	});

	require.mix(obj, args);

	// Events
	require.on(domNode, "change", function() {
		obj.fireEvent("change", {
			thumbOffset	: null,
			thumbSize	: null,
			value		: obj.value
		});
	});
	
});;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);
	
	function _clone(oSource) {
		if(!oSource || 'object' !== typeof oSource)  {
			return oSource;
		}
		var oClone = 'function' === typeof oSource.pop ? [] : {};
		var sIndex = null;
		for(sIndex in oSource) {
			if(oSource.hasOwnProperty(sIndex)) {
				var oProp = oSource[sIndex];
				if(oProp && 'object' === typeof oProp) {
					oClone[sIndex] = _clone(oProp);
				} else {
					oClone[sIndex] = oProp;
				}
			}
		}
		return oClone;
	}

	var _DOMParser = new DOMParser();
	api.DOMDocument = null;
	
	function _NodeList() {
		var _nodes = [];

		Ti._5.prop(this, 'length', {
			get: function() {return _nodes.length}
		});
	
		this.item = function (iIndex) {
			return _nodes[iIndex]; 
		}
		this.add = function (oNode) {
			_nodes.push(oNode);
		}
		this.remove = function (oNode) {
			for (var iCounter=_nodes.length; iCounter--;) {
				if (oNode == _nodes[iCounter]) {
					_nodes.splice(iCounter,1);
				}
			}
		}
	}
	
	function _addEvaluate(oNode) {
		oNode.evaluate = function (xml) {
			tempXPathResult = _DOMParser.parseFromString(_serialize1Node(oNode),"text/xml");
			var oNodes = tempXPathResult.evaluate(xml, tempXPathResult, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			var oResult = new _NodeList();
			var oTemp = null;
			if (oNodes) {
				while (oTemp = oNodes.iterateNext()) {
					oResult.add(_nodeWrapper(oTemp));
				}
			}
			return oResult;
		};
		return oNode;
	}
	
	function _nodeWrapper(oNode) {
		if (!oNode.nodeValue) {
			oNode.nodeValue = oNode;
		}
		if (!oNode.text) {
			oNode.text = oNode.nodeValue;
		}
		
		return _addEvaluate(oNode);
	}
	
	// Methods
	api.parseString = function(xml) {
		domDocument = _DOMParser.parseFromString(xml.replace(/>\s*</gi, "><"),"text/xml");
		var oResult = domDocument.firstChild || domDocument;

		// Add some functionality for compatibility with Mobile SDK
		oResult = _addEvaluate(oResult);
		oResult.documentElement = _addEvaluate(domDocument.documentElement);
		oResult.getElementsByTagName = function (sName) {
			return oResult.parentNode ? oResult.parentNode.getElementsByTagName(sName) : oResult.getElementsByTagName(sName);
		}
		
		return api.DOMDocument = oResult;
	};
	
	function _serialize1Node (node) {
		if ('undefined' != typeof node.outerHTML) {
			return node.outerHTML;
		}
		
		if ('undefined' != typeof XMLSerializer) {
			var serializer = new XMLSerializer();
			return serializer.serializeToString(node);
		} else if (node.xml) {
			return node.xml;
		} else {
			var oNode = document.createElement("div");
			oNode.appendChild(node);
			return oNode.innerHTML;
		}
	};
	
	api.serializeToString = function (nodeList) {
		if ('array' != typeof nodeList && '[object NodeList]' !== nodeList.toString()) {
			return _serialize1Node(nodeList);
		}
		var sResult = "";
		for (var iCounter=0; iCounter < nodeList.length; iCounter++) {
			sResult += _serialize1Node(nodeList[iCounter]);
		}
		return sResult;
	}
	
})(Ti._5.createClass('Ti.XML'));;
(function(api){
	// Properties
	Ti._5.prop(api, 'BLUE', {
		get: function() { return {selectedBackgroundColor: 'blue'}; }
	});
	Ti._5.prop(api, 'GRAY', {
		get: function() { return {selectedBackgroundColor: 'gray'}; }
	});
	Ti._5.prop(api, 'NONE', {
		get: function() { return {selectedColor: '', selectedBackgroundImage: '', selectedBackgroundColor: ''}; }
	});

})(Ti._5.createClass('Titanium.UI.iPhone.TableViewCellSelectionStyle'));;
Ti._5.createClass('Titanium.UI.iPhone.RowAnimationStyle', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.rowanimationstyle', args, 'iPhone.RowAnimationStyle');

	// Properties
	Ti._5.prop(this, 'BOTTOM');

	Ti._5.prop(this, 'FADE');

	Ti._5.prop(this, 'LEFT');

	Ti._5.prop(this, 'NONE');

	Ti._5.prop(this, 'RIGHT');

	Ti._5.prop(this, 'TOP');

	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.iPhone.TableViewScrollPosition', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.tableviewscrollposition', args, 'iPhone.TableViewScrollPosition');

	// Properties
	Ti._5.prop(this, 'BOTTOM');

	Ti._5.prop(this, 'MIDDLE');

	Ti._5.prop(this, 'NONE');

	Ti._5.prop(this, 'TOP');

	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.iPhone.SystemIcon', function(args){
	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'iphone.systemicon', args, 'iPhone.SystemIcon');

	// Properties
	Ti._5.prop(this, 'BOOKMARKS');

	Ti._5.prop(this, 'CONTACTS');

	Ti._5.prop(this, 'DOWNLOADS');

	Ti._5.prop(this, 'FAVORITES');

	Ti._5.prop(this, 'FEATURED');

	Ti._5.prop(this, 'HISTORY');

	Ti._5.prop(this, 'MORE');

	Ti._5.prop(this, 'MOST_RECENT');

	Ti._5.prop(this, 'MOST_VIEWED');

	Ti._5.prop(this, 'RECENTS');

	Ti._5.prop(this, 'SEARCH');

	Ti._5.prop(this, 'TOP_RATED');

	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.Toolbar', function(args){

	// deprecated since 1.8.0

	var obj = this;
	
	// Set defaults
	args = Ti._5.extend({}, args);
	args.unselectable = true;
	args.width = args.width || '100%';
		
	// Interfaces
	Ti._5.DOMView(this, 'toolbar', args, 'Toolbar');
	Ti._5.Touchable(this, args);
	Ti._5.Styleable(this, args);
	Ti._5.Positionable(this, args);

	require.mix(this, args);
});;
Ti._5.createClass('Titanium.UI.TabbedBar', function(args){

	// deprecated since 1.8.0

	var obj = this;
	// Interfaces
	Ti._5.DOMView(this, 'tabbedbar', args, 'TabbedBar');
	Ti._5.Touchable(this, args);
	Ti._5.Styleable(this, args);
	Ti._5.Positionable(this, args);

	// Properties
	Ti._5.prop(this, 'index');

	Ti._5.prop(this, 'labels');

	Ti._5.prop(this, 'style');

	require.mix(this, args);
});;
(function(api){
	// Interfaces
	Ti._5.EventDriven(api);
	// Methods
	api.yql = function(){
		console.debug('Method "Titanium.Yahoo.yql" is not implemented yet.');
	};
})(Ti._5.createClass('Ti.Yahoo'));;
