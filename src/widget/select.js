/**
 * SelectMenu构件
 * 提供从下拉菜单中选中某一项的功能构件
 */

define(function (require) {

    var $ = require("base/jquery"),
        CONF = require("base/sysconf"),
        Panel = require("widget/panel"),
        PPanel = require("widget/ppanel"),
        Creator = require("base/creator"),
        Icon = require("widget/icon"),
        Mask = require("widget/mask");

    return require("base/utils").createClass("Select", {

        base: Panel,

        constructor: function (options) {

            var defaultOptions = {
                // bed 是Panel的实例
                bed: {
                    className: 'fui-select-bed'
                },
                icon: {
                    className: 'fui-select-open'
                },
                events: ["itemclick click"],
                selected: -1
            };

            options = $.extend({}, defaultOptions, options);

            this.callBase(options);

        },

        show: function () {
            this.__widgetMenu.show();
            this.__mask.show();
            this.addClass("fui-opened");
        },

        hide: function () {
            this.__widgetMenu.hide();
            this.__mask.hide();
            this.removeClass("fui-opened");
        },

        getValue: function () {
            var selectedWidet = this.__widgets[this.__selected];
            return selectedWidet ? selectedWidet.getValue() : null;
        },

        getSelected: function () {
            return this.__widgets[this.__selected];
        },

        select: function (index) {

            var widget = this.__widgets[index],
                className = "fui-select-selected",
                oldIndex = this.__selected,
                oldSelected = this.__widgets[this.__selected],
                bedElement = this.__bed.getElement();

            if (!widget) {
                return this;
            }

            if (oldSelected) {
                oldSelected.removeClass(className);
            }

            bedElement.innerHTML = '';
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

        selectByWidget: function (widget) {
            return this.select(this.indexOf(widget));
        },

        selectByValue: function (value) {
            var index = -1;

            $.each(this.__widgets, function (i, widget) {
                if (widget.getValue() === value) {
                    index = i;
                    return false;
                }
            });

            return this.select(index);
        },

        __render: function () {

            this.__bed = new Panel(this.__options.bed);
            this.__openIcon = new Icon(this.__options.icon);
            this.__widgetMenu = new PPanel({
                className: 'fui-select-container',
                layout: CONF.layout.BOTTOM,
                column: this.__column
            });
            this.__mask = new Mask();

            var widgets = this.__initWidgets();

            this.callBase();

            $(this.__element).addClass(CONF.classPrefix + "select");

            this.appendWidgets([this.__bed, this.__openIcon, this.__mask, this.__widgetMenu]);

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

        __initWidgets: function () {

            var widgets = [];

            if (!this.__options.widgets) {
                return;
            }

            $.each(this.__options.widgets, function (index, widget) {
                widgets.push(Creator.parse(widget));
            });

            return widgets;

        },

        __initEvent: function () {

            this.callBase();

            var _self = this;

            this.on("click", function () {
                _self.show();
            });

            this.__mask.on("click", function () {
                _self.hide();
            });

            this.__widgetMenu.on(this.__options.events.join(" "), function (e) {
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

        __initOptions: function () {
            this.callBase();

            this.widgetName = 'Select';

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

});