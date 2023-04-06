import { asValue } from 'awilix'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from '../src/exceptions/http.error'
import { type UserService } from '../src/services'
import container from '../src/startup/container'
import { generateUser, generateUsers } from './mocks/user.mock'

describe('UserService', () => {
    afterEach(async () => {
        vi.restoreAllMocks()
        await container.dispose()
    })

    it('getAll should return users', async () => {
        /** Arrange */
        const userMocks = generateUsers(2)
        const userRepositoryMock = {
            getPaginated: vi.fn().mockResolvedValue(userMocks)
        }

        container.register({
            UserRepository: asValue(userRepositoryMock)
        })
        const userService: UserService = container.resolve('UserService')

        /** Act */
        const users = await userService.getAll(10, 2)

        /** Assert */
        expect(users.length).toEqual(2)
        expect(userRepositoryMock.getPaginated).toBeCalledWith(10, 2)
        expect(userRepositoryMock.getPaginated).toBeCalledTimes(1)
        expect(users[0]).toBe(userMocks[0])
    })

    it('should throw error if user is register', async () => {
        /** Arrange */
        const userMock = generateUser()
        const userRepositoryMock = {
            findUserByEmail: vi.fn().mockResolvedValue(userMock)
        }

        container.register({
            UserRepository: asValue(userRepositoryMock)
        })
        const userService: UserService = container.resolve('UserService')

        /** Act */
        try {
            await userService.signUp(userMock)
        } catch (error) {
            /** Assert */
            expect(error).toBeInstanceOf(HttpError)
        }

        /** Assert */
        await expect(userService.signUp(userMock)).rejects.toThrow('El usuario ya se encuentra registrado')
    })

    it('should create user', async () => {
        /** Arrange */
        const userMock: any = {
            name: 'name',
            email: 'email',
            password: 'password',
            generateAuthToken: vi.fn().mockReturnValue('token')
        }

        const userRepositoryMock = {
            findUserByEmail: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue(userMock)
        }

        container.register({
            UserRepository: asValue(userRepositoryMock)

        })
        const userService: UserService = container.resolve('UserService')

        /** Act */
        const user = await userService.signUp(userMock)

        /** Assert */

        expect(userRepositoryMock.create).toBeCalledWith(userMock)
        expect(userRepositoryMock.create).toBeCalledTimes(1)
        expect(userMock.generateAuthToken).toBeCalledTimes(1)
        expect(user.createdUser.name).toBe(userMock.name)
        expect(user.token).toBe('token')
    })
})
