const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    // eslint-disable-next-line consistent-this
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

export { debounce };
