export interface TodoData {
  id: string;
  value: string;
  completed: boolean;
  createdAt: string;
}

export default class TodoStore {
  datas: TodoData[];

  get length() {
    return this.datas.length;
  }

  constructor() {
    this.datas = [];
  }

  /** 형식: `{랜덤하게 생성된 숫자 실수부를 36진수로 변환한 값}` */
  static genTodoId() {
    const randString = Math.random().toString(36).substring(2, 17);

    return randString;
  }

  makeTodoItem(value: string): TodoData {
    const createdAt = new Date().toISOString();

    return {
      id: TodoStore.genTodoId(),
      value,
      completed: false,
      createdAt,
    };
  }

  get(id: string): TodoData | undefined {
    return this.datas.find((data) => data.id === id);
  }

  getAll() {
    const items = [...this.datas];

    return items;
  }

  filter(criteria: Partial<TodoData>): TodoData[] {
    const criterias = Object.entries(criteria);

    const items: TodoData[] = [];
    if (criterias.length) {
      const filtered = this.datas.reduce<TodoData[]>(
        (prev, current) => {
          const isMatched = criterias.every(([key, value]) => current[key] === value);
          if (isMatched) {
            prev.push({ ...current });
          }

          return prev;
        },
        [],
      );

      items.push(...filtered);
    }

    return items;
  }

  add(item: TodoData) {
    this.datas.push(item);

    return item;
  }

  remove(ids: TodoData['id'] | TodoData['id'][]) {
    console.log(ids);
    console.log(this.datas);
    const removeIds = Array.isArray(ids) ? ids : [ids];
    const removeIndexes = this.datas
      .reduce<number[]>((data, current, currentIndex) => {
        if (removeIds.includes(current.id)) {
          data.push(currentIndex);
        }

        return data;
      }, []);

    removeIndexes.forEach((idx) => {
      this.datas.splice(idx, 1);
    });
  }

  update(
    ids: TodoData['id'] | TodoData['id'][],
    updateData: Partial<Omit<TodoData, 'id'>>,
  ) {
    const updateIds = Array.isArray(ids) ? ids : [ids];
    const updateIndex = this.datas
      .reduce<number[]>((data, current, currentIndex) => {
        if (updateIds.includes(current.id)) {
          data.push(currentIndex);
        }

        return data;
      }, []);

    updateIndex.forEach((idx) => {
      const orignal = this.datas[idx];
      this.datas[idx] = {
        ...orignal,
        ...updateData,
      };
    });
  }

  clear() {
    this.datas = [];
  }
}
