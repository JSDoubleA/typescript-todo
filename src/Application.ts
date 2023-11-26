import BaseComponent from './components/BaseComponent';
import EventEmitter from './utils/EventEmitter';
import TodoStore from './utils/TodoStore';

import TodoAdder from './components/TodoAdder';
import TodoList from './components/TodoList';

export default class TodoApplication extends BaseComponent {
  constructor(store: TodoStore) {
    super(store, new EventEmitter());
  }

  initState() {
    return {};
  }

  template() {
    const template = document.createElement('section');
    const titleElement = document.createElement('h1');
    const todoContainerElement = document.createElement('div');
    const todoAdderElement = new TodoAdder(this.store, this.eventEmitter);
    const todoListElement = new TodoList(this.store, this.eventEmitter);

    titleElement.setAttribute('class', 'todo-title');
    titleElement.innerText = 'Todo LiST';
    template.appendChild(titleElement);

    todoContainerElement.setAttribute('class', 'todo-container');
    template.appendChild(todoContainerElement);

    template.setAttribute('class', 'todo');
    todoContainerElement.appendChild(todoAdderElement.element);
    todoContainerElement.appendChild(todoListElement.element);

    return template;
  }

  setEvent(): void {
    // 이벤트 없음
  }

  onUpdateState() {
    // 업데이트 동작 없음
  }
}
