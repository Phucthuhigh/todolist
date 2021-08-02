let container = document.querySelector('.main');
const LOCAL_STORAGE = 'todoList';
let todos = [];
let footer = document.querySelector('.footer');
let countBox = document.createElement('span');

function start() {
    get(render);
    countBox.className = 'todo-count';
    countBox.innerHTML = `
        <strong>${todos.length}</strong> item left
    `
    footer.appendChild(countBox);
    handleCreate();
}

start();

function get(callback) {
    todos = localStorage.getItem(LOCAL_STORAGE) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE)) : [];
    callback(todos);
}

function set(lists) {
    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(lists));
}

function render(lists) {
    let ulElement = document.querySelector('.todo-list');
    let htmls = lists.map((list,index) => {
    return `
        <li class="${list.completed && 'completed'}">
            <div class="view">
                <input class="toggle" type="checkbox" ${list.completed && 'checked'} onchange="toggle(${index})">
                <label class="title" ondblclick="change(this,${index})">${list.title}</label>
                <button class="destroy" onclick="remove(${index})"></button>
            </div>
            <input class="edit" value="${list.title}">
        </li>
        `
    })
    ulElement.innerHTML = htmls.join('');
}


function create(data,options) {
    options.push({
        title:data.value,
        completed:false
    })
    set(options);
    get(render);
    data.value = '';
    countBox.className = 'todo-count';
    countBox.innerHTML = `
        <strong>${todos.length}</strong> item left
    `
}

function handleCreate() {
    let inputTodo = document.querySelector('.new-todo');
        inputTodo.addEventListener('keyup', (e) => {
            if (inputTodo.value) {
                e.keyCode === 13 && create(inputTodo,todos)
            }
        })
}

function toggle(index) {
    todos[index].completed = !todos[index].completed;
    set(todos);
    get(render);
}

function toggleAll(completed) {
    todos.forEach(todo => {
        todo.completed = completed;
    })
    set(todos);
    get(render);
}

function remove(index) {
    todos.splice(index,1);
    set(todos);
    get(render);
    countBox.className = 'todo-count';
    countBox.innerHTML = `
        <strong>${todos.length}</strong> item left
    `
}

function clearAllCompleted() {
    let toggleAllBtn = document.querySelector('#toggle-all');
    toggleAllBtn.checked = false;
    for (let i = 0; i<todos.length; i++) {
        if (todos[i].completed) {
            remove(i)
            i--;
        }
    }
}

function change(data,i) {
    data.parentElement.parentElement.classList.add('editing');
    let changeInput = data.parentElement.parentElement.querySelector('.edit');
    changeInput.addEventListener('keyup',(e) => {
        todos[i].title = changeInput.value;
        set(todos);
        if (e.keyCode === 13) {
            data.parentElement.parentElement.classList.remove('editing');
            get(render)
        }
    })
}