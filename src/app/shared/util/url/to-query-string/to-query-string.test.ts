import { toQueryString } from './to-query-string';

describe('URL:to-query-string', () => {
  test('toQueryString - should return a empty string', () => {
    expect(toQueryString({})).toBe('');
  });

  test('toQueryString - should map dictionary into query string', () => {
    expect(
      toQueryString({
        one: 'two',
        three: 'five',
      }),
    ).toBe('one=two&three=five');

    expect(
      toQueryString({
        one: 'two',
      }),
    ).toBe('one=two');
  });

  test('toQueryString - should support multiple values and map dictionary into query string', () => {
    expect(
      toQueryString({
        one: 'two',
        three: 'five',
        four: ['six', 'seven'],
      }),
    ).toBe('one=two&three=five&four=six&four=seven');

    expect(
      toQueryString({
        one: 'two',
      }),
    ).toBe('one=two');
  });

  test('toQueryString - should filter undefined properties from object', () => {
    const objectToConvert = {
      one: 'two',
      three: 'five',
      four: undefined,
      five: undefined,
    };

    expect(toQueryString(objectToConvert)).toBe('one=two&three=five');

    expect(
      toQueryString({
        one: undefined,
      }),
    ).toBe('');
  });
});
