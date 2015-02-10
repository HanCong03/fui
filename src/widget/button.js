/**
 * Button对象
 * 通用按钮构件
 */

define(function (require) {

    var $ = require("base/jquery"),
        CONF = require("base/sysconf"),
        buttonTpl = require("tpl/button"),
        Icon = require("widget/icon"),
        Label = require("widget/label");

    return require("base/utils").createClass("Button", {

        base: require("widget/widget"),

        constructor: function (options) {

            var defaultOptions = {
                label: null,
                text: null,
                icon: {},
                // label相对icon的位置
                layout: 'right'
            };

            options = $.extend({}, defaultOptions, options);

            this.callBase(options);

        },

        getLabel: function () {
            return this.__labelWidget.getText();
        },

        setLabel: function (text) {
            return this.__labelWidget.setText(text);
        },

        getLabelWidget: function () {
            return this.__labelWidget;
        },

        getIconWidget: function () {
            return this.__iconWidgets;
        },

        __render: function () {

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

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Button';
            this.__tpl = buttonTpl;

            this.__iconWidgets = null;
            this.__labelWidget = null;

            if (typeof this.__options.label !== "object") {
                this.__options.label = {
                    text: this.__options.label
                };
            }

            if (this.__options.icon && !('length' in this.__options.icon)) {
                this.__options.icon = [this.__options.icon];
            }
        },

        __initEvent: function () {

            this.callBase();

            this.on("click", function () {

                this.__trigger("btnclick");

            });

        }

    });

});