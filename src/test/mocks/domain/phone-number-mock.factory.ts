import { PhoneNumber } from '@eg-domain/shared/phone-number';

export class PhoneNumberMockFactory {
  public static createDefault(): PhoneNumber {
    const phoneNumber: PhoneNumber = new PhoneNumber();

    phoneNumber.phoneNo = '123456789';
    phoneNumber.countryCode = 43;
    return phoneNumber;
  }

  public static createAlternate(): PhoneNumber {
    const phoneNumber: PhoneNumber = new PhoneNumber();

    phoneNumber.phoneNo = '987654321';
    phoneNumber.countryCode = 43;
    return phoneNumber;
  }
}
