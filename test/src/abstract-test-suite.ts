import { INestApplication, Inject, Injectable } from '@nestjs/common'
import * as request from 'supertest'
import { TestTokens } from './providers/test-tokens.service'

@Injectable()
export abstract class AbstractTestSuite {
  private app: INestApplication

  @Inject()
  protected readonly testTokens: TestTokens

  public setApp(app: INestApplication) {
    this.app = app
  }

  public httpGet(path: string) {
    return request(this.app.getHttpServer()).get(`${path}`)
  }

  public httpPut(path: string) {
    return request(this.app.getHttpServer()).put(`${path}`)
  }

  public httpPost(path: string) {
    return request(this.app.getHttpServer()).post(`${path}`)
  }

  public httpTokenPut(path: string, token: string) {
    return this.httpPut(path).set('Authorization', `Bearer ${token}`)
  }

  public httpTokenPost(path: string, token: string) {
    return this.httpPost(path).set('Authorization', `Bearer ${token}`)
  }

  public httpTokenGet(path: string, token: string) {
    return this.httpGet(path).set('Authorization', `Bearer ${token}`)
  }

  public httpArtistPut(path: string) {
    return this.httpTokenPut(path, this.testTokens.artistToken)
  }

  public httpArtistPost(path: string) {
    return this.httpTokenPost(path, this.testTokens.artistToken)
  }

  public httpArtistGet(path: string) {
    return this.httpTokenGet(path, this.testTokens.artistToken)
  }


  public httpContentCreatorPost(path: string) {
    return this.httpTokenPost(path, this.testTokens.contentCreatorToken)
  }

}
