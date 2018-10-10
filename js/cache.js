'use strict';

function createCache(size = 1000) {
  const map = new Map();
  const buffer = Array(size);
  let index = 0;
  let lastIndex = 0;
  return {
    get,
    set,
    delete: delete_,
    clear,
    has: id => map.has(id),
    entries: function *() {
      for (const [id, item] of map) {
        yield [id, item.data];
      }
    },
    values: function *() {
      for (const item of map.values()) {
        yield item.data;
      }
    },
    get size() {
      return map.size;
    }
  };

  function get(id) {
    const item = map.get(id);
    return item && item.data;
  }

  function set(id, data) {
    if (map.size === size) {
      // full
      map.delete(buffer[lastIndex].id);
      lastIndex = (lastIndex + 1) % size;
    }
    const item = {id, data, index};
    map.set(id, item);
    buffer[index] = item;
    index = (index + 1) % size;
  }

  function delete_(id) {
    const item = map.get(id);
    if (!item) {
      return;
    }
    map.delete(item.id);
    const lastItem = buffer[lastIndex];
    lastItem.index = item.index;
    buffer[item.index] = lastItem;
    lastIndex = (lastIndex + 1) % size;
  }

  function clear() {
    map.clear();
    index = lastIndex = 0;
  }
}
