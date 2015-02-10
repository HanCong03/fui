define(function (require) {

    var $ = require("base/jquery"),
        PPanel = require("widget/ppanel"),
        Creator = require("base/creator"),
        Mask = require("widget/mask");

    var Button = require('widget/button');

    return require("base/utils").createClass("SubMenu", {

        base: require("widget/widget"),

        constructor: function (options) {

            var defaultOptions = {
                button: {},
                panel: {}
            };

            options = $.extend({}, defaultOptions, options);

            this.callBase(options);
        },

        __render: function () {
            this.__widgets = this.__createWidgets();

            this.callBase();

            this.getElement().appendChild(this.button.getElement());

            this.panel.appendWidgets(this.__widgets);

            this.panel.positionTo(this.button.getElement());

            this.addClass('fui-sub-menu');
            this.button.addClass('fui-sub-menu-button');
            this.panel.addClass('fui-sub-menu-panel');
        },

        __createWidgets: function () {
            var widgets = [];

            if (!this.__options.widgets) {
                return;
            }

            $.each(this.__options.widgets, function (index, widget) {
                widgets.push(Creator.parse(widget));
            });

            return widgets;
        },

        getPanel: function () {
            return this.panel;
        },

        open: function () {
            this.panel.show();
            this.mask.show();

            this.addClass('fui-opened');
        },

        close: function () {
            this.panel.hide();
            this.mask.hide();

            this.removeClass('fui-opened');
        },

        __initEvent: function () {

            this.callBase();

            var _self = this;
            //
            this.button.on("click", function () {
                _self.open();
            });
            //
            this.mask.on("click", function () {
                _self.close();
            });
            //
            //this.__widgetMenu.on(this.__options.events.join(" "), function (e) {
            //    var target = e.target;
            //
            //    if (target === _self.__oldContentElement || target === _self.getElement) {
            //        return;
            //    }
            //
            //    e.stopPropagation();
            //
            //    _self.selectByWidget(e.widget);
            //    _self.hide();
            //
            //    return false;
            //});

        },

        __initOptions: function () {
            this.callBase();

            this.widgetName = 'SubMenu';


            this.__tpl = '<div></div>';
            // 被选中的元素
            this.button = new Button(this.__options.button);
            this.panel = new PPanel(this.__options.panel);
            this.mask = new Mask();
        }

    });

});