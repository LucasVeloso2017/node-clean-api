import { LogControllerDecorator } from './log-controller-decorator'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve({
      body: {},
      statusCode: 200
    })
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    return Promise.resolve()
  }
}

interface Sut {
  controller: Controller
  sut: Controller
  logErrorRepository: LogErrorRepository
}

const makeSut = (): Sut => {
  const controller = new ControllerStub()
  const logErrorRepository = new LogErrorRepositoryStub()

  const sut = new LogControllerDecorator(
    controller,
    logErrorRepository
  )
  return {
    controller,
    sut,
    logErrorRepository
  }
}

describe('Log Decorator', () => {
  it('should be able to call controller.handle', async () => {
    const { sut, controller } = makeSut()

    const controllerSpy = jest.spyOn(controller, 'handle')

    await sut.handle({
      body: {}
    })

    expect(controllerSpy).toHaveBeenCalledWith({ body: {} })
  })

  it('should be able to return the same  result for controller', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({
      body: {}
    })

    expect(result).toEqual({ body: {}, statusCode: 200 })
  })
  it('should be able to call LogErrorRepository with correct error if controller return server error ', async () => {
    const { sut, controller, logErrorRepository } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any'

    jest.spyOn(controller, 'handle').mockReturnValueOnce(Promise.resolve(serverError(fakeError)))
    const logSpy = jest.spyOn(logErrorRepository, 'logError')

    await sut.handle({
      body: {}
    })

    expect(logSpy).toHaveBeenCalledWith('any')
  })
})
