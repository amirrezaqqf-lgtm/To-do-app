const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const addButton = document.getElementById('add-button');
const cancelButton = document.getElementById('cancel-button');

let allTodos = getTodos();
let editingIndex = null;
let isEditing = false;

updateTodoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(isEditing){
        updateTodo();
    } else {
        addTodo();
    }
});

if(cancelButton){
    cancelButton.addEventListener('click', function() {
        cancelEdit();
    });
}

function addTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        const todoObject = {
            text: todoText,
            completed: false
        };
        allTodos.push(todoObject);
        saveTodos();
        updateTodoList();
        todoInput.value = "";
        todoInput.focus();
    }
}

function updateTodo(){
    const todoText = todoInput.value.trim();
    if(todoText.length > 0){
        allTodos[editingIndex].text = todoText;
        saveTodos();
        updateTodoList();
        cancelEdit();
    }
}

function cancelEdit() {
    todoInput.value = "";
    editingIndex = null;
    isEditing = false;
    if(cancelButton) cancelButton.style.display = "none";
    todoInput.placeholder = "click here and write down your task";
    todoInput.focus();
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";

    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todoText}</label>
        <button class="edit-button" title="Edit task">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
        </button>
        <button class="delete-button" title="Delete task">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const deleteBtn = todoLI.querySelector('.delete-button');
    deleteBtn.addEventListener('click', function() {
        deleteTodoItem(todoIndex);
    });
    const editBtn = todoLI.querySelector('.edit-button');
    editBtn.addEventListener('click', function() {
        editTodoItem(todoIndex);
    });
    const checkbox = todoLI.querySelector('input[type="checkbox"]');
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', function() {
        allTodos[todoIndex].completed = this.checked;
        saveTodos();
    });

    const todoTextLabel = todoLI.querySelector('.todo-text');
    todoTextLabel.addEventListener('dblclick', function() {
        editTodoItem(todoIndex);
    });

    return todoLI;
}

function editTodoItem(todoIndex){
    const todoLI = todoListUL.children[todoIndex];
    const todoTextLabel = todoLI.querySelector('.todo-text');

    if (!todoLI.classList.contains('editing')) {
        todoLI.classList.add('editing');


        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = allTodos[todoIndex].text;
        editInput.className = 'edit-input';  
        editInput.style.flexGrow = '1';
        editInput.style.font = 'inherit';

        todoLI.replaceChild(editInput, todoTextLabel);
        editInput.focus();

        editInput.addEventListener('keydown', function(e){
            if(e.key === 'Enter'){
                saveInlineEdit(todoIndex, editInput, todoLI);
            }
        });

    } else {
        const editInput = todoLI.querySelector('.edit-input');
        saveInlineEdit(todoIndex, editInput, todoLI);
    }
}

function saveInlineEdit(todoIndex, editInput, todoLI){
    const newText = editInput.value.trim();
    if(newText.length > 0){
        allTodos[todoIndex].text = newText;
        saveTodos();

        const newLabel = document.createElement('label');
        newLabel.className = 'todo-text';
        newLabel.setAttribute('for', "todo-" + todoIndex);
        newLabel.textContent = newText;

        todoLI.replaceChild(newLabel, editInput);
        todoLI.classList.remove('editing');

        // دابل کلیک 
        newLabel.addEventListener('dblclick', function() {
            editTodoItem(todoIndex);
        });
    }
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos(){
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todoJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}
