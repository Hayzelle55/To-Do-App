var todos = [];
window.addEventListener('load', function () {
    // Load todos from local storage
    todos = JSON.parse(localStorage.getItem('todos') || '[]');
    // Get HTML elements
    var nameInput = document.querySelector('#name');
    var newTodoForm = document.querySelector('#new-todo-form');
    // Load username from local storage
    var username = localStorage.getItem('username') || '';
    // Set the value of the name input to the stored username
    if (nameInput) {
        nameInput.value = username;
    }
    // Store username in local storage when it changes
    nameInput.addEventListener('change', function (e) {
        var target = e.target;
        localStorage.setItem('username', target.value);
    });
    // Add a new todo on form submit
    newTodoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var target = e.target;
        var todo = {
            content: target.elements.namedItem('content').value,
            category: target.elements.namedItem('category').value,
            done: false,
            createdAt: new Date().getTime()
        };
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        // Reset the form
        target.reset();
        // Display todos
        DisplayTodos();
    });
    // Display todos on page load
    DisplayTodos();
});
function DisplayTodos() {
    var todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";
    todos.forEach(function (todo) {
        var todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var span = document.createElement('span');
        var content = document.createElement('div');
        var actions = document.createElement('div');
        var edit = document.createElement('button');
        var deleteButton = document.createElement('button');
        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category === 'personal') {
            span.classList.add('personal');
        }
        else {
            span.classList.add('business');
        }
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');
        content.innerHTML = "<input type=\"text\" value=\"".concat(todo.content, "\" readonly>");
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);
        todoList.appendChild(todoItem);
        if (todo.done) {
            todoItem.classList.add('done');
        }
        input.addEventListener('change', function (e) {
            var target = e.target;
            todo.done = target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            if (todo.done) {
                todoItem.classList.add('done');
            }
            else {
                todoItem.classList.remove('done');
            }
            DisplayTodos();
        });
        edit.addEventListener('click', function (e) {
            var input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', function (e) {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        });
        deleteButton.addEventListener('click', function (e) {
            todos = todos.filter(function (t) { return t !== todo; });
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });
}
