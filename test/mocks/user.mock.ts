import { faker } from '@faker-js/faker'

export const generateUser = (): any => {
    return {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

export const generateUsers = (count: number): any => {
    return Array.from({ length: count }, generateUser)
}
