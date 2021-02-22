import { Address } from '@eg-domain/shared/adress';

export class AddressMockFactory {
  public static createDefault(): Address {
    const mockedAdress: Address = new Address();

    mockedAdress.line1 = 'Loiblpassstraße';
    mockedAdress.city = 'Klagenfurt';
    mockedAdress.countryCode = 'AT';
    mockedAdress.postalCode = '98765';
    return mockedAdress;
  }

  public static createAlternate(): Address {
    const mockedAdress: Address = new Address();

    mockedAdress.line1 = 'Wolfgangseestraße';
    mockedAdress.city = 'Salzburg';
    mockedAdress.countryCode = 'AT';
    mockedAdress.postalCode = '5072';
    return mockedAdress;
  }
}
