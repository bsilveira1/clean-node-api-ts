import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

// factory
const makeSut = (): SutTypes => {
  // Mock
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // SUT = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_passowrd',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no email is provided', () => {
    // SUT = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_passowrd',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no password is provided', () => {
    // SUT = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if no password confirmation is provided', () => {
    // SUT = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_passowrd'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})

describe('Signup Controller', () => {
  test('Should return 400 if invalid email is provided', () => {
    // SUT = system under test
    const { sut, emailValidatorStub } = makeSut()
    // to change the default value to make the test pass and do not interfere the rest
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_passowrd',
        passwordConfirmation: 'any_passowrd'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
