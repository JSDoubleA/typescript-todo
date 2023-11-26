import EventEmitter from '../utils/EventEmitter';
import Store from '../utils/TodoStore';

/**
 * 프로젝트 내에서 사용되는 컴포넌트의 기본적인 동작을 정의한 클래스
 */
export default abstract class BaseComponent<T extends Record<string | symbol, any> = any> {
  protected el$: HTMLElement;

  state: T;

  store: Store;

  eventEmitter: EventEmitter;

  constructor(store: Store, eventEmitter: EventEmitter) {
    this.store = store;
    this.eventEmitter = eventEmitter;
    this.state = new Proxy(
      this.initState(),
      {
        set: (obj, prop, value) => {
          // eslint-disable-next-line no-param-reassign
          (obj[prop] as T[keyof T]) = value;

          this.onUpdateState(prop, value);

          return true;
        },
      },
    );

    this.el$ = this.render();
  }

  get element() {
    return this.el$;
  }

  /** 컴포넌트 싱테 데이터 초기화 메서드 */
  abstract initState(): T;

  /** 컴포넌트 상태 데이터 변경에 대응하기 위한 핸들러 */
  abstract onUpdateState(prop: string | symbol, value: any);

  /** 컴포넌트 템플릿 생성 및 상태 데이터와 바인딩 하기 위한 메서드  */
  abstract template(state?: T): HTMLElement;

  /** 렌더로 생성된 엘러먼트에 이벤트를 할당하기 위한 메서드  */
  abstract setEvent(el: HTMLElement): void;

  /** 컴포넌트 초기 렌더를 위한 메서드 */
  private render(): HTMLElement {
    const templateNode = this.template(this.state);

    this.setEvent(templateNode);

    return templateNode;
  }
}
