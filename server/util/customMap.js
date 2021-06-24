class CustomMap extends Map {
  #customMapper;
  #observer;

  constructor({ customMapper, observer }) {
    super();
    this.#customMapper = customMapper;
    this.#observer = observer;
  }

  *values() {
    for (const value of super.values()) {
      yield this.#customMapper(value);
    }
  }

  delete(...args) {
    const result = super.delete(...args);
    this.#observer.notify(this);

    return result;
  }

  set(...args) {
    const result = super.set(...args);
    this.#observer.notify(this);

    return result;
  }
}

export default CustomMap;
