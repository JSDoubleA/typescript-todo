import BaseComponent from './BaseComponent';

/**
 * Todo 항목 입력부 컴포넌트
 */
export default class TodoAdder extends BaseComponent {
  initState() {
    return {};
  }

  onUpdateState() {
  }

  template() {
    const container = document.createElement('div');

    container.setAttribute('class', 'todo-adder-container');

    container.innerHTML = `
      <div class="input-container">
        <label>
          <input class="todo-adder-input" type="text" placeholder="what need to be done" />
        </label>
      </div>
    `;

    return container;
  }

  setEvent(el: HTMLElement) {
    const todoInput = el.querySelector<HTMLInputElement>('input.todo-adder-input');
    todoInput?.addEventListener('keydown', (ev) => {
      const target = ev.target as HTMLInputElement;

      if (
        target
        && target.value.length > 0
        && ev.key.toLowerCase() === 'enter'
      ) {
        const todoItem = this.store.makeTodoItem(target.value);
        this.store.add(todoItem);

        this.eventEmitter.emit('add', todoItem);
        target.value = '';
      }
    });
  }
}
