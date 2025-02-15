interface Todo {
    content: string;
    category: string;
    done: boolean;
    createdAt: number;
}

let todos: Todo[] = [];

window.addEventListener('load', () => {
    // Load todos from local storage
    todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // Get HTML elements
    const nameInput = document.querySelector('#name') as HTMLInputElement;
    const newTodoForm = document.querySelector('#new-todo-form') as HTMLFormElement;

    // Load username from local storage
    const username = localStorage.getItem('username') || '';

    // Set the value of the name input to the stored username
    if (nameInput) {
        nameInput.value = username;
    }

    // Store username in local storage when it changes
    nameInput.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        localStorage.setItem('username', target.value);
    });

    // Add a new todo on form submit
    newTodoForm.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        const target = e.target as HTMLFormElement;
        const todo: Todo = {
            content: (target.elements.namedItem('content') as HTMLInputElement).value,
            category: (target.elements.namedItem('category') as HTMLInputElement).value,
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
    const todoList = document.querySelector('#todo-list') as HTMLDivElement;
    todoList.innerHTML = "";

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category === 'personal') {
            span.classList.add('personal');
        } else if (todo.category === 'business') {
            span.classList.add('business');
        } else if (todo.category === 'school') {
            span.classList.add('school');
        } else if (todo.category === 'health') {
            span.classList.add('health');
        }        
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
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

        input.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            todo.done = target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        });

        edit.addEventListener('click', (e: Event) => {
            const input = content.querySelector('input') as HTMLInputElement;
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e: Event) => {
                input.setAttribute('readonly', 'true');
                todo.content = (e.target as HTMLInputElement).value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        });

        deleteButton.addEventListener('click', (e: Event) => {
            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });
}