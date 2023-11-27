import EventEmitter from '../utils/EventEmitter';
import BaseComponent from './BaseComponent';
import TodoStore, { TodoData } from '../utils/TodoStore';

interface TodoListState {
  todos: TodoData[];
  viewMode: 'all' | 'active' | 'completed';
}

export default class TodoList extends BaseComponent<TodoListState> {
  todoListElement: Element | null;

  todoCountElement: Element | null;

  todoControlElement: Element | null;

  constructor(store: TodoStore, eventEmitter: EventEmitter) {
    super(store, eventEmitter);

    this.todoListElement = this.el$.querySelector('.todo-list');
    this.todoCountElement = this.el$.querySelector('.todo-count');
    this.todoControlElement = this.el$.querySelector('.todo-controls');

    this.handleEvent = this.handleEvent.bind(this);
    this.handleTodoAction = this.handleTodoAction.bind(this);

    this.eventEmitter.on('add', () => this.handleEvent('add'));
  }

  set todos(value: TodoListState['todos']) {
    this.state.todos = value;
  }

  get viewMode() {
    return this.state.viewMode;
  }

  set viewMode(value: TodoListState['viewMode']) {
    this.state.viewMode = value;
  }

  initState() {
    return {
      todos: [],
      viewMode: 'all',
    } as TodoListState;
  }

  onUpdateState(prop: string | symbol) {
    if (prop === 'todos' || prop === 'viewMode') {
      this.updateTodoList();
    }
  }

  template() {
    const container = document.createElement('div');
    const todoList = document.createElement('ul');
    const controls = document.createElement('div');
    const todoItems = this.templateTodoItems(this.state.todos);

    container.setAttribute('class', 'todo-list-container');
    todoList.setAttribute('class', 'todo-list');
    controls.setAttribute('class', 'button-groups');

    controls.innerHTML = `
      <p class="item-count">
        남은 항목: <span class="todo-count">${this.state.todos.length}</span>개
      </p>
      <div class="todo-controls">
        <button class="btn" type="button" data-todo-action="viewAll">전체 보기</button>
        <button class="btn" type="button" data-todo-action="viewActive">미완료 항목 보기</button>
        <button class="btn" type="button" data-todo-action="viewCompleted">완료 항목 보기</button>
        <button class="btn" type="button" data-todo-action="clearCompleted">완료 항목 삭제</button>
      </div>
    `;

    todoList.appendChild(todoItems);
    container.appendChild(todoList);
    container.appendChild(controls);

    return container;
  }

  templateTodoItems(datas: TodoData[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const todoItems = datas.map((data) => {
      const itemElement = document.createElement('li');

      if (data.completed) {
        itemElement.setAttribute('class', 'completed');
      }
      itemElement.setAttribute('data-todo-id', data.id);
      itemElement.innerHTML = `        
        <span data-todo-action="${data.completed ? 'active' : 'complete'}">${data.value}</span>
        <button class="btn" type="button" data-todo-action="remove">삭제</button>
      `;

      return itemElement;
    });

    fragment.append(...todoItems);

    return fragment;
  }

  setEvent(el: HTMLElement) {
    const listElement = el.querySelector('.todo-list');
    const controlsElement = el.querySelector('.todo-controls');

    if (listElement) {
      listElement.addEventListener('click', (ev) => {
        const target = (ev.target as HTMLElement);
        const parent = target?.parentElement;
        const todoId = parent?.getAttribute('data-todo-id');
        const action = target.getAttribute('data-todo-action');

        if (action && todoId) {
          this.handleTodoAction(action, { id: todoId });
        }
      });
    }

    if (controlsElement) {
      controlsElement.addEventListener('click', (ev) => {
        const target = ev.target as HTMLButtonElement;

        if (target.tagName.toLowerCase() === 'button') {
          this.handleTodoAction(target.getAttribute('data-todo-action'), {});
        }
      });
    }
  }

  handleEvent(eventType: string) {
    switch (eventType) {
      case 'remove':
      case 'add':
        this.state.todos = this.getTodoList(this.viewMode);
        break;
      default:
    }
  }

  handleTodoAction(action: string | null, data: Partial<TodoData>) {
    switch (action) {
      case 'remove':
        if (data.id) {
          this.store.remove(data.id);
          this.refresh();
        }
        break;
      case 'active':
        if (data.id) {
          this.store.update(data.id, { completed: false });
          this.refresh();
        }
        break;
      case 'complete':
        if (data.id) {
          this.store.update(data.id, { completed: true });
          this.refresh();
        }
        break;
      case 'viewAll':
        this.viewMode = 'all';
        this.todos = this.getTodoList(this.viewMode);
        break;
      case 'viewActive':
        this.viewMode = 'active';
        this.todos = this.getTodoList(this.viewMode);
        break;
      case 'viewCompleted':
        this.viewMode = 'completed';
        this.todos = this.getTodoList(this.viewMode);
        break;
      case 'clearCompleted':
        this.store.remove(
          this.store.filter({ completed: true })
            .map((d) => d.id),
        );
        this.refresh();
        break;
      default:
    }
  }

  updateTodoList() {
    if (this.todoListElement) {
      const todoItems = this.templateTodoItems(this.state.todos);
      this.todoListElement.replaceChildren();
      this.todoListElement.append(todoItems);
    }

    if (this.todoCountElement) {
      this.todoCountElement.innerHTML = this.state.todos.length.toString();
    }
  }

  getTodoList(viewMode: TodoListState['viewMode']) {
    const todos = viewMode === 'all'
      ? this.store.getAll()
      : this.store.filter({ completed: viewMode === 'completed' });

    return todos.sort(this.sortTodoList);
  }

  refresh() {
    this.todos = this.getTodoList(this.viewMode);
  }

  sortTodoList(a: TodoData, b: TodoData) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (a.completed && !b.completed) {
      return 1;
    }

    if (!a.completed && b.completed) {
      return -1;
    }

    if (dateA > dateB) {
      return -1;
    }

    if (dateA < dateB) {
      return 1;
    }

    return 0;
  }
}
