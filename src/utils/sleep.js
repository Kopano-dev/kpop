/* sleep is a promise based timeout */
export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default sleep;
