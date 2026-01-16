export const DIRECTIVA_USERS = [
  {
    email: "planaileen@gmail.com",
    password: "123456",
  },
  {
    email: "lider@jaflorida.com",
    password: "lider123",
  },
];

export function validarDirectiva(email: string, password: string) {
  return DIRECTIVA_USERS.some(
    (u) => u.email === email && u.password === password
  );
}
