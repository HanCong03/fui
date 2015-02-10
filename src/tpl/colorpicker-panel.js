define( function () {
return '<div unselectable="on" class="fui-colorpicker-panel-content">\n' +
'<div unselectable="on" class="fui-clear-color">清除颜色</div>\n' +
'<table unselectable="on">\n' +
'<tbody unselectable="on">\n' +
'colors.forEach (function (colorList){\n' +
'<tr unselectable="on">\n' +
'colorList.forEach(function (color) {\n' +
'<td unselectable="on" data-value="#{color}">\n' +
'<div unselectable="on" class="fui-color-block" style="background: #{color}"></div>\n' +
'</td>\n' +
'});\n' +
'</tr>\n' +
'});\n' +
'</tbody>\n' +
'</table>\n' +
'</div>\n';
} );