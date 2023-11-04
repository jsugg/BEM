export function handleErrors(action, message) {
    try {
      action();
    } catch (error) {
      console.error(`${message}: ${error.message}`);
    }
  }
  