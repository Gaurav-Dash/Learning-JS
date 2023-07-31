export const generatePromiseWithRandomDelay = () => {
  return new Promise((resolve, reject) => {
    const value = Math.floor(Math.random() * 100);

    setTimeout(() => {
      if (value % 2 === 0) {
        resolve(value);
      } else {
        reject(value);
      }
    }, value);
  });
};
