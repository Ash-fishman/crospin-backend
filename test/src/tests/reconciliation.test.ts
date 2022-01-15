import { HttpStatus } from '@nestjs/common'
import { Test, TestSuite } from '../../helpers/decorators'
import { AbstractTestSuite } from '../abstract-test-suite'
import { v4 as uuidv4 } from 'uuid'
import * as expect from 'expect'
@TestSuite('Reconciliation Suite')
export class ReconciliationTest extends AbstractTestSuite {

  @Test('Artist uploads audio')
  public async artistUploadsAudioTest(): Promise<string> {
    const filename = `${uuidv4()}-audio.mp3`
    await this.httpArtistPost('/reconciliation/upload/audio')
      .attach('audio', './test/src/tests/resources/audio.mp3', { filename })
      .expect(HttpStatus.CREATED)
    return filename
  }

  @Test('Artist uploads contract')
  public async artistUploadsContractTest() {
    const filename = `${uuidv4()}-contract.pdf`
    await this.httpArtistPost('/reconciliation/upload/contract')
      .attach('contract', './test/src/tests/resources/contract.pdf', { filename })
      .expect(HttpStatus.CREATED)
  }

  @Test('Artist list audios')
  public async artistListAudios() {
    const [audio1, audio2] = await Promise.all([this.artistUploadsAudioTest(), this.artistUploadsAudioTest()])

    const { body: { audios: nofilter } } = await this.httpArtistGet('/reconciliation/list/audios')
      .expect(HttpStatus.OK)

    expect(nofilter.length).toBeGreaterThan(1)
    expect(nofilter.filter(a => a.originalFileName === audio1).length).toBe(1)
    expect(nofilter.filter(a => a.originalFileName === audio2).length).toBe(1)

    const { body: { audios: filter } } = await this.httpArtistGet('/reconciliation/list/audios')
      .query({ name: audio1 })
      .expect(HttpStatus.OK)

    expect(filter.length).toBe(1)
    expect(filter.filter(a => a.originalFileName === audio1).length).toBe(1)
    expect(filter.filter(a => a.originalFileName === audio2).length).toBe(0)
  }
}
