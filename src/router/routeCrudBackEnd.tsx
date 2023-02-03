
const port = 8080
const route = `http://localhost:${port}/`

export const routeCustomerById = (id: string) =>  `${route}${ id }` 

