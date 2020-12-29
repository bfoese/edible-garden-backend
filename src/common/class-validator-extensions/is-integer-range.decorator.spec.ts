import { validate, ValidationError } from 'class-validator';
import { IsIntegerRange } from './is-integer-range.decorator';

describe('IsIntegerRange class-validator extension', () => {
  class Foo {
    public constructor(bar: string) {
      this.bar = bar;
    }
    @IsIntegerRange()
    public bar: string;
  }

  describe('IsIntegerRange() Decorator', () => {
    it('should allow empty', async () => {
      await validate(new Foo('')).then((validationResult) => expect(validationResult).toEqual([]));
    }),
      it('should match [-7,8987]', async () => {
        await validate(new Foo('[-7,8987]')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should match (7,-8987)', async () => {
        await validate(new Foo('(7,-8987)')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should match [-98798,1)', async () => {
        await validate(new Foo('[-98798,1)')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should match (1,-98798]', async () => {
        await validate(new Foo('(1,-98798]')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should match (,-98798]', async () => {
        await validate(new Foo('(,-98798]')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should match (1,]', async () => {
        await validate(new Foo('(1,]')).then((validationResult) => expect(validationResult).toEqual([]));
      }),
      it('should not match with characters or whitespace around or in between', async () => {
        await validate(new Foo('foo(1,1)')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
        await validate(new Foo('(1,1)foo')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
        await validate(new Foo('(1,1) ')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
        await validate(new Foo(' (1,1)')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
        await validate(new Foo('(1, 1)')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
        await validate(new Foo('(1 ,1)')).then((validationResult) =>
          expect((<ValidationError>validationResult[0]).property).toEqual('bar')
        );
      });
  });
});
