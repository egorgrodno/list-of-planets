import { AppendNumPipe } from './append-num.pipe';

describe('AppendNumPipe', () => {
  it('create an instance', () => {
    const pipe = new AppendNumPipe();
    expect(pipe).toBeTruthy();
  });
});
