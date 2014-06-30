'use strict';

function footerPresenter(element, options) {
    var todo = options.model,
        template = options.template,
        filterState = null;

    // Bind model events
    todo.on('load', load);
    todo.on('add remove toggle load', counts);

    function load(filter) {
        filterState = filter;
    }

    function counts() {
        var data = getData();
        element.html($.render(template, data));
        $('a[href="#/'+ filterState +'"]', element).addClass('selected');
        toggle(data);
    }

    function toggle(data) {
        var showClear = (data.completed > 0),
            showFooter = (data.active + data.completed > 0);

        element.toggle(showFooter);
        $('#clear-completed', element).toggle(showClear);
    }

    function getData() {
        var active = todo.items('active').length,
            completed = todo.items('completed').length,
            items = (active === 1 ? 'item' : 'items');

        return {
            active: active,
            completed: completed,
            items: items
        };
    }
    return element;
}
