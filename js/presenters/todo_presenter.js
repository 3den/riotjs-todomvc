'use strict';

function todoPresenter(element, options) {
    element = $(element);
    var template = options.template,
        todo = options.model,
        $list = element.find('#todo-list'),
        filterState = null,
        ENTER_KEY = 13,
        ESC_KEY = 27;

    /* Listen to user events */

    element.on('keyup', '#new-todo', function(e) {
        var val = $.trim(this.value);
        if (val && e.which === 13) {
            todo.add(val);
            this.value = '';
        }

    }).on('click', '#toggle-all', function() {
        todo.toggleAll();

    }).on('click', '#clear-completed', function() {
        todo.remove('completed');

    }).on('click', '.toggle', function(e) {
        todo.toggle(getTaskId(e.target));

    }).on('blur', '.edit', function(e) {
        var el = $(e.target), val = $.trim(this.value);
        if (!getTaskElement(el).hasClass('editing')) return;
        todo.edit({ name: val, id: getTaskId(el) });
        getTaskElement(el).removeClass('editing');

    }).on('keydown', '.edit', function(e) {
        var el = $(e.target), val = $.trim(this.value);
        switch(e.which) {
          case ENTER_KEY:
            todo.edit({ name: val, id: getTaskId(el) });
            break;

          case ESC_KEY:
            getTaskElement(el).removeClass('editing');
            break;
        }

    }).on('dblclick', '.todo-task label', function(e) {
        var el = getTaskElement(e.target);
        el.addClass('editing').find('.edit').focus();

    }).on('click', '.destroy', function(e) {
        todo.remove(getTaskId(e.target));
    });

    /* Listen to model events */
    todo.on('toggle', toggle);
    todo.on('edit', edit);

    // Reload the list
    todo.on('load', load);
    todo.on('add remove toggle', reload);

    /* Private functions */
    function load(filter) {
        filterState = filter;
        var items = todo.items(filterState);
        $('#main', element).toggle(items.length > 0);
        $list.empty() && items.forEach(add);
    }

    function reload() {
        load(filterState);
    }

    function toggle(item) {
      toggleTask($('#task_' + item.id, $list), !!item.done);
    }

    function edit(item) {
        var el = $('#task_' + item.id, $list);
        el.removeClass('editing');
        $('label, .edit', el).text(item.name).val(item.name);
    }

    function add(item) {
        $("#main", element).show();
        var task = $($.render(template, item));
        $list.append(task);
        toggleTask(task, !!item.done);
    }

    function toggleTask(task, flag) {
        task.toggleClass('completed', flag);
        task.find(':checkbox').prop('checked', flag);
        element.find('#toggle-all').prop('checked', todo.isDone());
    }

    function getTaskElement(element) {
        return $(element).closest('[data-task]');
    }

    function getTaskId(element) {
        return getTaskElement(element).data('task');
    }

    return element;
}
