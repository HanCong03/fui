/*!
 * ====================================================
 * Flex UI - v1.0.0 - 2015-02-11
 * https://github.com/fex-team/fui
 * GitHub: https://github.com/fex-team/fui.git 
 * Copyright (c) 2015 Baidu Kity Group; Licensed MIT
 * ====================================================
 */

(function () {
var _p = {
    r: function(index) {
        if (_p[index].inited) {
            return _p[index].value;
        }
        if (typeof _p[index].value === "function") {
            var module = {
                exports: {}
            }, returnValue = _p[index].value(null, module.exports, module);
            _p[index].inited = true;
            _p[index].value = returnValue;
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                for (var key in module.exports) {
                    if (module.exports.hasOwnProperty(key)) {
                        _p[index].inited = true;
                        _p[index].value = module.exports;
                        return module.exports;
                    }
                }
            }
        } else {
            _p[index].inited = true;
            return _p[index].value;
        }
    }
};

//src/base/creator.js
/**
 * UI构造工厂, 提供可通过参数配置项创建多个构件的机制.
 */
_p[0] = {
    value: function(require) {
        var Creator = {}, $ = _p.r(4), FUI_NS = _p.r(11);
        $.extend(Creator, {
            parse: function(options) {
                var pool = [];
                if ($.isArray(options)) {
                    $.each(options, function(i, opt) {
                        pool.push(getInstance(opt));
                    });
                    return pool;
                } else {
                    return getInstance(options);
                }
            }
        });
        function getInstance(option) {
            var Constructor = FUI_NS[option.clazz];
            if (!Constructor) {
                return null;
            }
            return new Constructor(option);
        }
        return Creator;
    }
};

//src/base/exports.js
/**
 * 模块暴露
 */
_p[1] = {
    value: function(require) {
        var FUI_NS = _p.r(11);
        // 配置参数必须最先注册
        FUI_NS.___register({
            ALLOW_FOCUS: false
        });
        FUI_NS.___register({
            Widget: _p.r(63),
            Icon: _p.r(43),
            Label: _p.r(49),
            Button: _p.r(38),
            ToggleButton: _p.r(62),
            Buttonset: _p.r(37),
            Separator: _p.r(58),
            Item: _p.r(47),
            Input: _p.r(46),
            InputButton: _p.r(44),
            Mask: _p.r(50),
            ColorPicker: _p.r(39),
            Tabs: _p.r(61),
            SpinButton: _p.r(59),
            Container: _p.r(40),
            Panel: _p.r(52),
            PPanel: _p.r(55),
            LabelPanel: _p.r(48),
            Menu: _p.r(51),
            InputMenu: _p.r(45),
            ButtonMenu: _p.r(35),
            DropPanel: _p.r(42),
            Popup: _p.r(54),
            PopupMenu: _p.r(53),
            SelectMenu: _p.r(56),
            Select: _p.r(57),
            Dialog: _p.r(41),
            SubMenu: _p.r(60),
            Utils: _p.r(13),
            Creator: _p.r(0)
        });
        FUI_NS.__export();
    }
};

//src/base/extensions.js
/**
 * 扩展模块暴露
 */
_p[2] = {
    value: function(require) {
        var FUI_NS = _p.r(11);
        FUI_NS.___register({
            TablePicker: _p.r(17)
        });
    }
};

//src/base/jhtmls.js
/**
 * jhtmls模板引擎
 */
_p[3] = {
    value: function() {
        /* global jhtmls: true */
        return jhtmls;
    }
};

//src/base/jquery.js
/**
 * jquery模块封装
 */
_p[4] = {
    value: function(require) {
        return window.jQuery;
    }
};

//src/base/kit/class.js
/**
 * @description 创建一个类
 * @param {String}    fullClassName  类全名，包括命名空间。
 * @param {Plain}     defines        要创建的类的特性
 *     defines.constructor  {Function}       类的构造函数，实例化的时候会被调用。
 *     defines.base         {String}         基类的名称。名称要使用全名。（因为base是javascript未来保留字，所以不用base）
 *     defines.mixin        {Array<String>}  要混合到新类的类集合
 *     defines.<method>     {Function}       其他类方法
 *
 * TODO:
 *     Mixin 构造函数调用支持
 */
_p[5] = {
    value: function(require, exports) {
        // just to bind context
        Function.prototype.bind = Function.prototype.bind || function(thisObj) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.apply(thisObj, args);
        };
        // 所有类的基类
        function Class() {}
        Class.__KityClassName = "Class";
        // 提供 base 调用支持
        Class.prototype.base = function(name) {
            var caller = arguments.callee.caller;
            var method = caller.__KityMethodClass.__KityBaseClass.prototype[name];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        };
        // 直接调用 base 类的同名方法
        Class.prototype.callBase = function() {
            var caller = arguments.callee.caller;
            var method = caller.__KityMethodClass.__KityBaseClass.prototype[caller.__KityMethodName];
            return method.apply(this, arguments);
        };
        Class.prototype.mixin = function(name) {
            var caller = arguments.callee.caller;
            var mixins = caller.__KityMethodClass.__KityMixins;
            if (!mixins) {
                return this;
            }
            var method = mixins[name];
            return method.apply(this, Array.prototype.slice.call(arguments, 1));
        };
        Class.prototype.callMixin = function() {
            var caller = arguments.callee.caller;
            var methodName = caller.__KityMethodName;
            var mixins = caller.__KityMethodClass.__KityMixins;
            if (!mixins) {
                return this;
            }
            var method = mixins[methodName];
            if (methodName == "constructor") {
                for (var i = 0, l = method.length; i < l; i++) {
                    method[i].call(this);
                }
                return this;
            } else {
                return method.apply(this, arguments);
            }
        };
        Class.prototype.pipe = function(fn) {
            if (typeof fn == "function") {
                fn.call(this, this);
            }
            return this;
        };
        Class.prototype.getType = function() {
            return this.__KityClassName;
        };
        Class.prototype.getClass = function() {
            return this.constructor;
        };
        // 检查基类是否调用了父类的构造函数
        // 该检查是弱检查，假如调用的代码被注释了，同样能检查成功（这个特性可用于知道建议调用，但是出于某些原因不想调用的情况）
        function checkBaseConstructorCall(targetClass, classname) {
            var code = targetClass.toString();
            if (!/this\.callBase/.test(code)) {
                throw new Error(classname + " : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数");
            }
        }
        var KITY_INHERIT_FLAG = "__KITY_INHERIT_FLAG_" + +new Date();
        function inherit(constructor, BaseClass, classname) {
            var KityClass = eval("(function " + classname + "( __inherit__flag ) {" + "if( __inherit__flag != KITY_INHERIT_FLAG ) {" + "KityClass.__KityConstructor.apply(this, arguments);" + "}" + "this.__KityClassName = KityClass.__KityClassName;" + "})||0");
            KityClass.__KityConstructor = constructor;
            KityClass.prototype = new BaseClass(KITY_INHERIT_FLAG);
            for (var methodName in BaseClass.prototype) {
                if (BaseClass.prototype.hasOwnProperty(methodName) && methodName.indexOf("__Kity") !== 0) {
                    KityClass.prototype[methodName] = BaseClass.prototype[methodName];
                }
            }
            KityClass.prototype.constructor = KityClass;
            return KityClass;
        }
        function mixin(NewClass, mixins) {
            if (false === mixins instanceof Array) {
                return NewClass;
            }
            var i, length = mixins.length, proto, method;
            NewClass.__KityMixins = {
                constructor: []
            };
            for (i = 0; i < length; i++) {
                proto = mixins[i].prototype;
                for (method in proto) {
                    if (false === proto.hasOwnProperty(method) || method.indexOf("__Kity") === 0) {
                        continue;
                    }
                    if (method === "constructor") {
                        // constructor 特殊处理
                        NewClass.__KityMixins.constructor.push(proto[method]);
                    } else {
                        NewClass.prototype[method] = NewClass.__KityMixins[method] = proto[method];
                    }
                }
            }
            return NewClass;
        }
        function extend(BaseClass, extension) {
            if (extension.__KityClassName) {
                extension = extension.prototype;
            }
            for (var methodName in extension) {
                if (extension.hasOwnProperty(methodName) && methodName.indexOf("__Kity") && methodName != "constructor") {
                    var method = BaseClass.prototype[methodName] = extension[methodName];
                    method.__KityMethodClass = BaseClass;
                    method.__KityMethodName = methodName;
                }
            }
            return BaseClass;
        }
        Class.prototype._accessProperty = function() {
            return this._propertyRawData || (this._propertyRawData = {});
        };
        exports.createClass = function(classname, defines) {
            var constructor, NewClass, BaseClass;
            if (arguments.length === 1) {
                defines = arguments[0];
                classname = "AnonymousClass";
            }
            BaseClass = defines.base || Class;
            if (defines.hasOwnProperty("constructor")) {
                constructor = defines.constructor;
                if (BaseClass != Class) {
                    checkBaseConstructorCall(constructor, classname);
                }
            } else {
                constructor = function() {
                    this.callBase.apply(this, arguments);
                    this.callMixin.apply(this, arguments);
                };
            }
            NewClass = inherit(constructor, BaseClass, classname);
            NewClass = mixin(NewClass, defines.mixins);
            NewClass.__KityClassName = constructor.__KityClassName = classname;
            NewClass.__KityBaseClass = constructor.__KityBaseClass = BaseClass;
            NewClass.__KityMethodName = constructor.__KityMethodName = "constructor";
            NewClass.__KityMethodClass = constructor.__KityMethodClass = NewClass;
            // 下面这些不需要拷贝到原型链上
            delete defines.mixins;
            delete defines.constructor;
            delete defines.base;
            NewClass = extend(NewClass, defines);
            return NewClass;
        };
        exports.extendClass = extend;
    }
};

//src/base/kit/common.js
/**
 * 通用工具包
 */
_p[6] = {
    value: function(require) {
        var $ = _p.r(4), __marker = "__fui__marker__" + +new Date();
        return {
            isElement: function(target) {
                return target.nodeType === 1;
            },
            getMarker: function() {
                return __marker;
            },
            getRect: function(node) {
                var rect = node.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    bottom: rect.bottom,
                    left: rect.left,
                    right: rect.right
                };
            },
            getBound: function(node) {
                var w = 0, h = 0;
                if (node.tagName.toLowerCase() === "body") {
                    h = $(this.getView(node));
                    w = h.width();
                    h = h.height();
                    return {
                        top: 0,
                        left: 0,
                        bottom: h,
                        right: w,
                        width: w,
                        height: h
                    };
                } else {
                    return this.getRect(node);
                }
            },
            getView: function(node) {
                return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
            }
        };
    }
};

//src/base/kit/compile.js
/**
 * 模板编译器
 */
_p[7] = {
    value: function(require) {
        var jhtmls = _p.r(3), $ = _p.r(4);
        var Helper = {
            forEach: function(arras, cb) {
                $.each(arras, function(i, item) {
                    cb.call(null, i, item);
                });
            }
        };
        return {
            compile: function(tpl, data) {
                tpl = $.trim(tpl);
                if (tpl.length === 0) {
                    return "";
                }
                return jhtmls.render(tpl, data, Helper);
            }
        };
    }
};

//src/base/kit/draggable.js
/**
 * Draggable Lib
 */
_p[8] = {
    value: function(require, exports) {
        var $ = _p.r(4), common = _p.r(6), DEFAULT_OPTIONS = {
            handler: null,
            target: null,
            axis: "all",
            range: null
        };
        function Draggable(options) {
            this.__options = $.extend({}, DEFAULT_OPTIONS, options);
            this.__started = false;
            this.__point = {
                x: 0,
                y: 0
            };
            this.__location = {
                x: 0,
                y: 0
            };
            this.__range = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
        }
        $.extend(Draggable.prototype, {
            bind: function(target) {
                if (target) {
                    this.__options.target = target;
                }
                if (!this.__options.target) {
                    throw new Error("target unset");
                }
                this.__target = this.__options.target;
                this.__handler = this.__options.handler;
                this.__rangeNode = this.__options.range;
                this.__initOptions();
                this.__initEnv();
                this.__initEvent();
            },
            __initEvent: function() {
                var handler = this.__handler, _self = this;
                $(handler).on("mousedown", function(e) {
                    if (e.which !== 1) {
                        return;
                    }
                    var location = common.getRect(handler);
                    e.preventDefault();
                    _self.__started = true;
                    _self.__point = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    _self.__location = {
                        x: location.left,
                        y: location.top
                    };
                    _self.__range = _self.__getRange();
                });
                $(handler.ownerDocument).on("mousemove", function(e) {
                    if (!_self.__started) {
                        return;
                    }
                    var x = e.clientX, y = e.clientY;
                    if (_self.__allowAxisX) {
                        _self.__xMove(x);
                    }
                    if (_self.__allowAxisY) {
                        _self.__yMove(y);
                    }
                }).on("mouseup", function(e) {
                    _self.__started = false;
                });
            },
            __xMove: function(x) {
                var diff = x - this.__point.x;
                diff = this.__location.x + diff;
                if (diff < this.__range.left) {
                    diff = this.__range.left;
                } else if (diff > this.__range.right) {
                    diff = this.__range.right;
                }
                this.__target.style.left = diff + "px";
            },
            __yMove: function(y) {
                var diff = y - this.__point.y;
                diff = this.__location.y + diff;
                if (diff < this.__range.top) {
                    diff = this.__range.top;
                } else if (diff > this.__range.bottom) {
                    diff = this.__range.bottom;
                }
                this.__target.style.top = diff + "px";
            },
            __initEnv: function() {
                var $handler = $(this.__handler);
                $handler.css("cursor", "move");
            },
            __initOptions: function() {
                if (!this.__handler) {
                    this.__handler = this.__target;
                }
                if (!this.__rangeNode) {
                    this.__rangeNode = this.__options.target.ownerDocument.body;
                }
                this.__allowAxisX = this.__options.axis !== "y";
                this.__allowAxisY = this.__options.axis !== "x";
            },
            __getRange: function() {
                var range = this.__rangeNode, targetRect = common.getRect(this.__target);
                if (range.tagName.toLowerCase() === "body") {
                    range = $(this.__rangeNode.ownerDocument);
                    range = {
                        top: 0,
                        left: 0,
                        bottom: range.height(),
                        right: range.width()
                    };
                } else {
                    range = common.getRect(range);
                }
                return {
                    top: range.top,
                    left: range.left,
                    bottom: range.bottom - targetRect.height,
                    right: range.right - targetRect.width
                };
            }
        });
        return function(options) {
            return new Draggable(options);
        };
    }
};

//src/base/kit/extend.js
/**
 * 弥补jQuery的extend在克隆对象和数组时存在的问题
 */
_p[9] = {
    value: function(require) {
        var $ = _p.r(4);
        function extend(target) {
            var isPlainObject = false, isArray = false, sourceObj = null;
            if (arguments.length === 1) {
                return copy(target);
            }
            $.each([].slice.call(arguments, 1), function(i, source) {
                for (var key in source) {
                    sourceObj = source[key];
                    if (!source.hasOwnProperty(key)) {
                        continue;
                    }
                    isPlainObject = $.isPlainObject(sourceObj);
                    isArray = $.isArray(sourceObj);
                    if (!isPlainObject && !isArray) {
                        target[key] = source[key];
                    } else if (isPlainObject) {
                        if (!$.isPlainObject(target[key])) {
                            target[key] = {};
                        }
                        target[key] = extend(target[key], sourceObj);
                    } else if (isArray) {
                        target[key] = extend(sourceObj);
                    }
                }
            });
            return target;
        }
        function copy(target) {
            var tmp = null;
            if ($.isPlainObject(target)) {
                return extend({}, target);
            } else if ($.isArray(target)) {
                tmp = [];
                $.each(target, function(index, item) {
                    if ($.isPlainObject(item) || $.isArray(item)) {
                        tmp.push(copy(item));
                    } else {
                        tmp.push(item);
                    }
                });
                return tmp;
            } else {
                return target;
            }
        }
        return extend;
    }
};

//src/base/kit/widget.js
/**
 * 构件相关工具方法
 */
_p[10] = {
    value: function(require) {
        return {
            isContainer: function(widget) {
                return widget.__widgetType === "container";
            }
        };
    }
};

//src/base/ns.js
/**
 * FUI名称空间
 */
_p[11] = {
    value: function() {
        // 容纳所有构件的实例池
        var WIDGET_POOL = {};
        return {
            widgets: WIDGET_POOL,
            /**
         * 暴露命名空间本身
         * @private
         */
            __export: function() {
                window.FUI = this;
            },
            ___register: function(widgetName, widget) {
                if (typeof widgetName === "string") {
                    this[widgetName] = widget;
                } else {
                    widget = widgetName;
                    for (var key in widget) {
                        if (widget.hasOwnProperty(key)) {
                            this[key] = widget[key];
                        }
                    }
                }
            },
            __registerInstance: function(widget) {
                WIDGET_POOL[widget.getId()] = widget;
            }
        };
    }
};

//src/base/sysconf.js
/**
 * UI系统配置
 */
_p[12] = {
    value: function(require) {
        var NS = _p.r(11);
        return {
            classPrefix: "fui-",
            layout: {
                TOP: "top",
                LEFT: "left",
                BOTTOM: "bottom",
                RIGHT: "right",
                CENTER: "center",
                MIDDLE: "middle",
                // 内部定位
                LEFT_TOP: "left-top",
                RIGHT_TOP: "right-top",
                LEFT_BOTTOM: "left-bottom",
                RIGHT_BOTTOM: "right-bottom"
            },
            allowFocus: !!NS.ALLOW_FOCUS,
            control: {
                input: 1,
                textarea: 1,
                button: 1,
                select: 1,
                option: 1,
                object: 1,
                embed: 1
            }
        };
    }
};

//src/base/utils.js
/**
 * utils类包， 提供常用操作的封装，补充jQuery的不足
 */
_p[13] = {
    value: function(require) {
        var $ = _p.r(4), Utils = {
            Tpl: _p.r(7),
            Widget: _p.r(10),
            createDraggable: _p.r(8)
        };
        return $.extend(Utils, _p.r(6), _p.r(5));
    }
};

//src/ext/word/tpl/t-picker.js
_p[14] = {
    value: function() {
        return '<div unselectable="on" class="fui-t-picker"></div>\n';
    }
};

//src/ext/word/tpl/table-picker.js
_p[15] = {
    value: function() {
        return '<div unselectable="on" class="fui-table-picker"></div>\n';
    }
};

//src/ext/word/widget/t-picker.js
/**
 * TPicker -- table 选择器
 */
_p[16] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(14);
        return _p.r(13).createClass("TPicker", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    // 10行 10列
                    row: 10,
                    col: 10
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "TPicker";
                this.__tpl = tpl;
                // 背板
                this.__backplane = null;
            },
            __render: function() {
                this.callBase();
                this.__backplane = this.__createBackplane();
                this.__element.appendChild(this.__backplane);
            },
            __initEvent: function() {
                var _self = this;
                var info = {};
                this.callBase();
                $(this.__backplane).delegate("td", "mousemove", function(e) {
                    info = e.target.getAttribute("data-index").split(",");
                    info = {
                        row: parseInt(info[0], 10),
                        col: parseInt(info[1], 10)
                    };
                    _self.__update(info.row, info.col);
                });
                $(this.__backplane).on("click", function(e) {
                    _self.__select(info.row, info.col);
                });
            },
            __select: function(row, col) {
                this.trigger("pickerselect", {
                    row: row,
                    col: col
                });
            },
            __update: function(row, col) {
                var tr = null, rowCount = this.__options.row, colCount = this.__options.col, className = CONF.classPrefix + "table-picker-hoverin";
                for (var i = 0; i < rowCount; i++) {
                    tr = this.__backplane.rows[i];
                    for (var j = 0; j < colCount; j++) {
                        if (i <= row && j <= col) {
                            tr.cells[j].className = className;
                        } else {
                            tr.cells[j].className = "";
                        }
                    }
                }
                this.trigger("pickerhover", {
                    row: row,
                    col: col
                });
            },
            __createBackplane: function() {
                var tpl = [], tmp = null;
                for (var i = 0, len = this.__options.row; i < len; i++) {
                    tmp = [];
                    for (var j = 0, jlen = this.__options.col; j < jlen; j++) {
                        tmp.push('<td data-index="' + i + "," + j + '"></td>');
                    }
                    tpl.push("<tr>" + tmp.join("") + "</tr>");
                }
                tpl = $("<table><tbody>" + tpl.join("") + "</tbody></table>");
                tpl.addClass(CONF.classPrefix + "t-picker-table");
                return tpl[0];
            }
        });
    }
};

//src/ext/word/widget/table-picker.js
/**
 * Table选择器构件
 */
_p[17] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(15), Label = _p.r(49), TPicker = _p.r(16), Button = _p.r(38), PPanel = _p.r(55), Mask = _p.r(50);
        return _p.r(13).createClass("TablePicker", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    button: null,
                    row: 10,
                    col: 10
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            open: function() {
                this.__panelWidget.show();
                this.__maskWidget.show();
            },
            close: function() {
                this.__panelWidget.hide();
                this.__maskWidget.hide();
            },
            // Overload
            appendTo: function(container) {
                container.appendChild(this.__buttonWidget.getElement());
            },
            getButton: function() {
                return this.__buttonWidget;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "TablePicker";
                this.__tpl = tpl;
                this.__pickerWidget = null;
                this.__labelWidget = null;
                this.__buttonWidget = null;
                this.__panelWidget = null;
                this.__maskWidget = null;
            },
            __render: function() {
                this.callBase();
                this.__pickerWidget = new TPicker(this.__options);
                this.__labelWidget = new Label({
                    text: "插入表格"
                });
                this.__buttonWidget = new Button(this.__options.button);
                this.__panelWidget = new PPanel({
                    className: CONF.classPrefix + "table-picker-panel",
                    column: true,
                    resize: "none"
                });
                this.__maskWidget = new Mask();
                this.__panelWidget.appendWidget(this.__labelWidget);
                this.__panelWidget.appendWidget(this.__pickerWidget);
                this.__panelWidget.positionTo(this.__buttonWidget);
            },
            __initEvent: function() {
                var _self = this;
                this.callBase();
                this.__buttonWidget.on("btnclick", function(e) {
                    _self.open();
                });
                this.__maskWidget.on("maskclick", function(e) {
                    _self.close();
                });
                this.__pickerWidget.on("pickerhover", function(e, info) {
                    var row = info.row + 1, col = info.col + 1;
                    _self.__labelWidget.setText(row + "x" + col + " 表格");
                }).on("pickerselect", function(e, info) {
                    var row = info.row + 1, col = info.col + 1;
                    _self.close();
                    _self.trigger("pickerselect", {
                        row: row,
                        col: col
                    });
                });
            },
            __createBackplane: function() {
                var tpl = [], tmp = null;
                for (var i = 0, len = this.__options.row; i < len; i++) {
                    tmp = [];
                    for (var j = 0, jlen = this.__options.col; j < jlen; j++) {
                        tmp.push('<td data-index="' + i + "," + j + '"></td>');
                    }
                    tpl.push("<tr>" + tmp.join("") + "</tr>");
                }
                tpl = $("<table><tbody>" + tpl.join("") + "</tbody></table>");
                tpl.addClass(CONF.classPrefix + "t-picker-table");
                return tpl[0];
            }
        });
    }
};

//src/tpl/button-menu.js
_p[18] = {
    value: function() {
        return '<div unselectable="on" class="fui-button-menu"></div>\n';
    }
};

//src/tpl/button.js
_p[19] = {
    value: function() {
        return '<div unselectable="on" class="fui-button"></div>\n';
    }
};

//src/tpl/colorpicker-panel.js
_p[20] = {
    value: function() {
        return '<div unselectable="on" class="fui-colorpicker-panel-content">\n' + '<div unselectable="on" class="fui-clear-color">清除颜色</div>\n' + '<table unselectable="on">\n' + '<tbody unselectable="on">\n' + "colors.forEach (function (colorList){\n" + '<tr unselectable="on">\n' + "colorList.forEach(function (color) {\n" + '<td unselectable="on" data-value="#{color}">\n' + '<div unselectable="on" class="fui-color-block" style="background: #{color}"></div>\n' + "</td>\n" + "});\n" + "</tr>\n" + "});\n" + "</tbody>\n" + "</table>\n" + "</div>\n";
    }
};

//src/tpl/colorpicker.js
_p[21] = {
    value: function() {
        return '<div unselectable="on" class="fui-colorpicker">\n' + '<div unselectable="on" class="fui-color-bar"></div>\n' + "</div>\n";
    }
};

//src/tpl/dialog.js
_p[22] = {
    value: function() {
        return '<div unselectable="on" class="fui-dialog-wrap">\n' + '<div unselectable="on" class="fui-dialog-head">\n' + '<h1 unselectable="on" class="fui-dialog-caption">$caption</h1>\n' + "</div>\n" + '<div unselectable="on" class="fui-dialog-body"></div>\n' + '<div unselectable="on" class="fui-dialog-foot"></div>\n' + "</div>\n";
    }
};

//src/tpl/drop-panel.js
_p[23] = {
    value: function() {
        return "<div unselectable=\"on\" class=\"fui-drop-panel\"  #{ text ? 'title=\"' + m.text + '\"' : '' }></div>\n";
    }
};

//src/tpl/icon.js
_p[24] = {
    value: function() {
        return '<div unselectable="on" class="fui-icon" >\n' + "if ( this.img ) {\n" + '<img unselectable="on" src="#{this.img}" >\n' + "}\n" + "</div>\n";
    }
};

//src/tpl/input-button.js
_p[25] = {
    value: function() {
        return '<div unselectable="on" class="fui-input-button"></div>\n';
    }
};

//src/tpl/input-menu.js
_p[26] = {
    value: function() {
        return '<div unselectable="on" class="fui-input-menu"></div>\n';
    }
};

//src/tpl/input.js
_p[27] = {
    value: function() {
        return '<input unselectable="on" class="fui-input"  autocomplete="off" !#{ value ? \'value="\' + value + \'"\' : \'\'}>\n';
    }
};

//src/tpl/item.js
_p[28] = {
    value: function() {
        return "<div unselectable=\"on\" class=\"fui-item!#{ selected ? ' fui-item-selected': '' }\" ></div>\n";
    }
};

//src/tpl/label.js
_p[29] = {
    value: function() {
        return '<div unselectable="on" class="fui-label">$text</div>\n';
    }
};

//src/tpl/mask.js
_p[30] = {
    value: function() {
        return '<div unselectable="on" class="fui-mask" style="background-color: $bgcolor; opacity: $opacity;"></div>\n';
    }
};

//src/tpl/panel.js
_p[31] = {
    value: function() {
        return '<div unselectable="on" class="fui-panel"></div>\n';
    }
};

//src/tpl/separator.js
_p[32] = {
    value: function() {
        return '<div unselectable="on" class="fui-separator"></div>\n';
    }
};

//src/tpl/spin-button.js
_p[33] = {
    value: function() {
        return '<div unselectable="on" class="fui-spin-button"></div>\n';
    }
};

//src/tpl/tabs.js
_p[34] = {
    value: function() {
        return '<div unselectable="on" class="fui-tabs">\n' + '<div unselectable="on" class="fui-tabs-button-wrap"></div>\n' + '<div unselectable="on" class="fui-tabs-panel-wrap"></div>\n' + "</div>\n";
    }
};

//src/widget/button-menu.js
/**
 * Button对象
 * 通用按钮构件
 */
_p[35] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(18), Button = _p.r(38), Menu = _p.r(51), Mask = _p.r(50), LAYOUT = CONF.layout;
        return _p.r(13).createClass("ButtonMenu", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    // item选项
                    menu: null,
                    mask: null,
                    buttons: [],
                    selected: -1,
                    layout: LAYOUT.RIGHT
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            open: function() {
                this.__openState = true;
                this.__maskWidget.show();
                this.__menuWidget.show();
                this.addClass(CONF.classPrefix + "button-active");
            },
            close: function() {
                this.__openState = false;
                this.__maskWidget.hide();
                this.__menuWidget.hide();
                this.removeClass(CONF.classPrefix + "button-active");
            },
            isOpen: function() {
                return !!this.__openState;
            },
            getSelected: function() {
                return this.__menuWidget.getSelected();
            },
            getSelectedItem: function() {
                return this.__menuWidget.getSelectedItem();
            },
            getValue: function() {
                return this.getSelectedItem().getValue();
            },
            __render: function() {
                this.callBase();
                this.__initButtons();
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.__menuWidget.positionTo(this.__element);
                this.__menuWidget.appendTo(this.__element.ownerDocument.body);
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "ButtonMenu";
                this.__tpl = tpl;
                this.__buttonWidgets = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                this.__openState = false;
                if (this.__options.selected !== -1) {
                    this.__options.menu.selected = this.__options.selected;
                }
            },
            __initButtons: function() {
                var buttons = [], ele = this.__element, btn = null, lastIndex = this.__options.buttons.length - 1;
                if (this.__options.layout === LAYOUT.TOP || this.__options.layout === LAYOUT.LEFT) {
                    btn = new Button(this.__options.buttons[lastIndex]);
                    btn.appendTo(ele);
                } else {
                    lastIndex = -1;
                }
                $.each(this.__options.buttons, function(index, options) {
                    if (lastIndex !== index) {
                        var button = new Button(options);
                        button.appendTo(ele);
                        buttons.push(button);
                    } else {
                        buttons.push(btn);
                    }
                });
                this.addClass(CONF.classPrefix + "layout-" + this.__options.layout);
                buttons[buttons.length - 1].addClass(CONF.classPrefix + "open-btn");
                this.__buttonWidgets = buttons;
            },
            __initEvent: function() {
                var lastBtn = this.__buttonWidgets[this.__buttonWidgets.length - 1], _self = this;
                this.callBase();
                lastBtn.on("click", function(e) {
                    _self.open();
                });
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.close();
                    _self.trigger("select", info);
                }).on("change", function(e, info) {
                    _self.trigger("change", info);
                });
                this.on("btnclick", function(e) {
                    e.stopPropagation();
                    var btnIndex = $.inArray(e.widget, this.__buttonWidgets);
                    if (btnIndex > -1 && btnIndex < this.__buttonWidgets.length - 1) {
                        this.trigger("buttonclick", {
                            button: this.__buttonWidgets[btnIndex]
                        });
                    }
                });
            }
        });
    }
};

//src/widget/button-set-menu.js
/**
 * InputMenu构件
 * 可接受输入的下拉菜单构件
 */
_p[36] = {
    value: function(require) {
        var $ = _p.r(4), tpl = _p.r(26), InputButton = _p.r(44), Menu = _p.r(51), Mask = _p.r(50), Utils = _p.r(13);
        return _p.r(13).createClass("InputMenu", {
            base: _p.r(63),
            constructor: function(options) {
                var marker = Utils.getMarker();
                this.callBase(marker);
                var defaultOptions = {
                    input: null,
                    menu: null,
                    mask: null
                };
                this.__extendOptions(defaultOptions, options);
                this.widgetName = "InputMenu";
                this.__tpl = tpl;
                // 最后输入时间
                this.__lastTime = 0;
                // 最后选中的记录
                this.__lastSelect = null;
                this.__inputWidget = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                // menu状态， 记录是否已经append到dom树上
                this.__menuState = false;
                if (options !== marker) {
                    this.__render();
                }
            },
            select: function(index) {
                this.__menuWidget.select(index);
            },
            setValue: function(value) {
                this.__inputWidget.setValue(value);
                return this;
            },
            getValue: function() {
                return this.__inputWidget.getValue();
            },
            __render: function() {
                if (this.__rendered) {
                    return this;
                }
                this.__inputWidget = new InputButton(this.__options.input);
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__inputWidget.appendTo(this.__element);
                this.__menuWidget.positionTo(this.__inputWidget);
                this.__initInputMenuEvent();
            },
            open: function() {
                this.__maskWidget.show();
                this.__menuWidget.show();
            },
            close: function() {
                this.__maskWidget.hide();
                this.__menuWidget.hide();
            },
            __initInputMenuEvent: function() {
                var _self = this;
                this.on("buttonclick", function() {
                    if (!this.__menuState) {
                        this.__appendMenu();
                        this.__menuState = true;
                    }
                    this.__inputWidget.unfocus();
                    this.open();
                });
                this.on("keypress", function(e) {
                    this.__lastTime = new Date();
                });
                this.on("keyup", function(e) {
                    if (e.keyCode !== 8 && e.keyCode !== 13 && new Date() - this.__lastTime < 500) {
                        this.__update();
                    }
                });
                this.on("inputcomplete", function() {
                    this.__inputWidget.selectRange(99999999);
                    this.__inputComplete();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.setValue(info.value);
                    _self.trigger("select", info);
                    _self.close();
                });
                this.__menuWidget.on("change", function(e, info) {
                    e.stopPropagation();
                    _self.trigger("change", info);
                });
                // 阻止input自身的select和change事件
                this.__inputWidget.on("select change", function(e) {
                    e.stopPropagation();
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                // 记录最后选中的数据
                this.on("select", function(e, info) {
                    this.__lastSelect = info;
                });
            },
            // 更新输入框内容
            __update: function() {
                var inputValue = this.getValue(), lowerCaseValue = inputValue.toLowerCase(), values = this.__getItemValues(), targetValue = null;
                if (!inputValue) {
                    return;
                }
                $.each(values, function(i, val) {
                    if (val.toLowerCase().indexOf(lowerCaseValue) === 0) {
                        targetValue = val;
                        return false;
                    }
                });
                if (targetValue) {
                    this.__inputWidget.setValue(targetValue);
                    this.__inputWidget.selectRange(inputValue.length);
                }
            },
            // 获取所有item的值列表
            __getItemValues: function() {
                var vals = [];
                $.each(this.__menuWidget.getWidgets(), function(index, item) {
                    vals.push(item.getValue());
                });
                return vals;
            },
            // 用户输入完成
            __inputComplete: function() {
                var values = this.__getItemValues(), targetIndex = -1, inputValue = this.getValue(), lastSelect = this.__lastSelect;
                $.each(values, function(i, val) {
                    if (val === inputValue) {
                        targetIndex = i;
                        return false;
                    }
                });
                this.trigger("select", {
                    index: targetIndex,
                    value: inputValue
                });
                if (!lastSelect || lastSelect.value !== inputValue) {
                    this.trigger("change", {
                        from: lastSelect || {
                            index: -1,
                            value: null
                        },
                        to: {
                            index: targetIndex,
                            value: inputValue
                        }
                    });
                }
            },
            __appendMenu: function() {
                this.__menuWidget.appendTo(this.__inputWidget.getElement().ownerDocument.body);
            }
        });
    }
};

//src/widget/button-set.js
/**
 * Buttonset对象
 * 通用按钮构件
 */
_p[37] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), ToggleButton = _p.r(62);
        return _p.r(13).createClass("Buttonset", {
            base: _p.r(52),
            constructor: function(options) {
                var defaultOptions = {
                    // 初始选中项, -1表示不选中任何项
                    selected: -1
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getButtons: function() {
                return this.getWidgets();
            },
            getButton: function(index) {
                return this.getWidgets()[index] || null;
            },
            getValue: function() {
                if (this.__currentIndex > -1) {
                    return this.__widgets[this.__currentIndex].getValue();
                }
                return null;
            },
            getSelectedIndex: function() {
                return this.__currentIndex;
            },
            appendButton: function() {
                return this.appendWidget.apply(this, arguments);
            },
            insertButton: function() {
                return this.insertWidget.apply(this, arguments);
            },
            select: function(indexOrWidget) {
                if (this.__options.disabled) {
                    return this;
                }
                if (indexOrWidget instanceof ToggleButton) {
                    indexOrWidget = $.inArray(indexOrWidget, this.__widgets);
                }
                if (indexOrWidget < 0) {
                    return this.clearSelect();
                }
                indexOrWidget = this.__widgets[indexOrWidget];
                this.__pressButton(indexOrWidget);
                return this;
            },
            selectByValue: function(value) {
                var values = this.__widgets.map(function(button) {
                    return button.getValue();
                });
                return this.select(values.indexOf(value));
            },
            clearSelect: function() {
                this.__pressButton(null);
                return this;
            },
            removeButton: function() {
                return this.removeWidget.apply(this, arguments);
            },
            insertWidget: function(index, widget) {
                var returnValue = this.callBase(index, widget);
                if (returnValue === null) {
                    return returnValue;
                }
                if (index <= this.__currentIndex) {
                    this.__currentIndex++;
                }
                if (index <= this.__prevIndex) {
                    this.__prevIndex++;
                }
                return returnValue;
            },
            removeWidget: function(widget) {
                var index = widget;
                if (typeof index !== "number") {
                    index = this.indexOf(widget);
                }
                widget = this.callBase(widget);
                if (index === this.__currentIndex) {
                    this.__currentIndex = -1;
                } else if (index < this.__currentIndex) {
                    this.__currentIndex--;
                }
                if (index === this.__prevIndex) {
                    this.__prevIndex = -1;
                } else if (index < this.__prevIndex) {
                    this.__prevIndex--;
                }
                return widget;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Buttonset";
                // 当前选中项
                this.__currentIndex = this.__options.selected;
                // 前一次选中项
                this.__prevIndex = -1;
            },
            __render: function() {
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "buttonset");
                this.__initButtons();
                return this;
            },
            __initButtons: function() {
                var _self = this, buttonWidget = null;
                $.each(this.__options.buttons, function(index, buttonOption) {
                    buttonWidget = new ToggleButton($.extend({}, buttonOption, {
                        pressed: index === _self.__options.selected,
                        preventDefault: true
                    }));
                    // 切换
                    buttonWidget.__on("click", function(e) {
                        if (!_self.isDisabled()) {
                            _self.__pressButton(this);
                        }
                    });
                    buttonWidget.__on("change", function(e) {
                        // 阻止buton本身的事件向上冒泡
                        e.stopPropagation();
                    });
                    _self.appendButton(buttonWidget);
                });
            },
            /**
         * 按下指定按钮, 该方法会更新其他按钮的状态和整个button-set的状态
         * @param button
         * @private
         */
            __pressButton: function(button) {
                this.__prevIndex = this.__currentIndex;
                this.__currentIndex = this.indexOf(button);
                if (this.__currentIndex === this.__prevIndex) {
                    return;
                }
                if (button) {
                    button.press();
                }
                // 弹起其他按钮
                $.each(this.__widgets, function(i, otherButton) {
                    if (otherButton !== button) {
                        otherButton.bounce();
                    }
                });
                this.trigger("change", {
                    currentIndex: this.__currentIndex,
                    prevIndex: this.__prevIndex
                });
            },
            __valid: function(ele) {
                return ele instanceof ToggleButton;
            }
        });
    }
};

//src/widget/button.js
/**
 * Button对象
 * 通用按钮构件
 */
_p[38] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), buttonTpl = _p.r(19), Icon = _p.r(43), Label = _p.r(49);
        return _p.r(13).createClass("Button", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    label: null,
                    text: null,
                    icon: {},
                    // label相对icon的位置
                    layout: "right"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getLabel: function() {
                return this.__labelWidget.getText();
            },
            setLabel: function(text) {
                return this.__labelWidget.setText(text);
            },
            getLabelWidget: function() {
                return this.__labelWidget;
            },
            getIconWidget: function() {
                return this.__iconWidgets;
            },
            __render: function() {
                this.callBase();
                this.__iconWidgets = [];
                this.__labelWidget = new Label(this.__options.label);
                if (this.__options.icon) {
                    var icon = this.__options.icon;
                    for (var i = 0, len = icon.length; i < len; i++) {
                        this.__iconWidgets[i] = new Icon(icon[i]);
                        this.__element.appendChild(this.__iconWidgets[i].getElement());
                    }
                }
                this.__element.appendChild(this.__labelWidget.getElement());
                $(this.__element).addClass(CONF.classPrefix + "button-layout-" + this.__options.layout);
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Button";
                this.__tpl = buttonTpl;
                this.__iconWidgets = null;
                this.__labelWidget = null;
                if (typeof this.__options.label !== "object") {
                    this.__options.label = {
                        text: this.__options.label
                    };
                }
                if (this.__options.icon && !("length" in this.__options.icon)) {
                    this.__options.icon = [ this.__options.icon ];
                }
            },
            __initEvent: function() {
                this.callBase();
                this.on("click", function() {
                    this.__trigger("btnclick");
                });
            }
        });
    }
};

//src/widget/colorpicker.js
/**
 * 容器类： PPanel = Positioning Panel
 */
_p[39] = {
    value: function(require) {
        var $ = _p.r(4), Utils = _p.r(13), CONF = _p.r(12), tpl = _p.r(21), Icon = _p.r(43), PPanel = _p.r(55), Mask = _p.r(50), Label = _p.r(49), LAYOUT = CONF.layout;
        return Utils.createClass("ColorPicker", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    defaultColor: "#ffffff",
                    columnCount: 10,
                    label: null,
                    colors: [ "#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#f2f2f2", "#808080", "#ddd8c2", "#c6d9f1", "#dbe5f1", "#f2dbdb", "#eaf1dd", "#e5dfec", "#daeef3", "#fde9d9", "#d9d9d9", "#595959", "#c4bc96", "#8db3e2", "#b8cce4", "#e5b8b7", "#d6e3bc", "#ccc0d9", "#b6dde8", "#fbd4b4", "#bfbfbf", "#404040", "#938953", "#548dd4", "#95b3d7", "#d99594", "#c2d69b", "#b2a1c7", "#92cddc", "#fabf8f", "#a6a6a6", "#262626", "#4a442a", "#17365d", "#365f91", "#943634", "#76923c", "#5f497a", "#31849b", "#e36c0a", "#7f7f7f", "#0d0d0d", "#1c1a10", "#0f243e", "#243f60", "#622423", "#4e6128", "#3f3151", "#205867", "#974706" ],
                    layout: LAYOUT.BOTTOM
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            selectByColor: function(color) {
                var colors = this.__options.colors;
                var index = colors.indexOf(color);
                if (index === -1) {
                    return;
                }
                this.__colorBar.css("background", colors[index]);
            },
            resetColor: function() {
                this.currentColor = null;
                this.__colorBar.css("background", this.__options.defaultColor);
            },
            getValue: function() {
                return this.currentColor;
            },
            __render: function() {
                this.callBase();
                var colors = this.__options.colors;
                var count = this.__options.columnCount;
                this.__icon = new Icon(this.__options.icon);
                this.__openIcon = new Icon(this.__options.openIcon);
                this.__panel = new PPanel({
                    layout: this.__options.layout,
                    target: this.__element
                });
                this.__maskWidget = new Mask(this.__options.mask);
                this.__colorBar = $(".fui-color-bar", this.__element);
                this.__colorBar.css("background", this.__options.defaultColor);
                this.__element.appendChild(this.__icon.getElement());
                this.__element.appendChild(this.__openIcon.getElement());
                if (this.__options.label) {
                    this.__label = new Label(this.__options.label);
                    this.__element.appendChild(this.__label.getElement());
                }
                this.__panel.getContentElement().innerHTML = Utils.Tpl.compile(_p.r(20), {
                    colors: function() {
                        var data = [];
                        var row;
                        for (var i = 0, len = colors.length; i < len; i++) {
                            row = Math.floor(i / count);
                            if (!data[row]) {
                                data[row] = [];
                            }
                            data[row].push(colors[i]);
                        }
                        return data;
                    }()
                });
                this.__panel.addClass(CONF.classPrefix + "colorpicker-panel");
                $(this.__element).addClass(CONF.classPrefix + "colorpicker-btn");
            },
            __initEvent: function() {
                var _self = this;
                this.callBase();
                this.on("click", function(e) {
                    this.open();
                });
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                $(".fui-clear-color", this.__panel.getElement()).on("click", function() {
                    _self.__clearColor();
                });
                $(this.__panel.getElement()).on("click", "td", function(e) {
                    _self.__selectColor(this);
                });
            },
            open: function() {
                this.__panel.show();
                this.__maskWidget.show();
                this.addClass("fui-opened");
            },
            close: function() {
                this.__panel.hide();
                this.__maskWidget.hide();
                this.removeClass("fui-opened");
            },
            __selectColor: function(colorNode) {
                var color = colorNode.getAttribute("data-value");
                this.__selected(color);
            },
            __clearColor: function() {
                this.__selected(null);
            },
            __selected: function(color) {
                this.currentColor = color;
                this.__colorBar.css("background", color || this.__options.defaultColor);
                this.trigger("select", color);
                this.close();
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "ColorPicker";
                this.__icon = null;
                this.__maskWidget = null;
                this.__openIcon = null, this.__colorBar = null;
                this.__panel = null;
                this.__tpl = tpl;
                this.currentColor = null;
            }
        });
    }
};

//src/widget/container.js
/**
 * Container类， 所有容器类的父类`
 * @abstract
 */
_p[40] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), Widget = _p.r(63), Creator = _p.r(0), $ = _p.r(4);
        return Utils.createClass("Container", {
            base: Widget,
            constructor: function(options) {
                var defaultOptions = {
                    column: false,
                    widgets: null
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            indexOf: function(widget) {
                return $.inArray(widget, this.__widgets);
            },
            disable: function() {
                this.callBase();
                $.each(this.__widgets, function(index, widget) {
                    widget.disable();
                });
            },
            enable: function() {
                this.callBase();
                $.each(this.__widgets, function(index, widget) {
                    widget.enable();
                });
            },
            getWidgets: function() {
                return this.__widgets;
            },
            getWidget: function(index) {
                return this.__widgets[index] || null;
            },
            getWidgetByValue: function(value) {
                var widget = null;
                $.each(this.__widgets, function(i, wgt) {
                    if (wgt.getValue() === value) {
                        widget = wgt;
                        return false;
                    }
                });
                return widget;
            },
            appendWidget: function(widget) {
                if (!this.__valid(widget)) {
                    return null;
                }
                if (this.__options.disabled) {
                    widget.disable();
                }
                this.__widgets.push(widget);
                widget.appendTo(this.__contentElement);
                if (!this.__options.column) {
                    return widget;
                }
                if (this.__widgets.length > 0 && this.__widgets.length % this.__options.column === 0) {
                    this.__contentElement.appendChild($('<span class="fui-column"></span>')[0]);
                }
                $(widget.getElement()).addClass(CONF.classPrefix + "panel-column-widget");
                return widget;
            },
            appendWidgets: function(widgetArray) {
                var _self = this, widgets = widgetArray;
                if (!$.isArray(widgetArray)) {
                    widgets = arguments;
                }
                $.each(widgets, function(i, widget) {
                    _self.appendWidget(widget);
                });
                return this;
            },
            // TODO insertWidget时， 如果columnu为指定的数字，那么该插入需要调整换行符，现在还未对这个逻辑做处理。
            insertWidget: function(index, widget) {
                var oldElement = null;
                if (this.__widgets.length === 0) {
                    return this.appendWidget(widget);
                }
                if (!this.__valid(widget)) {
                    return null;
                }
                if (this.__options.disabled) {
                    widget.disable();
                }
                oldElement = this.__widgets[index];
                this.__widgets.splice(index, 0, widget);
                this.__contentElement.insertBefore(widget.getElement(), oldElement.getElement());
                if (this.__options.column === false) {
                    return widget;
                }
                this.__contentElement.insertBefore($('<span class="fui-column"></span>')[0], oldElement.getElement());
                $(widget.getElement()).addClass(CONF.classPrefix + "panel-column-widget");
                return widget;
            },
            insertWidgets: function(index, widgetArray) {
                var _self = this, widgets = widgetArray;
                if (!$.isArray(widgetArray)) {
                    widgets = [].slice.call(arguments, 1);
                }
                $.each(widgets, function(i, widget) {
                    _self.insertWidget(index, widget);
                    index++;
                });
                return this;
            },
            getContentElement: function() {
                return this.__contentElement;
            },
            removeWidget: function(widget) {
                if (typeof widget === "number") {
                    widget = this.__widgets.splice(widget, 1)[0];
                } else {
                    this.__widgets.splice(this.indexOf(widget), 1);
                }
                this.__contentElement.removeChild(widget.getElement());
                $(widget.getElement()).removeClass(CONF.classPrefix + "panel-column-widget");
                return widget;
            },
            __initOptions: function() {
                this.widgetName = "Container";
                this.__widgets = [];
                this.__contentElement = null;
                this.__options.column -= 0;
            },
            __render: function() {
                this.callBase();
                this.__contentElement = this.__element;
                $(this.__element).addClass(CONF.classPrefix + "container");
                if (this.__options.column) {
                    $(this.__element).addClass(CONF.classPrefix + "container-column");
                }
                return this;
            },
            // Override
            __appendChild: function(childWidget) {
                return this.appendWidget(childWidget);
            },
            __initWidgets: function() {
                if (!this.__options.widgets) {
                    return;
                }
                var widgets = Creator.parse(this.__options.widgets), _self = this;
                if (!$.isArray(widgets)) {
                    widgets = [ widgets ];
                }
                $.each(widgets, function(i, widget) {
                    _self.appendWidget(widget);
                });
            },
            /**
         * 验证元素给定元素是否可以插入当前容器中
         * @param ele 需要验证的元素
         * @returns {boolean} 允许插入返回true, 否则返回false
         * @private
         */
            __valid: function(ele) {
                return ele instanceof Widget;
            }
        });
    }
};

//src/widget/dialog.js
/**
 * 容器类： PPanel = Positioning Panel
 */
_p[41] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), Widget = _p.r(63), Mask = _p.r(50), tpl = _p.r(22), Button = _p.r(38), LAYOUT = CONF.layout, $ = _p.r(4), ACTION = {
            CANCEL: "cancel",
            OK: "ok"
        };
        return Utils.createClass("Dialog", {
            base: _p.r(55),
            constructor: function(options) {
                var defaultOptions = {
                    layout: LAYOUT.CENTER,
                    caption: null,
                    resize: "height",
                    draggable: true,
                    // 是否包含close button
                    closeButton: true,
                    mask: {
                        color: "#000",
                        opacity: .2
                    },
                    prompt: false,
                    // 底部按钮
                    buttons: [ {
                        className: CONF.classPrefix + "xdialog-ok-btn",
                        action: "ok",
                        label: "确定"
                    }, {
                        className: CONF.classPrefix + "xdialog-cancel-btn",
                        action: "cancel",
                        label: "取消"
                    } ]
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            open: function() {
                this.__fire("open", function() {
                    this.show();
                });
                return this;
            },
            close: function() {
                this.__fire("close", function() {
                    this.hide();
                });
                return this;
            },
            getButtons: function() {
                return this.__buttons;
            },
            getButton: function(index) {
                return this.__buttons[index];
            },
            appendTo: function(container) {
                this.callBase(container);
                this.__maskWidget.appendTo(container);
                this.__inDoc = true;
                return this;
            },
            show: function() {
                if (!this.__target) {
                    this.__target = this.__element.ownerDocument.body;
                }
                if (!this.__inDoc) {
                    this.appendTo(this.__element.ownerDocument.body);
                }
                this.__maskWidget.show();
                this.callBase();
                this.__openState = true;
                return this;
            },
            hide: function() {
                this.callBase();
                this.__maskWidget.hide();
                this.__openState = false;
                return this;
            },
            toggle: function() {
                this.isOpen() ? this.close() : this.open();
                return this;
            },
            isOpen: function() {
                return this.__openState;
            },
            getHeadElement: function() {
                return this.__headElement;
            },
            getBodyElement: function() {
                return this.getContentElement();
            },
            getFootElement: function() {
                return this.__footElement;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Dialog";
                this.__target = this.__options.target;
                this.__layout = this.__options.layout;
                this.__inDoc = false;
                this.__hinting = false;
                this.__openState = false;
                this.__headElement = null;
                this.__bodyElement = null;
                this.__footElement = null;
                this.__maskWidget = null;
                this.__buttons = [];
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
            },
            __render: function() {
                this.callBase();
                this.__innerTpl = Utils.Tpl.compile(tpl, this.__options);
                this.__contentElement.appendChild($(this.__innerTpl)[0]);
                $(this.__element).addClass(CONF.classPrefix + "dialog");
                this.__headElement = $(".fui-dialog-head", this.__contentElement)[0];
                this.__bodyElement = $(".fui-dialog-body", this.__contentElement)[0];
                this.__footElement = $(".fui-dialog-foot", this.__contentElement)[0];
                this.__maskWidget = new Mask(this.__options.mask);
                this.__contentElement = this.__bodyElement;
                if (this.__options.draggable) {
                    this.__initDraggable();
                }
                if (this.__options.closeButton) {
                    this.__initCloseButton();
                }
                this.__initButtons();
                this.__initMaskLint();
            },
            __action: function(type, btn) {
                switch (type) {
                  case ACTION.OK:
                    if (this.__triggerHandler(type) !== false) {
                        this.close();
                    }
                    break;

                  case ACTION.CANCEL:
                    this.__triggerHandler(type);
                    this.close();
                    break;
                }
            },
            __initButtons: function() {
                var _self = this, button = null, foot = this.__footElement;
                $.each(this.__options.buttons, function(index, buttonOption) {
                    button = new Button(buttonOption);
                    button.appendTo(foot);
                    _self.__buttons.push(button);
                });
            },
            __initEvent: function() {
                var _self = this;
                this.callBase();
                $([ this.__footElement, this.__headElement ]).on("btnclick", function(e, btn) {
                    _self.__action(btn.getOptions().action, btn);
                });
                if (this.__options.prompt) {
                    $(this.__element).on("keydown", function(e) {
                        switch (e.keyCode) {
                          case 13:
                            _self.__action(ACTION.OK);
                            break;

                          case 27:
                            _self.__action(ACTION.CANCEL);
                            break;
                        }
                    });
                }
            },
            __initDraggable: function() {
                Utils.createDraggable({
                    handler: this.__headElement,
                    target: this.__element
                }).bind();
            },
            __initCloseButton: function() {
                var closeButton = new Button({
                    className: "fui-close-button",
                    action: "cancel",
                    icon: {
                        className: "fui-close-button-icon"
                    }
                });
                closeButton.appendTo(this.__headElement);
            },
            __initMaskLint: function() {
                var _self = this;
                this.__maskWidget.on("click", function() {
                    _self.__hint();
                });
            },
            __hint: function() {
                if (this.__hinting) {
                    return;
                }
                this.__hinting = true;
                var $ele = $(this.__element), _self = this, classNmae = [ CONF.classPrefix + "mask-hint", CONF.classPrefix + "mask-animate" ];
                $ele.addClass(classNmae.join(" "));
                window.setTimeout(function() {
                    $ele.removeClass(classNmae[0]);
                    window.setTimeout(function() {
                        $ele.removeClass(classNmae[1]);
                        _self.__hinting = false;
                    }, 200);
                }, 200);
            }
        });
    }
};

//src/widget/drop-panel.js
/**
 * DropPanel对象
 * 可接受输入的按钮构件
 */
_p[42] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(23), Button = _p.r(38), Panel = _p.r(52), PPanel = _p.r(55), Mask = _p.r(50);
        return _p.r(13).createClass("DropPanel", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    button: null,
                    panel: null,
                    width: null,
                    height: null
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            disable: function() {
                this.callBase();
            },
            enable: function() {
                this.callBase();
            },
            open: function() {
                this.__popupWidget.appendWidget(this.__panelWidget);
                this.__maskWidget.show();
                this.__popupWidget.show();
                var $popup = $(this.__popupWidget.getElement());
                $popup.css("top", parseInt($popup.css("top")) - $(this.__element).outerHeight());
                $popup.css("min-width", $(this.__element).outerWidth());
                $popup.css("min-height", $(this.__element).height());
            },
            close: function() {
                this.__maskWidget.hide();
                this.__popupWidget.hide();
                this.__panelWidget.appendTo(this.__contentElement);
            },
            getPanelElement: function() {
                return this.__panelWidget.getElement();
            },
            appendWidget: function(widget) {
                this.__panelWidget.appendWidget(widget);
            },
            getWidgets: function() {
                return this.__panelWidget.getWidgets();
            },
            getWidget: function(index) {
                return this.__panelWidget.getWidget(index);
            },
            appendWidgets: function(widgets) {
                this.__panelWidget.appendWidgets.apply(this, arguments);
                return this;
            },
            insertWidget: function(index, widget) {
                this.__panelWidget.insertWidget(index, widget);
            },
            insertWidgets: function(index, widgets) {
                this.__panelWidget.insertWidgets.apply(this, arguments);
                return this;
            },
            removeWidget: function(widget) {
                return this.__panelWidget.removeWidget(widget);
            },
            __render: function() {
                this.__initOptions();
                this.__buttonWidget = new Button(this.__options.button);
                this.__panelWidget = new Panel(this.__options.content);
                this.__popupWidget = new PPanel();
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__popupWidget.positionTo(this.__element);
                $(this.__popupWidget.getElement()).addClass(CONF.classPrefix + "drop-panel-popup");
                // 初始化content
                var $content = $('<div class="' + CONF.classPrefix + 'drop-panel-content"></div>').append(this.__panelWidget.getElement());
                this.__contentElement = $content[0];
                // 插入按钮到element
                $(this.__element).append($content).append(this.__buttonWidget.getElement());
                this.__initDropPanelEvent();
            },
            __initOptions: function() {
                this.widgetName = "DropPanel";
                this.__tpl = tpl;
                this.__buttonWidget = null;
                this.__popupWidget = null;
                this.__panelWidget = null;
                this.__contentElement = null;
                this.__maskWidget = null;
                this.__popupState = false;
                if (typeof this.__options.button !== "object") {
                    this.__options.input = {
                        icon: this.__options.button
                    };
                }
            },
            __initDropPanelEvent: function() {
                var _self = this;
                this.__buttonWidget.on("click", function() {
                    if (!_self.__popupState) {
                        _self.__appendPopup();
                        _self.__popupState = true;
                    }
                    _self.trigger("buttonclick");
                    _self.open();
                });
                this.__panelWidget.on("click", function() {
                    _self.trigger("panelclick");
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
            },
            __appendPopup: function() {
                this.__popupWidget.appendTo(this.__element.ownerDocument.body);
            }
        });
    }
};

//src/widget/icon.js
/**
 * icon widget
 * 封装多种icon方式
 */
_p[43] = {
    value: function(require) {
        var $ = _p.r(4), iconTpl = _p.r(24);
        return _p.r(13).createClass("Icon", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    img: null
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__options.value || this.__options.img;
            },
            setImage: function(imageSrc) {
                if (this.__options.img === imageSrc) {
                    return this;
                }
                if (this.__image) {
                    this.__image.src = imageSrc;
                }
                this.trigger("iconchange", {
                    prevImage: this.__prevIcon,
                    currentImage: this.__currentIcon
                });
            },
            getImage: function() {
                return this.__currentIcon;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Icon";
                this.__tpl = iconTpl;
                this.__prevIcon = null;
                this.__currentIcon = this.__options.img;
                this.__image = null;
            },
            __render: function() {
                this.__options.__width = this.__options.width;
                this.__options.__height = this.__options.height;
                this.__options.width = null;
                this.__options.height = null;
                this.callBase();
                if (!this.__options.img) {
                    return;
                }
                this.__image = $("img", this.__element)[0];
                if (this.__options.__width !== null) {
                    this.__image.width = this.__options.__width;
                }
                if (this.__options.__height !== null) {
                    this.__image.height = this.__options.__height;
                }
            }
        });
    }
};

//src/widget/input-button.js
/**
 * InputButton对象
 * 可接受输入的按钮构件
 */
_p[44] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(25), Button = _p.r(38), Input = _p.r(46);
        return _p.r(13).createClass("InputButton", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    button: null,
                    input: null,
                    placeholder: null,
                    // label相对icon的位置
                    layout: "right"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__inputWidget.getValue();
            },
            setValue: function(value) {
                this.__inputWidget.setValue(value);
                return this;
            },
            reset: function() {
                this.__inputWidget.reset();
            },
            selectAll: function() {
                this.__inputWidget.selectAll();
                return this;
            },
            disable: function() {
                this.callBase();
                this.__inputWidget.disable();
            },
            enable: function() {
                this.callBase();
                this.__inputWidget.enable();
            },
            selectRange: function(start, end) {
                this.__inputWidget.selectRange(start, end);
                return this;
            },
            focus: function() {
                this.__inputWidget.focus();
                return this;
            },
            unfocus: function() {
                this.__inputWidget.unfocus();
                return this;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "InputButton";
                this.__tpl = tpl;
                this.__inputWidget = null;
                this.__buttonWidget = null;
                if (typeof this.__options.input !== "object") {
                    this.__options.input = {
                        placeholder: this.__options.input
                    };
                }
                this.__options.input = $.extend({}, this.__options.input, {
                    placeholder: this.__options.placeholder
                });
                if (typeof this.__options.button !== "object") {
                    this.__options.button = {
                        icon: this.__options.button
                    };
                }
            },
            __render: function() {
                var _self = this;
                this.callBase();
                this.__buttonWidget = new Button(this.__options.button);
                this.__inputWidget = new Input(this.__options.input);
                // layout
                switch (this.__options.layout) {
                  case "left":
                  /* falls through */
                    case "top":
                    this.__buttonWidget.appendTo(this.__element);
                    this.__inputWidget.appendTo(this.__element);
                    break;

                  case "right":
                  /* falls through */
                    case "bottom":
                  /* falls through */
                    default:
                    this.__inputWidget.appendTo(this.__element);
                    this.__buttonWidget.appendTo(this.__element);
                    break;
                }
                $(this.__element).addClass(CONF.classPrefix + "layout-" + this.__options.layout);
                this.__buttonWidget.on("click", function() {
                    _self.trigger("buttonclick");
                });
            }
        });
    }
};

//src/widget/input-menu.js
/**
 * InputMenu构件
 * 可接受输入的下拉菜单构件
 */
_p[45] = {
    value: function(require) {
        var $ = _p.r(4), tpl = _p.r(26), InputButton = _p.r(44), Menu = _p.r(51), Mask = _p.r(50);
        return _p.r(13).createClass("InputMenu", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    input: null,
                    menu: null,
                    mask: null,
                    selected: -1
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            select: function(index) {
                this.__menuWidget.select(index);
            },
            selectByValue: function(value) {
                return this.__selectBy("values", value + "");
            },
            selectByLabel: function(value) {
                return this.__selectBy("labels", value);
            },
            clearSelect: function() {
                this.__lastSelect = -1;
                this.__menuWidget.clearSelect();
                this.__inputWidget.reset();
                return this;
            },
            setValue: function(value) {
                return this;
            },
            getValue: function() {
                return this.__menuWidget.getSelectedItem().getValue();
            },
            open: function() {
                this.__maskWidget.show();
                this.__menuWidget.show();
                this.addClass("fui-opened");
            },
            close: function() {
                this.__maskWidget.hide();
                this.__menuWidget.hide();
                this.removeClass("fui-opened");
                this.__inputWidget.unfocus();
            },
            disable: function() {
                this.__inputWidget.disable();
                this.callBase();
            },
            enable: function() {
                this.__inputWidget.enable();
                this.callBase();
            },
            __render: function() {
                this.__inputWidget = new InputButton(this.__options.input);
                this.__menuWidget = new Menu(this.__options.menu);
                this.__maskWidget = new Mask(this.__options.mask);
                this.callBase();
                this.__inputWidget.appendTo(this.__element);
                this.__menuWidget.positionTo(this.__inputWidget);
                this.__initInputValue();
            },
            __selectBy: function(type, value) {
                var values = this.__getItemValues()[type], index = -1;
                $.each(values, function(i, val) {
                    if (value === val) {
                        index = i;
                        return false;
                    }
                });
                if (index !== -1) {
                    this.select(index);
                    return this.__menuWidget.getSelectedItem();
                }
                return null;
            },
            __initInputValue: function() {
                var selectedItem = this.__menuWidget.getItem(this.__options.selected);
                if (selectedItem) {
                    this.__inputWidget.setValue(selectedItem.getLabel());
                }
            },
            __initEvent: function() {
                var _self = this;
                this.callBase();
                this.on("buttonclick", function() {
                    if (!this.__menuState) {
                        this.__appendMenu();
                        this.__menuState = true;
                    }
                    this.__inputWidget.focus();
                    this.open();
                });
                this.on("keypress", function(e) {
                    this.__lastTime = new Date();
                });
                this.on("keyup", function(e) {
                    if (e.keyCode !== 8 && e.keyCode !== 13 && new Date() - this.__lastTime < 500) {
                        this.__update();
                    }
                });
                this.on("inputcomplete", function() {
                    this.__inputWidget.selectRange(99999999);
                    this.__inputComplete();
                });
                this.__menuWidget.on("select", function(e, info) {
                    e.stopPropagation();
                    _self.__inputWidget.setValue(info.label);
                    _self.trigger("select", info);
                    _self.close();
                });
                this.__menuWidget.on("menuitemclick", function(e, info) {
                    _self.trigger("itemclick", info);
                });
                this.__menuWidget.on("change", function(e, info) {
                    e.stopPropagation();
                    _self.trigger("change", info);
                });
                // 阻止input自身的select和change事件
                this.__inputWidget.on("select change", function(e) {
                    e.stopPropagation();
                });
                this.__inputWidget.on("inputfocus", function(e) {
                    e.stopPropagation();
                    if (!_self.__menuState) {
                        _self.__appendMenu();
                        _self.__menuState = true;
                    }
                    _self.open();
                });
                // mask 点击关闭
                this.__maskWidget.on("maskclick", function() {
                    _self.close();
                });
                // 记录最后选中的数据
                this.on("select", function(e, info) {
                    this.__lastSelect = info;
                });
            },
            // 更新输入框内容
            __update: function() {
                var inputValue = this.__inputWidget.getValue(), lowerCaseValue = inputValue.toLowerCase(), values = this.__getItemValues().labels, targetValue = null;
                if (!inputValue) {
                    return;
                }
                $.each(values, function(i, val) {
                    if (val.toLowerCase().indexOf(lowerCaseValue) === 0) {
                        targetValue = val;
                        return false;
                    }
                });
                if (targetValue) {
                    this.__inputWidget.setValue(targetValue);
                    this.__inputWidget.selectRange(inputValue.length);
                }
            },
            // 获取所有item的值列表
            __getItemValues: function() {
                var vals = [], labels = [];
                $.each(this.__menuWidget.getWidgets(), function(index, item) {
                    labels.push(item.getLabel());
                    vals.push(item.getValue());
                });
                return {
                    labels: labels,
                    values: vals
                };
            },
            // 用户输入完成
            __inputComplete: function() {
                var itemsInfo = this.__getItemValues(), labels = itemsInfo.labels, targetIndex = -1, inputValue = this.__inputWidget.getValue(), lastSelect = this.__lastSelect;
                $.each(labels, function(i, label) {
                    if (label === inputValue) {
                        targetIndex = i;
                        return false;
                    }
                });
                this.trigger("select", {
                    index: targetIndex,
                    label: inputValue,
                    value: itemsInfo.values[targetIndex]
                });
                if (!lastSelect || lastSelect.value !== inputValue) {
                    this.trigger("change", {
                        from: lastSelect || {
                            index: -1,
                            label: null,
                            value: null
                        },
                        to: {
                            index: targetIndex,
                            label: inputValue,
                            value: itemsInfo.values[targetIndex]
                        }
                    });
                }
            },
            __appendMenu: function() {
                this.__menuWidget.appendTo(this.__inputWidget.getElement().ownerDocument.body);
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "InputMenu";
                this.__tpl = tpl;
                // 最后输入时间
                this.__lastTime = 0;
                // 最后选中的记录
                this.__lastSelect = null;
                this.__inputWidget = null;
                this.__menuWidget = null;
                this.__maskWidget = null;
                // menu状态， 记录是否已经append到dom树上
                this.__menuState = false;
                if (this.__options.selected !== -1) {
                    this.__options.menu.selected = this.__options.selected;
                }
            }
        });
    }
};

//src/widget/input.js
/*jshint camelcase:false*/
/**
 * Input widget
 */
_p[46] = {
    value: function(require) {
        var CONF = _p.r(12), $ = _p.r(4), tpl = _p.r(27);
        return _p.r(13).createClass("Input", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    placeholder: null
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__element.value;
            },
            setValue: function(value) {
                this.__element.value = value;
                return this;
            },
            disable: function() {
                this.callBase();
                this.__element.disabled = true;
            },
            enable: function() {
                this.__element.disabled = false;
                this.callBase();
            },
            reset: function() {
                this.__element.value = this.__options.value || "";
                return this;
            },
            selectAll: function() {
                this.__element.select();
            },
            selectRange: function(startIndex, endIndex) {
                if (!startIndex) {
                    startIndex = 0;
                }
                if (!endIndex) {
                    endIndex = 1e9;
                }
                this.__element.setSelectionRange(startIndex, endIndex);
            },
            focus: function() {
                this.__element.focus();
                return this;
            },
            unfocus: function() {
                this.__element.blur();
                return this;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Input";
                this.__tpl = tpl;
                // input构件允许获得焦点
                this.__allow_focus = true;
            },
            __render: function() {
                this.callBase();
                this.__element.removeAttribute("unselectable");
                if (this.__options.placeholder) {
                    this.__element.setAttribute("placeholder", this.__options.placeholder);
                }
                this.addClass(CONF.classPrefix + "selectable");
            },
            __initEvent: function() {
                this.callBase();
                this.on("keydown", function(e) {
                    if (e.keyCode === 13) {
                        this.trigger("inputcomplete", {
                            value: this.getValue()
                        });
                    }
                });
                this.on("focus", function(e) {
                    this.trigger("inputfocus");
                });
            }
        });
    }
};

//src/widget/item.js
/**
 * Label Widget
 */
_p[47] = {
    value: function(require) {
        var Utils = _p.r(13), itemTpl = _p.r(28), Icon = _p.r(43), Label = _p.r(49), CONF = _p.r(12), $ = _p.r(4);
        return Utils.createClass("Item", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    label: "",
                    icon: null,
                    selected: false,
                    textAlign: "left"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__options.value || this.__labelWidget.getValue() || this.__iconWidget.getValue() || null;
            },
            select: function() {
                this.__update(true);
                return this;
            },
            unselect: function() {
                this.__update(false);
                return this;
            },
            isSelected: function() {
                return this.__selectState;
            },
            setLabel: function(text) {
                this.__labelWidget.setText(text);
                return this;
            },
            getLabel: function() {
                return this.__labelWidget.getText();
            },
            setIcon: function(imageSrc) {
                this.__iconWidget.setImage(imageSrc);
                return this;
            },
            getIcon: function() {
                return this.__iconWidget.getImage();
            },
            __render: function() {
                this.callBase();
                this.__iconWidget = new Icon(this.__options.icon);
                this.__labelWidget = new Label(this.__options.label);
                this.__iconWidget.appendTo(this.__element);
                this.__labelWidget.appendTo(this.__element);
            },
            __update: function(state) {
                var fn = state ? "addClass" : "removeClass";
                state = !!state;
                $(this.__element)[fn](CONF.classPrefix + "item-selected");
                this.__selectState = state;
                this.trigger(state ? "itemselect" : "itemunselect");
                return this;
            },
            __initEvent: function() {
                this.callBase();
                this.on("click", function() {
                    this.trigger("itemclick");
                });
            },
            /**
         * 初始化模板所用的css值
         * @private
         */
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Item";
                this.__tpl = itemTpl;
                this.__iconWidget = null;
                this.__labelWidget = null;
                this.__selectState = this.__options.selected;
                if (typeof this.__options.label !== "object") {
                    this.__options.label = {
                        text: this.__options.label
                    };
                }
                if (!this.__options.label.textAlign) {
                    this.__options.label.textAlign = this.__options.textAlign;
                }
                if (typeof this.__options.icon !== "object") {
                    this.__options.icon = {
                        img: this.__options.icon
                    };
                }
            }
        });
    }
};

//src/widget/label-panel.js
/**
 * LabelPanel Widget
 * 带标签的面板
 */
_p[48] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), Label = _p.r(49), $ = _p.r(4);
        return Utils.createClass("LabelPanel", {
            base: _p.r(52),
            constructor: function(options) {
                var defaultOptions = {
                    layout: "bottom"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            disable: function() {
                this.callBase();
                this.__labelWidget.disable();
            },
            enable: function() {
                this.callBase();
                this.__labelWidget.enable();
            },
            __render: function() {
                var $contentElement = null, opts = this.__options, ele = this.__element, classPrefix = CONF.classPrefix, labelClass = "fui-label-panel-content", originEle = null;
                this.__labelWidget = new Label(opts.label);
                this.callBase();
                originEle = this.__contentElement;
                $(ele).addClass(classPrefix + "label-panel");
                $(ele).addClass(classPrefix + "layout-" + opts.layout);
                $contentElement = $('<div class="' + labelClass + '"></div>');
                originEle.appendChild(this.__labelWidget.getElement());
                originEle.appendChild($contentElement[0]);
                // 更新contentElement
                this.__contentElement = $contentElement[0];
                return this;
            },
            __initOptions: function() {
                var label = this.__options.label;
                this.callBase();
                this.widgetName = "LabelPanel";
                this.__labelWidget = null;
                if (typeof label !== "object") {
                    this.__options.label = {
                        text: label
                    };
                }
                if (!this.__options.label.className) {
                    this.__options.label.className = "";
                }
                this.__options.label.className += " fui-label-panel-label";
            }
        });
    }
};

//src/widget/label.js
/**
 * Label Widget
 */
_p[49] = {
    value: function(require) {
        var Utils = _p.r(13), labelTpl = _p.r(29), $ = _p.r(4);
        return Utils.createClass("Label", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    text: "",
                    textAlign: "center"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__options.text;
            },
            setText: function(text) {
                var oldtext = this.__options.text;
                this.__options.text = text;
                $(this.__element).text(text);
                this.trigger("labelchange", {
                    currentText: text,
                    prevText: oldtext
                });
                return this;
            },
            getText: function() {
                return this.__options.text;
            },
            // label 禁用title显示
            __allowShowTitle: function() {
                return false;
            },
            /**
         * 初始化模板所用的css值
         * @private
         */
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Label";
                this.__tpl = labelTpl;
                this.__options.text = this.__options.text.toString();
            }
        });
    }
};

//src/widget/mask.js
/*jshint camelcase:false*/
/**
 * Mask Widget
 */
_p[50] = {
    value: function(require) {
        var Utils = _p.r(13), tpl = _p.r(30), Widget = _p.r(63), $ = _p.r(4), __cache_inited = false, __MASK_CACHE = [];
        var ZINDEX = 9999;
        return Utils.createClass("Mask", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    bgcolor: "#000",
                    opacity: 0,
                    inner: true,
                    target: null,
                    // 禁止mouse scroll事件
                    scroll: false,
                    hide: true
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            maskTo: function(target) {
                if (target) {
                    this.__target = target;
                }
                return this;
            },
            show: function() {
                var docNode = null;
                if (!this.__target) {
                    this.__target = this.__element.ownerDocument.body;
                }
                docNode = this.__target.ownerDocument.documentElement;
                // 如果节点未添加到dom树， 则自动添加到文档的body节点上
                if (!$.contains(docNode, this.__element)) {
                    this.appendTo(this.__target.ownerDocument.body);
                }
                this.setStyle("z-index", this.__getZIndex());
                this.callBase();
                this.__position();
                this.__resize();
                this.__hideState = false;
            },
            hide: function() {
                this.callBase();
                this.__hideState = true;
            },
            isHide: function() {
                return this.__hideState;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Mask";
                this.__tpl = tpl;
                this.__cacheId = __MASK_CACHE.length;
                this.__hideState = true;
                __MASK_CACHE.push(this);
                this.__target = this.__options.target;
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
            },
            __render: function() {
                this.callBase();
                this.__initMaskEvent();
                if (!__cache_inited) {
                    __cache_inited = true;
                    __initCacheEvent();
                }
            },
            __initMaskEvent: function() {
                this.on("mousewheel", function(e) {
                    var evt = e.originalEvent;
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("scroll", {
                        delta: evt.wheelDelta || evt.deltaY || evt.detail
                    });
                });
                this.on("click", function(e) {
                    e.stopPropagation();
                    if (e.target === this.__element) {
                        this.trigger("maskclick");
                    }
                });
            },
            __getZIndex: function() {
                ZINDEX++;
                return ZINDEX;
            },
            // 定位
            __resize: function() {
                var targetRect = null;
                // body特殊处理
                if (this.__targetIsBody()) {
                    targetRect = $(Utils.getView(this.__target));
                    targetRect = {
                        width: targetRect.width(),
                        height: targetRect.height()
                    };
                } else {
                    targetRect = Utils.getRect(this.__target);
                }
                this.__element.style.width = targetRect.width + "px";
                this.__element.style.height = targetRect.height + "px";
            },
            __position: function() {
                var location = null, targetRect = null;
                if (this.__targetIsBody()) {
                    location = {
                        top: 0,
                        left: 0
                    };
                } else {
                    targetRect = Utils.getRect(this.__target);
                    location = {
                        top: targetRect.top,
                        left: targetRect.left
                    };
                }
                $(this.__element).css("top", location.top + "px").css("left", location.left + "px");
            },
            __targetIsBody: function() {
                return this.__target.tagName.toLowerCase() === "body";
            }
        });
        // 全局监听
        function __initCacheEvent() {
            $(window).on("resize", function() {
                $.each(__MASK_CACHE, function(i, mask) {
                    if (mask && !mask.isHide()) {
                        mask.__resize();
                    }
                });
            });
        }
    }
};

//src/widget/menu.js
/**
 * Menu Widget
 */
_p[51] = {
    value: function(require) {
        var Utils = _p.r(13), Item = _p.r(47), CONF = _p.r(12), $ = _p.r(4);
        return Utils.createClass("Menu", {
            base: _p.r(55),
            constructor: function(options) {
                var defaultOptions = {
                    column: true,
                    selected: -1,
                    textAlign: "left",
                    items: []
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            select: function(index) {
                var item = this.__widgets[index];
                if (!item) {
                    return this;
                }
                this.__selectItem(item);
                return this;
            },
            clearSelect: function() {
                var selectedItem = this.getSelectedItem();
                if (selectedItem) {
                    selectedItem.unselect();
                }
                this.__currentSelect = -1;
                this.__prevSelect = -1;
            },
            getItems: function() {
                return this.getWidgets.apply(this, arguments);
            },
            getItem: function() {
                return this.getWidget.apply(this, arguments);
            },
            appendItem: function(item) {
                return this.appendWidget.apply(this, arguments);
            },
            insertItem: function(item) {
                return this.insertWidget.apply(this, arguments);
            },
            removeItem: function(item) {
                return this.removeWidget.apply(this, arguments);
            },
            clearItems: function() {
                while (this.getItems().length) {
                    this.removeItem(0);
                }
                return this;
            },
            getSelected: function() {
                return this.__currentSelect;
            },
            getSelectedItem: function() {
                return this.getItem(this.__currentSelect);
            },
            insertWidget: function(index, widget) {
                var returnValue = this.callBase(index, widget);
                if (returnValue === null) {
                    return returnValue;
                }
                if (index <= this.__currentSelect) {
                    this.__currentSelect++;
                }
                if (index <= this.__prevSelect) {
                    this.__prevSelect++;
                }
                return returnValue;
            },
            removeWidget: function(widget) {
                var index = widget;
                if (typeof index !== "number") {
                    index = this.indexOf(widget);
                }
                widget = this.callBase(widget);
                if (index === this.__currentSelect) {
                    this.__currentSelect = -1;
                } else if (index < this.__currentSelect) {
                    this.__currentSelect--;
                }
                if (index === this.__prevSelect) {
                    this.__prevSelect = -1;
                } else if (index < this.__prevSelect) {
                    this.__prevSelect--;
                }
                return widget;
            },
            __initOptions: function() {
                this.callBase();
                this.__prevSelect = -1;
                this.__currentSelect = this.__options.selected;
                this.widgetName = "Menu";
            },
            __render: function() {
                var _self = this, textAlign = this.__options.textAlign, selected = this.__options.selected;
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "menu");
                $.each(this.__options.items, function(index, itemOption) {
                    if (typeof itemOption !== "object") {
                        itemOption = {
                            label: itemOption
                        };
                    }
                    itemOption.selected = index === selected;
                    itemOption.textAlign = textAlign;
                    _self.appendItem(new Item(itemOption));
                });
            },
            // 初始化点击事件
            __initEvent: function() {
                this.callBase();
                this.on("itemclick", function(e) {
                    this.__selectItem(e.widget, true);
                });
            },
            __selectItem: function(item, isUserTrigger) {
                var info = null;
                if (this.__currentSelect > -1) {
                    this.__widgets[this.__currentSelect].unselect();
                }
                this.__prevSelect = this.__currentSelect;
                this.__currentSelect = this.indexOf(item);
                item.select();
                info = {
                    index: this.__currentSelect,
                    label: item.getLabel(),
                    value: item.getValue()
                };
                if (isUserTrigger) {
                    this.trigger("menuitemclick", info);
                }
                this.trigger("select", info);
                if (this.__prevSelect !== this.__currentSelect) {
                    var fromItem = this.__widgets[this.__prevSelect] || null;
                    this.trigger("change", {
                        from: {
                            index: this.__prevSelect,
                            label: fromItem && fromItem.getLabel(),
                            value: fromItem && fromItem.getValue()
                        },
                        to: {
                            index: this.__currentSelect,
                            label: item.getLabel(),
                            value: item.getValue()
                        }
                    });
                }
            },
            __valid: function(target) {
                return target instanceof Item;
            }
        });
    }
};

//src/widget/panel.js
/**
 * 容器类： Panel
 */
_p[52] = {
    value: function(require) {
        var Utils = _p.r(13), panelTpl = _p.r(31), $ = _p.r(4);
        return Utils.createClass("Panel", {
            base: _p.r(40),
            constructor: function(options) {
                var defaultOptions = {};
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            __render: function() {
                var $content = null;
                this.callBase();
                $content = $('<div class="fui-panel-content"></div>');
                this.__contentElement.appendChild($content[0]);
                this.__contentElement = $content[0];
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Panel";
                this.__tpl = panelTpl;
            }
        });
    }
};

//src/widget/popup-menu.js
_p[53] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), $ = _p.r(4), Menu = _p.r(51);
        return Utils.createClass("PopupMenu", {
            base: _p.r(54),
            constructor: function(options) {
                this.callBase($.extend({
                    menu: {}
                }, options));
            },
            getMenuWidget: function() {
                return this.__menuWidget;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "PopupMenu";
            },
            __render: function() {
                this.callBase();
                this.__menuWidget = new Menu();
                this.appendWidget(this.__menuWidget);
                $(this.__element).addClass(CONF.classPrefix + "popup-menu");
            }
        });
    }
};

//src/widget/popup.js
/**
 * 容器类： PPanel = Positioning Panel
 */
_p[54] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), Widget = _p.r(63), Mask = _p.r(50), $ = _p.r(4);
        return Utils.createClass("Popup", {
            base: _p.r(55),
            constructor: function(options) {
                var defaultOptions = {
                    mask: {}
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            open: function() {
                this.__fire("open", function() {
                    this.show();
                });
                return this;
            },
            close: function() {
                this.__fire("close", function() {
                    this.hide();
                });
                return this;
            },
            show: function() {
                if (!this.__target) {
                    this.__target = this.__element.ownerDocument.body;
                }
                if (!this.__inDoc) {
                    this.__inDoc = true;
                    this.appendTo(this.__element.ownerDocument.body);
                }
                this.__maskWidget.show();
                this.callBase();
                this.__openState = true;
                return this;
            },
            hide: function() {
                this.callBase();
                this.__maskWidget.hide();
                this.__openState = false;
                return this;
            },
            toggle: function() {
                this.isOpen() ? this.close() : this.open();
                return this;
            },
            isOpen: function() {
                return this.__openState;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Popup";
                this.__target = this.__options.target;
                this.__layout = this.__options.layout;
                this.__inDoc = false;
                this.__openState = false;
                this.__maskWidget = null;
                if (this.__target instanceof Widget) {
                    this.__target = this.__target.getElement();
                }
            },
            __render: function() {
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "popup");
                this.__maskWidget = new Mask(this.__options.mask);
                if (this.__options.draggable) {
                    this.__initDraggable();
                }
                this.__initMaskEvent();
            },
            __initMaskEvent: function() {
                var _self = this;
                this.__maskWidget.on("click", function() {
                    _self.close();
                });
            }
        });
    }
};

//src/widget/ppanel.js
/*jshint camelcase:false*/
/**
 * 容器类： PPanel = Positioning Panel
 */
_p[55] = {
    value: function(require) {
        var Utils = _p.r(13), CONF = _p.r(12), Widget = _p.r(63), LAYOUT = CONF.layout, $ = _p.r(4);
        var ZINDEX = 9999;
        return Utils.createClass("PPanel", {
            base: _p.r(52),
            constructor: function(options) {
                var defaultOptions = {
                    layout: LAYOUT.BOTTOM,
                    target: null,
                    // 边界容器
                    bound: null,
                    // 和边界之间的最小距离
                    diff: 10,
                    hide: true,
                    resize: "all",
                    iframe: false
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            positionTo: function(target, layout) {
                if (target instanceof Widget) {
                    target = target.getElement();
                }
                this.__target = target;
                if (layout) {
                    this.__layout = layout;
                }
                return this;
            },
            show: function() {
                var docNode = null;
                if (!this.__target) {
                    return this.callBase();
                }
                if (!this.__options.bound) {
                    this.__options.bound = this.__target.ownerDocument.body;
                }
                this.setStyle("z-index", this.__getZIndex());
                docNode = this.__target.ownerDocument.documentElement;
                if (!$.contains(docNode, this.__element)) {
                    this.__target.ownerDocument.body.appendChild(this.__element);
                }
                if ($.contains(docNode, this.__target)) {
                    this.callBase(Utils.getMarker());
                    this.__position();
                    this.__resize();
                }
                return this;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "PPanel";
                this.__target = this.__options.target;
                this.__layout = this.__options.layout;
                // 记录是否已调整过高度
                this.__height_resized = false;
            },
            __getZIndex: function() {
                ZINDEX += 2;
                return ZINDEX;
            },
            __render: function() {
                this.callBase();
                if (this.__options.iframe) {
                    $('<iframe class="fui-ppanel-cover" frameborder="0"></iframe>').appendTo(this.__element);
                }
                $(this.__element).addClass(CONF.classPrefix + "ppanel");
            },
            // 执行定位
            __position: function() {
                var location = null, className = CONF.classPrefix + "ppanel-position";
                $(this.__element).addClass(className);
                location = this.__getLocation();
                $(this.__element).css("top", location.top + "px").css("left", location.left + "px");
            },
            __resize: function() {
                var targetRect = Utils.getBound(this.__target);
                switch (this.__options.resize) {
                  case "all":
                    this.__resizeWidth(targetRect);
                    this.__resizeHeight();
                    break;

                  case "width":
                    this.__resizeWidth(targetRect);
                    break;

                  case "height":
                    this.__resizeHeight();
                    break;
                }
            },
            /**
         * 在未指定宽度的情况下，执行自动宽度适配。
         * 如果构件未被指定宽度， 则添加一个最小宽度， 该最小宽度等于给定目标的宽度
         * @param targetRect 传递该参数，是出于整体性能上的考虑。
         * @private
         */
            __resizeWidth: function(targetRect) {
                if (!this.__target) {
                    return;
                }
                var $ele = $(this.__element), w = $ele.outerWidth(), h = $ele.outerHeight(), minWidth = targetRect.width - w - h;
                this.__element.style.minWidth = minWidth + "px";
            },
            /**
         * 调整panel高度，使其不超过边界范围，如果已设置高度， 则不进行调整
         * @private
         */
            __resizeHeight: function() {
                var boundRect = null, panelRect = null, diff = 0;
                panelRect = Utils.getRect(this.__element);
                panelRect.height = this.__element.scrollHeight;
                panelRect.bottom = panelRect.top + panelRect.height;
                boundRect = this.__getBoundRect();
                diff = panelRect.bottom - boundRect.bottom;
                if (diff > 0) {
                    this.__height_resized = true;
                    diff = panelRect.height - diff - this.__options.diff;
                    $(this.__element).css("height", diff + "px");
                } else if (this.__height_resized) {
                    this.__element.style.height = null;
                }
            },
            __getLocation: function() {
                var targetRect = Utils.getBound(this.__target);
                switch (this.__layout) {
                  case LAYOUT.CENTER:
                  case LAYOUT.MIDDLE:
                    return this.__getCenterLayout(targetRect);

                  case LAYOUT.LEFT:
                  case LAYOUT.RIGHT:
                  case LAYOUT.BOTTOM:
                  case LAYOUT.TOP:
                    return this.__getOuterLayout(targetRect);

                  default:
                    return this.__getInnerLayout(targetRect);
                }
                return location;
            },
            /**
         * 居中定位的位置属性
         * @private
         */
            __getCenterLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, panelRect = Utils.getRect(this.__element), diff = 0;
                diff = targetRect.height - panelRect.height;
                if (diff > 0) {
                    location.top = targetRect.top + diff / 2;
                }
                diff = targetRect.width - panelRect.width;
                if (diff > 0) {
                    location.left = targetRect.left + diff / 2;
                }
                return location;
            },
            /**
         * 获取外部布局定位属性
         * @returns {{top: number, left: number}}
         * @private
         */
            __getOuterLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, panelRect = Utils.getRect(this.__element);
                switch (this.__layout) {
                  case LAYOUT.TOP:
                    location.left = targetRect.left;
                    location.top = targetRect.top - panelRect.height;
                    break;

                  case LAYOUT.LEFT:
                    location.top = targetRect.top;
                    location.left = targetRect.left - panelRect.width;
                    break;

                  case LAYOUT.RIGHT:
                    location.top = targetRect.top;
                    location.left = targetRect.right;
                    break;

                  case LAYOUT.BOTTOM:
                  /* falls through */
                    default:
                    location.left = targetRect.left;
                    location.top = targetRect.bottom;
                    break;
                }
                return location;
            },
            /**
         * 获取内部布局定位属性,并且，内部布局还拥有根据水平空间的大小，自动进行更新定位的功能
         * @private
         */
            __getInnerLayout: function(targetRect) {
                var location = {
                    top: 0,
                    left: 0
                }, rect = targetRect, panelRect = Utils.getRect(this.__element);
                switch (this.__layout) {
                  case LAYOUT.LEFT_TOP:
                    location.top = rect.top;
                    location.left = rect.left;
                    break;

                  case LAYOUT.RIGHT_TOP:
                    location.top = rect.top;
                    location.left = rect.left + rect.width - panelRect.width;
                    break;

                  case LAYOUT.LEFT_BOTTOM:
                    location.top = rect.top + rect.height - panelRect.height;
                    location.left = rect.left;
                    break;

                  case LAYOUT.RIGHT_BOTTOM:
                    location.top = rect.top + rect.height - panelRect.height;
                    location.left = rect.left + rect.width - panelRect.width;
                    break;
                }
                return this.__correctionLocation(location);
            },
            __getBoundRect: function() {
                var width = -1, height = -1, view = null;
                if (this.__options.bound.tagName.toLowerCase() === "body") {
                    view = Utils.getView(this.__options.bound);
                    width = $(view).width();
                    height = $(view).height();
                    return {
                        top: 0,
                        left: 0,
                        right: width,
                        bottom: height,
                        width: width,
                        height: height
                    };
                } else {
                    return Utils.getRect(this.__options.bound);
                }
            },
            // 如果发生“溢出”，则修正定位
            __correctionLocation: function(location) {
                var panelRect = Utils.getRect(this.__element), targetRect = Utils.getRect(this.__target), boundRect = this.__getBoundRect();
                switch (this.__layout) {
                  case LAYOUT.LEFT_TOP:
                  case LAYOUT.LEFT_BOTTOM:
                    if (location.left + panelRect.width > boundRect.right) {
                        location.left += targetRect.width - panelRect.width;
                    }
                    break;

                  case LAYOUT.RIGHT_TOP:
                  case LAYOUT.RIGHT_BOTTOM:
                    if (location.left < boundRect.left) {
                        location.left = targetRect.left;
                    }
                    break;
                }
                return location;
            }
        });
    }
};

//src/widget/select-menu.js
/**
 * SelectMenu构件
 * 提供从下拉菜单中选中某一项的功能构件
 */
_p[56] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), Panel = _p.r(52), PPanel = _p.r(55), Button = _p.r(38), Creator = _p.r(0), Mask = _p.r(50);
        return _p.r(13).createClass("SelectMenu", {
            base: Panel,
            constructor: function(options) {
                var defaultOptions = {
                    // bed 是Panel的实例
                    bed: {
                        className: "fui-select-menu-bed"
                    },
                    button: {
                        className: "fui-select-menu-btn"
                    },
                    events: [ "btnclick" ],
                    selected: -1
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            show: function() {
                this.__widgetMenu.show();
                this.__mask.show();
            },
            hide: function() {
                this.__widgetMenu.hide();
                this.__mask.hide();
            },
            getValue: function() {
                var selectedWidet = this.__widgets[this.__selected];
                return selectedWidet ? selectedWidet.getValue() : null;
            },
            getSelected: function() {
                return this.__widgets[this.__selected];
            },
            select: function(index) {
                var widget = this.__widgets[index], className = "fui-select-menu-selected", oldIndex = this.__selected, oldSelected = this.__widgets[this.__selected], bedElement = this.__bed.getElement();
                if (!widget) {
                    return this;
                }
                if (oldSelected) {
                    oldSelected.removeClass(className);
                }
                bedElement.innerHTML = "";
                bedElement.appendChild(widget.cloneElement());
                widget.addClass(className);
                this.__selected = index;
                this.trigger("select", {
                    index: index,
                    widget: widget
                });
                if (this.__selected !== oldIndex) {
                    this.trigger("change", {
                        from: {
                            index: oldIndex,
                            widget: oldSelected
                        },
                        to: {
                            index: index,
                            widget: widget
                        }
                    });
                }
                return this;
            },
            selectByWidget: function(widget) {
                return this.select(this.indexOf(widget));
            },
            selectByValue: function(value) {
                var index = -1;
                $.each(this.__widgets, function(i, widget) {
                    if (widget.getValue() === value) {
                        index = i;
                        return false;
                    }
                });
                return this.select(index);
            },
            __render: function() {
                this.__bed = new Panel(this.__options.bed);
                this.__dropBtn = new Button(this.__options.button);
                this.__widgetMenu = new PPanel({
                    className: "fui-select-menu-container",
                    layout: CONF.layout.LEFT_TOP,
                    column: this.__column
                });
                this.__mask = new Mask();
                var widgets = this.__initWidgets();
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "select-menu");
                this.appendWidgets([ this.__bed, this.__dropBtn, this.__mask, this.__widgetMenu ]);
                this.__widgets = [];
                this.__oldContentElement = this.__contentElement;
                this.__contentElement = this.__widgetMenu;
                this.appendWidgets(widgets);
                this.__widgetMenu.positionTo(this.getElement());
                if (!$.isNumeric(this.__options.selected)) {
                    this.__bed.appendWidget(Creator.parse(this.__options.selected));
                } else if (this.__options.selected != -1) {
                    this.select(this.__options.selected);
                }
            },
            __initWidgets: function() {
                var widgets = [];
                if (!this.__options.widgets) {
                    return;
                }
                $.each(this.__options.widgets, function(index, widget) {
                    widgets.push(Creator.parse(widget));
                });
                return widgets;
            },
            __initEvent: function() {
                this.callBase();
                var _self = this;
                this.__dropBtn.on("btnclick", function() {
                    _self.show();
                });
                this.__mask.on("click", function() {
                    _self.hide();
                });
                this.__widgetMenu.on(this.__options.events.join(" "), function(e) {
                    var target = e.target;
                    if (target === _self.__oldContentElement || target === _self.getElement) {
                        return;
                    }
                    e.stopPropagation();
                    _self.selectByWidget(e.widget);
                    _self.hide();
                    return false;
                });
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "SelectMenu";
                // 被选中的元素
                this.__bed = null;
                // 下拉按钮
                this.__dropBtn = null;
                this.__widgetMenu = null;
                this.__mask = null;
                this.__widgets = [];
                this.__selected = -1;
                this.__oldContentElement = null;
                this.__column = this.__options.column;
                delete this.__options.column;
            }
        });
    }
};

//src/widget/select.js
/**
 * SelectMenu构件
 * 提供从下拉菜单中选中某一项的功能构件
 */
_p[57] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), Panel = _p.r(52), PPanel = _p.r(55), Creator = _p.r(0), Icon = _p.r(43), Mask = _p.r(50);
        return _p.r(13).createClass("Select", {
            base: Panel,
            constructor: function(options) {
                var defaultOptions = {
                    // bed 是Panel的实例
                    bed: {
                        className: "fui-select-bed"
                    },
                    icon: {
                        className: "fui-select-open"
                    },
                    events: [ "itemclick click" ],
                    selected: -1
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            show: function() {
                this.__widgetMenu.show();
                this.__mask.show();
                this.addClass("fui-opened");
            },
            hide: function() {
                this.__widgetMenu.hide();
                this.__mask.hide();
                this.removeClass("fui-opened");
            },
            getValue: function() {
                var selectedWidet = this.__widgets[this.__selected];
                return selectedWidet ? selectedWidet.getValue() : null;
            },
            getSelected: function() {
                return this.__widgets[this.__selected];
            },
            select: function(index) {
                var widget = this.__widgets[index], className = "fui-select-selected", oldIndex = this.__selected, oldSelected = this.__widgets[this.__selected], bedElement = this.__bed.getElement();
                if (!widget) {
                    return this;
                }
                if (oldSelected) {
                    oldSelected.removeClass(className);
                }
                bedElement.innerHTML = "";
                bedElement.appendChild(widget.cloneElement());
                widget.addClass(className);
                this.__selected = index;
                this.trigger("select", {
                    index: index,
                    widget: widget
                });
                if (this.__selected !== oldIndex) {
                    this.trigger("change", {
                        from: {
                            index: oldIndex,
                            widget: oldSelected
                        },
                        to: {
                            index: index,
                            widget: widget
                        }
                    });
                }
                return this;
            },
            selectByWidget: function(widget) {
                return this.select(this.indexOf(widget));
            },
            selectByValue: function(value) {
                var index = -1;
                $.each(this.__widgets, function(i, widget) {
                    if (widget.getValue() === value) {
                        index = i;
                        return false;
                    }
                });
                return this.select(index);
            },
            __render: function() {
                this.__bed = new Panel(this.__options.bed);
                this.__openIcon = new Icon(this.__options.icon);
                this.__widgetMenu = new PPanel({
                    className: "fui-select-container",
                    layout: CONF.layout.BOTTOM,
                    column: this.__column
                });
                this.__mask = new Mask();
                var widgets = this.__initWidgets();
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "select");
                this.appendWidgets([ this.__bed, this.__openIcon, this.__mask, this.__widgetMenu ]);
                this.__widgets = [];
                this.__oldContentElement = this.__contentElement;
                this.__contentElement = this.__widgetMenu;
                this.appendWidgets(widgets);
                this.__widgetMenu.positionTo(this.getElement());
                if (!$.isNumeric(this.__options.selected)) {
                    this.__bed.appendWidget(Creator.parse(this.__options.selected));
                } else if (this.__options.selected != -1) {
                    this.select(this.__options.selected);
                }
            },
            __initWidgets: function() {
                var widgets = [];
                if (!this.__options.widgets) {
                    return;
                }
                $.each(this.__options.widgets, function(index, widget) {
                    widgets.push(Creator.parse(widget));
                });
                return widgets;
            },
            __initEvent: function() {
                this.callBase();
                var _self = this;
                this.on("click", function() {
                    _self.show();
                });
                this.__mask.on("click", function() {
                    _self.hide();
                });
                this.__widgetMenu.on(this.__options.events.join(" "), function(e) {
                    var target = e.target;
                    if (target === _self.__oldContentElement || target === _self.getElement) {
                        return;
                    }
                    e.stopPropagation();
                    _self.selectByWidget(e.widget);
                    _self.hide();
                    return false;
                });
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Select";
                // 被选中的元素
                this.__bed = null;
                // 下拉按钮
                this.__openIcon = null;
                this.__widgetMenu = null;
                this.__mask = null;
                this.__widgets = [];
                this.__selected = -1;
                this.__oldContentElement = null;
                this.__column = this.__options.column;
                delete this.__options.column;
            }
        });
    }
};

//src/widget/separator.js
/**
 * Separator(分隔符) Widget
 */
_p[58] = {
    value: function(require) {
        var Utils = _p.r(13), separatorTpl = _p.r(32), $ = _p.r(4);
        return Utils.createClass("Separator", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    width: 1,
                    height: "100%",
                    bgcolor: "#e1e1e1"
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Separator";
                this.__tpl = separatorTpl;
            }
        });
    }
};

//src/widget/spin-button.js
/**
 * SpinButton对象
 * 数值按钮构件
 */
_p[59] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(33), Button = _p.r(38), Input = _p.r(46), Panel = _p.r(52);
        return _p.r(13).createClass("SpinButton", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    suffix: null,
                    selected: -1,
                    items: []
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getValue: function() {
                return this.__options.items[this.__currentSelected] || null;
            },
            // Overload
            setValue: function(value) {},
            select: function(index) {
                this.__update(index);
            },
            // 根据值进行选择
            selectByValue: function(value) {
                value = value + "";
                this.__update($.inArray(value, this.__options.items));
            },
            __render: function() {
                this.callBase();
                this.__buttons = [ new Button({
                    className: CONF.classPrefix + "spin-up-btn"
                }), new Button({
                    className: CONF.classPrefix + "spin-down-btn"
                }) ];
                this.__inputWidget = new Input();
                this.__panelWidget = new Panel({
                    column: true
                });
                this.__inputWidget.appendTo(this.__element);
                this.__panelWidget.appendWidget(this.__buttons[0]);
                this.__panelWidget.appendWidget(this.__buttons[1]);
                this.__panelWidget.appendTo(this.__element);
                this.__initSelected(this.__options.selected);
            },
            __initEvent: function() {
                var _self = this;
                this.callBase();
                this.__buttons[0].on("btnclick", function() {
                    _self.__update(_self.__currentSelected - 1);
                });
                this.__buttons[1].on("btnclick", function() {
                    _self.__update(_self.__currentSelected + 1);
                });
            },
            __initSelected: function(index) {
                this.__update(index, false);
            },
            __update: function(index, isTrigger) {
                var oldIndex = -1, value = null, toValue = null;
                if (index < 0 || index >= this.__options.items.length) {
                    return;
                }
                oldIndex = this.__currentSelected;
                this.__currentSelected = index;
                toValue = this.__options.items[this.__currentSelected];
                value = toValue + " " + (this.__options.suffix || "");
                this.__inputWidget.setValue(value);
                if (isTrigger !== false) {
                    this.trigger("change", {
                        from: this.__options.items[oldIndex] || null,
                        to: toValue
                    });
                }
            },
            __initOptions: function() {
                var items = this.__options.items;
                this.callBase();
                this.widgetName = "SpinButton";
                this.__tpl = tpl;
                this.__buttons = [];
                this.__panelWidget = null;
                this.__inputWidget = null;
                this.__currentSelected = -1;
                $.each(items, function(index, val) {
                    items[index] = val + "";
                });
            }
        });
    }
};

//src/widget/sub-menu.js
_p[60] = {
    value: function(require) {
        var $ = _p.r(4), PPanel = _p.r(55), Creator = _p.r(0), Mask = _p.r(50);
        var Button = _p.r(38);
        return _p.r(13).createClass("SubMenu", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    button: {},
                    panel: {}
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            __render: function() {
                this.__widgets = this.__createWidgets();
                this.callBase();
                this.getElement().appendChild(this.button.getElement());
                this.panel.appendWidgets(this.__widgets);
                this.panel.positionTo(this.button.getElement());
                this.addClass("fui-sub-menu");
                this.button.addClass("fui-sub-menu-button");
                this.panel.addClass("fui-sub-menu-panel");
            },
            __createWidgets: function() {
                var widgets = [];
                if (!this.__options.widgets) {
                    return;
                }
                $.each(this.__options.widgets, function(index, widget) {
                    widgets.push(Creator.parse(widget));
                });
                return widgets;
            },
            getPanel: function() {
                return this.panel;
            },
            open: function() {
                this.panel.show();
                this.mask.show();
                this.addClass("fui-opened");
            },
            close: function() {
                this.panel.hide();
                this.mask.hide();
                this.removeClass("fui-opened");
            },
            __initEvent: function() {
                this.callBase();
                var _self = this;
                this.button.on("click", function() {
                    _self.open();
                });
                this.mask.on("click", function() {
                    _self.close();
                });
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "SubMenu";
                this.__tpl = "<div></div>";
                // 被选中的元素
                this.button = new Button(this.__options.button);
                this.panel = new PPanel(this.__options.panel);
                this.mask = new Mask();
            }
        });
    }
};

//src/widget/tabs.js
/**
 * Tabs Widget
 */
_p[61] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12), tpl = _p.r(34), Button = _p.r(38), Panel = _p.r(52);
        return _p.r(13).createClass("Tabs", {
            base: _p.r(63),
            constructor: function(options) {
                var defaultOptions = {
                    selected: 0,
                    buttons: [],
                    panels: []
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            getButtons: function() {
                return this.__btns;
            },
            getButton: function(index) {
                return this.getButtons()[index] || null;
            },
            getButtonByValue: function(value) {
                var button = null;
                $.each(this.__btns, function(i, btn) {
                    if (btn.getValue() === value) {
                        button = btn;
                        return false;
                    }
                });
                return button;
            },
            getPanels: function() {
                return this.__panels;
            },
            getPanel: function(index) {
                return this.getPanels()[index] || null;
            },
            getPanelByValue: function(value) {
                var panel = null;
                $.each(this.__panels, function(i, pan) {
                    if (pan.getValue() === value) {
                        panel = pan;
                        return false;
                    }
                });
                return panel;
            },
            getSelectedIndex: function() {
                return this.__selected;
            },
            getSelected: function() {
                var index = this.getSelectedIndex();
                return {
                    button: this.getButton(index),
                    panel: this.getPanel(index)
                };
            },
            appendTab: function(tabOpt) {
                tabOpt.panels = tabOpt.panels || [];
                return this.__renderByOptions(tabOpt);
            },
            removeTab: function(index) {
                if (index < 0) {
                    return null;
                }
                var btn = this.__btns.splice(index, 1), panel = this.__panels.splice(index, 1);
                if (!btn.length) {
                    return null;
                }
                btn = btn[0];
                panel = panel[0];
                btn.remove();
                panel.remove();
                return {
                    button: btn,
                    panel: panel
                };
            },
            /**
         * 选择接口
         * @param index 需要选中的tab页索引
         */
            select: function(index) {
                var toInfo = null;
                if (!this.__selectItem(index)) {
                    return this;
                }
                toInfo = this.__getInfo(index);
                this.trigger("tabsselect", toInfo);
                if (this.__prevSelected !== this.__selected) {
                    this.trigger("tabschange", {
                        from: this.__getInfo(this.__prevSelected),
                        to: toInfo
                    });
                }
                return this;
            },
            getIndexByButton: function(btn) {
                return $.inArray(btn, this.__btns);
            },
            /**
         * 把所有button追加到其他容器中
         */
            appendButtonTo: function(container) {
                $.each(this.__btns, function(index, btn) {
                    btn.appendTo(container);
                });
            },
            appendPanelTo: function(container) {
                $.each(this.__panels, function(index, panel) {
                    panel.appendTo(container);
                });
            },
            __render: function() {
                this.callBase();
                this.__btnWrap = $(".fui-tabs-button-wrap", this.__element)[0];
                this.__panelWrap = $(".fui-tabs-panel-wrap", this.__element)[0];
                this.__renderByOptions(this.__options);
                this.__selectItem(this.__options.selected);
            },
            __renderByOptions: function(options) {
                var _self = this, mapping = [], btns = this.__btns, panels = this.__panels, btnWrap = this.__btnWrap, panelWrap = this.__panelWrap;
                $.each(options.buttons, function(index, opt) {
                    var btn = null, panel = null;
                    if (typeof opt !== "object") {
                        opt = {
                            label: opt
                        };
                    }
                    btn = new Button(opt);
                    btn.on("click", function() {
                        _self.select(_self.getIndexByButton(this));
                    });
                    opt = options.panels[index] || {};
                    opt.hide = true;
                    panel = new Panel(opt);
                    btns.push(btn);
                    panels.push(panel);
                    mapping.push({
                        button: btn,
                        panel: panel
                    });
                    btn.appendTo(btnWrap);
                    panel.appendTo(panelWrap);
                });
                return mapping;
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "Tabs";
                this.__tpl = tpl;
                this.__btns = [];
                this.__panels = [];
                this.__prevSelected = -1;
                this.__selected = -1;
                this.__btnWrap = null;
                this.__panelWrap = null;
                // panels不设置的情况下， 将根据button创建
                if (this.__options.panels === null) {
                    this.__options.panels = [];
                    this.__options.panels.length = this.__options.buttons.length;
                }
            },
            __selectItem: function(index) {
                var btn = this.getButton(index), prevBtn = this.getButton(this.__selected), className = CONF.classPrefix + "selected";
                if (!btn) {
                    return false;
                }
                if (prevBtn) {
                    prevBtn.removeClass(className);
                    this.getPanel(this.__selected).hide();
                }
                btn.addClass(className);
                this.getPanel(index).show();
                this.__prevSelected = this.__selected;
                this.__selected = index;
                return true;
            },
            // 根据给定的tab索引获取先关的信息， 这些信息将用于事件携带的参数
            __getInfo: function(index) {
                return {
                    index: index,
                    button: this.getButton(index),
                    panel: this.getPanel(index)
                };
            }
        });
    }
};

//src/widget/toggle-button.js
/**
 * ToggleButton对象
 * 可切换按钮构件
 */
_p[62] = {
    value: function(require) {
        var $ = _p.r(4), CONF = _p.r(12);
        return _p.r(13).createClass("ToggleButton", {
            base: _p.r(38),
            constructor: function(options) {
                var defaultOptions = {
                    // 按钮初始时是否按下
                    pressed: false
                };
                options = $.extend({}, defaultOptions, options);
                this.callBase(options);
            },
            /**
         * 当前按钮是否已按下
         */
            isPressed: function() {
                return this.__state;
            },
            /**
         * 按下按钮
         */
            press: function() {
                var className = CONF.classPrefix + "button-pressed";
                $(this.__element).addClass(className);
                this.__updateState(true);
            },
            /**
         * 弹起按钮
         */
            bounce: function() {
                var className = CONF.classPrefix + "button-pressed";
                $(this.__element).removeClass(className);
                this.__updateState(false);
            },
            toggle: function() {
                if (this.__state) {
                    this.bounce();
                } else {
                    this.press();
                }
            },
            __initOptions: function() {
                this.callBase();
                this.widgetName = "ToggleButton";
                // 按钮当前状态
                this.__state = false;
            },
            __render: function() {
                this.callBase();
                $(this.__element).addClass(CONF.classPrefix + "toggle-button");
                this.__initButtonState();
                return this;
            },
            __initButtonState: function() {
                if (!this.__options.pressed) {
                    return;
                }
                // 不直接调用press方法， 防止初始化时事件的触发
                $(this.__element).addClass(CONF.classPrefix + "button-pressed");
                this.__state = true;
            },
            /**
         * 初始化事件监听, 控制状态的切换
         * @private
         */
            __initEvent: function() {
                this.callBase();
                this.on("click", function() {
                    this.toggle();
                });
            },
            __updateState: function(state) {
                state = !!state;
                this.__state = state;
                this.trigger("change", state, !state);
            }
        });
    }
};

//src/widget/widget.js
/*jshint camelcase:false*/
/**
 * widget对象
 * 所有的UI组件都是widget对象
 */
_p[63] = {
    value: function(require) {
        var prefix = "_fui_", uid = 0, CONF = _p.r(12), FUI_NS = _p.r(11), $ = _p.r(4), Utils = _p.r(13);
        var Widget = _p.r(13).createClass("Widget", {
            constructor: function(options) {
                var defaultOptions = {
                    id: null,
                    className: "",
                    disabled: false,
                    preventDefault: false,
                    text: "",
                    value: null,
                    hide: false,
                    width: null,
                    height: null
                };
                this.__widgetType = "widget";
                this.__tpl = "";
                this.__compiledTpl = "";
                this.__options = {};
                this.__element = null;
                // 禁止获取焦点
                this.__allow_focus = !!CONF.allowFocus;
                this.widgetName = "Widget";
                this.__extendOptions(defaultOptions, options);
                this.__initOptions();
                this.__render();
                this.__initEvent();
                this.__initWidgets && this.__initWidgets();
            },
            getId: function() {
                return this.id;
            },
            getValue: function() {
                return this.__options.value;
            },
            getOptions: function() {
                return this.__options;
            },
            setValue: function(value) {
                this.__options.value = value;
                return this;
            },
            show: function() {
                this.__show();
                return this;
            },
            hide: function() {
                this.__hide();
                return this;
            },
            addClass: function(className) {
                $(this.__element).addClass(className);
                return this;
            },
            removeClass: function(className) {
                $(this.__element).removeClass(className);
                return this;
            },
            setStyle: function() {
                $.fn.css.apply($(this.__element), arguments);
                return this;
            },
            getStyle: function() {
                return $.fn.css.apply($(this.__element), arguments);
            },
            /**
         * 当前构件是否是处于禁用状态
         * @returns {boolean|disabled|jsl.$.disabled|id.disabled}
         */
            isDisabled: function() {
                return this.__options.disabled;
            },
            /**
         * 启用当前构件
         * @returns {Widget}
         */
            enable: function() {
                this.__options.disabled = false;
                $(this.__element).removeClass(CONF.classPrefix + "disabled");
                return this;
            },
            /**
         * 禁用当前构件
         * @returns {Widget}
         */
            disable: function() {
                this.__options.disabled = true;
                $(this.__element).addClass(CONF.classPrefix + "disabled");
                return this;
            },
            cloneElement: function() {
                return this.__element.cloneNode(true);
            },
            /**
         * 获取
         * @returns {null}
         */
            getElement: function() {
                return this.__element;
            },
            appendTo: function(container) {
                if (Utils.isElement(container)) {
                    container.appendChild(this.__element);
                } else if (container instanceof Widget) {
                    container.__appendChild(this);
                } else {
                    throw new Error("TypeError: Widget.appendTo()");
                }
                return this;
            },
            remove: function() {
                var parent = this.__element.parentNode;
                if (parent) {
                    parent.removeChild(this.__element);
                }
                return this;
            },
            off: function(type, cb) {
                $(this.__element).off(cb && cb.__fui_listener);
                return this;
            },
            on: function(type, cb) {
                if (!this.__options.preventDefault) {
                    this.__on(type, cb);
                }
                return this;
            },
            __initOptions: function() {},
            /**
         * 根据模板渲染构件, 如果该构件已经渲染过, 则不会进行二次渲染
         * @returns {Widget}
         */
            __render: function() {
                var $ele = null, tpl = this.__tpl, opts = this.__options, className = null;
                this.id = this.__id();
                // 向NS注册自己
                FUI_NS.__registerInstance(this);
                this.__compiledTpl = Utils.Tpl.compile(tpl, opts);
                this.__element = $(this.__compiledTpl)[0];
                this.__element.setAttribute("id", this.id);
                $ele = $(this.__element);
                if (opts.disabled) {
                    $ele.addClass(CONF.classPrefix + "disabled");
                }
                $ele.addClass(CONF.classPrefix + "widget");
                // add custom class-name
                className = opts.className;
                if (className.length > 0) {
                    if ($.isArray(className)) {
                        $ele.addClass(className.join(" "));
                    } else {
                        $ele.addClass(className);
                    }
                }
                this.__initBasicEnv();
                if (opts.hide) {
                    this.__hide();
                }
                if (opts.style) {
                    this.setStyle(opts.style);
                }
                return this;
            },
            /**
         * 该方法将被appendTo调用， 用于根据各组件自身的规则插入节点,  子类可根据需要覆盖该方法
         * @param childWidget 将被追加的子构件对象
         */
            __appendChild: function(childWidget) {
                return this.__element.appendChild(childWidget.getElement());
            },
            __initEvent: function() {
                this.on("mousedown", function(e) {
                    var tagName = e.target.tagName.toLowerCase();
                    if (!CONF.control[tagName] && !this.__allowFocus()) {
                        e.preventDefault();
                    } else {
                        e.stopPropagation();
                    }
                });
            },
            __on: function(type, cb) {
                var _self = this;
                cb.__fui_listener = function(e, widget) {
                    var params = [];
                    for (var i = 0, len = arguments.length; i < len; i++) {
                        if (i !== 1) {
                            params.push(arguments[i]);
                        }
                    }
                    e.widget = widget;
                    if (!_self.isDisabled()) {
                        return cb.apply(_self, params);
                    }
                };
                $(this.__element).on(type, cb.__fui_listener);
                return this;
            },
            trigger: function(type, params) {
                if (!this.__options.preventDefault) {
                    this.__trigger.apply(this, arguments);
                }
                return this;
            },
            __allowShowTitle: function() {
                return true;
            },
            __allowFocus: function() {
                return !!this.__allow_focus;
            },
            __trigger: function(type, params) {
                var args = [].slice.call(arguments, 1);
                $(this.__element).trigger(type, [ this ].concat(args));
                return this;
            },
            __triggerHandler: function(type, params) {
                var args = [ this ].concat([].slice.call(arguments, 1));
                return $(this.__element).triggerHandler(type, args);
            },
            /**
         * 同__trigger，都触发某事件，但是该方法触发的事件会主动触发before和after，
         * 同时如果before事件返回false，则后续handler都不会执行，且后续事件也不会再触发。
         * @param type 事件类型
         * @param handler 该事件所需要执行的函数句柄， 且该函数的返回值将作为该事件的参数发送给事件监听器
         * */
            __fire: function(type, handler) {
                var result = {
                    cancel: false
                };
                if (/^(before|after)/.test(type)) {
                    return this;
                }
                this.__trigger("before" + type, result);
                if (result.cancel === true) {
                    return this;
                }
                result = handler.call(this, type);
                this.__trigger(type);
                this.__trigger("after" + type, result);
                return this;
            },
            __extendOptions: function() {
                var args = [ {}, this.__options ], params = [ true ];
                args = args.concat([].slice.call(arguments, 0));
                for (var i = 0, len = args.length; i < len; i++) {
                    if (typeof args[i] !== "string") {
                        params.push(args[i]);
                    }
                }
                this.__options = $.extend.apply($, params);
            },
            __hide: function() {
                $(this.__element).addClass(CONF.classPrefix + "hide");
            },
            __show: function() {
                $(this.__element).removeClass(CONF.classPrefix + "hide");
            },
            __initBasicEnv: function() {
                if (this.__options.text && this.__allowShowTitle()) {
                    this.__element.setAttribute("title", this.__options.text);
                }
                if (this.__options.width) {
                    this.__element.style.width = this.__options.width + "px";
                }
                if (this.__options.height) {
                    this.__element.style.height = this.__options.height + "px";
                }
                if (this.widgetName) {
                    this.__element.setAttribute("rule", this.widgetName);
                }
            },
            __id: function() {
                return this.__options.id || generatorId();
            }
        });
        // 为widget生成唯一id
        function generatorId() {
            return prefix + ++uid;
        }
        return Widget;
    }
};

//dev-lib/exports.js
/**
 * 模块暴露
 */
_p[64] = {
    value: function(require) {
        _p.r(1);
        _p.r(2);
    }
};

var moduleMapping = {
    "fui.export": 64
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
// 编译打包后的启动脚本
use( 'fui.export' );})();