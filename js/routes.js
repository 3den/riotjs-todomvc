'use strict';

function routes(models) {
    riot.route(function(hash) {
        models.todo.trigger('load', hash.slice(2));
    });
}
