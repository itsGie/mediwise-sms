export const generateRandomString = (n: number, allowSpecialChar: boolean = false): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const symbol = "!@&$";
  const allCharacters = allowSpecialChar ? characters + symbol : characters;

  let result = "";
  const charactersLength = allCharacters.length;

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += allCharacters.charAt(randomIndex);
  }

  return result;
};
