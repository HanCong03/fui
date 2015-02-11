/**
 * 容器类： PPanel = Positioning Panel
 */

define(function (require) {

    var $ = require("base/jquery"),
        Utils = require("base/utils"),
        CONF = require("base/sysconf"),
        tpl = require("tpl/colorpicker"),
        Icon = require("widget/icon"),
        PPanel = require("widget/ppanel"),
        Mask = require("widget/mask"),
        Label = require("widget/label"),
        LAYOUT = CONF.layout;

    return Utils.createClass("ColorPicker", {

        base: require("widget/widget"),

        constructor: function (options) {

            var defaultOptions = {
                defaultColor: '#ffffff',
                columnCount: 10,
                label: null,
                colors: [
                    '#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd',
                    '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646',
                    '#f2f2f2', '#808080', '#ddd8c2', '#c6d9f1', '#dbe5f1',
                    '#f2dbdb', '#eaf1dd', '#e5dfec', '#daeef3', '#fde9d9',
                    '#d9d9d9', '#595959', '#c4bc96', '#8db3e2', '#b8cce4',
                    '#e5b8b7', '#d6e3bc', '#ccc0d9', '#b6dde8', '#fbd4b4',
                    '#bfbfbf', '#404040', '#938953', '#548dd4', '#95b3d7',
                    '#d99594', '#c2d69b', '#b2a1c7', '#92cddc', '#fabf8f',
                    '#a6a6a6', '#262626', '#4a442a', '#17365d', '#365f91',
                    '#943634', '#76923c', '#5f497a', '#31849b', '#e36c0a',
                    '#7f7f7f', '#0d0d0d', '#1c1a10', '#0f243e', '#243f60',
                    '#622423', '#4e6128', '#3f3151', '#205867', '#974706'
                ],
                layout: LAYOUT.BOTTOM
            };

            options = $.extend({}, defaultOptions, options);

            this.callBase(options);

        },

        selectByColor: function (color) {
            var colors = this.__options.colors;
            var index = colors.indexOf(color);

            if (index === -1) {
                return;
            }

            this.__colorBar.css("background", colors[index]);
        },

        resetColor: function () {
            this.currentColor = null;
            this.__colorBar.css("background", this.__options.defaultColor);
        },

        getValue: function () {
            return this.currentColor;
        },

        __render: function () {

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

            this.__colorBar = $('.fui-color-bar', this.__element);
            this.__colorBar.css("background", this.__options.defaultColor);

            this.__element.appendChild(this.__icon.getElement());
            this.__element.appendChild(this.__openIcon.getElement());

            if (this.__options.label) {
                this.__label = new Label(this.__options.label);
                this.__element.appendChild(this.__label.getElement());
            }

            this.__panel.getContentElement().innerHTML = Utils.Tpl.compile(require("tpl/colorpicker-panel"), {
                colors: (function () {
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
                })()
            });

            this.__panel.addClass(CONF.classPrefix + 'colorpicker-panel');

            $(this.__element).addClass(CONF.classPrefix + "colorpicker-btn");
        },

        __initEvent: function () {
            var _self = this;

            this.callBase();

            this.on('click', function (e) {
                this.open();
            });

            this.__maskWidget.on("maskclick", function () {
                _self.close();
            });

            $('.fui-clear-color', this.__panel.getElement()).on('click', function () {
                _self.__clearColor();
            });

            $(this.__panel.getElement()).on('click', 'td', function (e) {
                _self.__selectColor(this);
            });
        },

        open: function () {
            this.__panel.show();
            this.__maskWidget.show();
            this.addClass("fui-opened");
        },

        close: function () {
            this.__panel.hide();
            this.__maskWidget.hide();
            this.removeClass("fui-opened");
        },

        __selectColor: function (colorNode) {
            var color = colorNode.getAttribute("data-value");
            this.__selected(color);
        },

        __clearColor: function () {
            this.__selected(null);
        },

        __selected: function (color) {
            this.currentColor = color;
            this.__colorBar.css("background", color || this.__options.defaultColor);
            this.trigger('select', color);
            this.close();
        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'ColorPicker';

            this.__icon = null;
            this.__maskWidget = null;
            this.__openIcon = null,
            this.__colorBar = null;
            this.__panel = null;
            this.__tpl = tpl;
            this.currentColor = null;

        }

    });

});
