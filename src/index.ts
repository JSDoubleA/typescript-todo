import TodoApplication from './Application';
import TodoStore from './utils/TodoStore';

import './styles/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  let appRootElement = document.getElementById('appRoot');

  if (!appRootElement) {
    const el = document.createElement('div');
    el.setAttribute('id', 'appRoot');

    appRootElement = el;

    document.body.appendChild(appRootElement);
  }

  const app = new TodoApplication(new TodoStore());

  appRootElement.appendChild(app.element);
});
