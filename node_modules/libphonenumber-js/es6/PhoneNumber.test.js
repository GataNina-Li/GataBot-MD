import metadata from '../metadata.min.json' assert { type: 'json' };
import PhoneNumber from './PhoneNumber.js';
describe('PhoneNumber', function () {
  it('should validate constructor arguments', function () {
    expect(function () {
      return new PhoneNumber();
    }).to["throw"]('`countryCallingCode` not passed');
    expect(function () {
      return new PhoneNumber('7');
    }).to["throw"]('`nationalNumber` not passed');
    expect(function () {
      return new PhoneNumber('7', '8005553535');
    }).to["throw"]('`metadata` not passed');
  });
  it('should accept country code argument', function () {
    var phoneNumber = new PhoneNumber('RU', '8005553535', metadata);
    phoneNumber.countryCallingCode.should.equal('7');
    phoneNumber.country.should.equal('RU');
    phoneNumber.number.should.equal('+78005553535');
  });
  it('should format number with options', function () {
    var phoneNumber = new PhoneNumber('7', '8005553535', metadata);
    phoneNumber.ext = '123';
    phoneNumber.format('NATIONAL', {
      formatExtension: function formatExtension(number, extension) {
        return "".concat(number, " \u0434\u043E\u0431. ").concat(extension);
      }
    }).should.equal('8 (800) 555-35-35 доб. 123');
  });
  it('should compare phone numbers', function () {
    new PhoneNumber('RU', '8005553535', metadata).isEqual(new PhoneNumber('RU', '8005553535', metadata)).should.equal(true);
    new PhoneNumber('RU', '8005553535', metadata).isEqual(new PhoneNumber('7', '8005553535', metadata)).should.equal(true);
    new PhoneNumber('RU', '8005553535', metadata).isEqual(new PhoneNumber('RU', '8005553536', metadata)).should.equal(false);
  });
  it('should tell if a number is non-geographic', function () {
    new PhoneNumber('7', '8005553535', metadata).isNonGeographic().should.equal(false);
    new PhoneNumber('870', '773111632', metadata).isNonGeographic().should.equal(true);
  });
  it('should allow setting extension', function () {
    var phoneNumber = new PhoneNumber('1', '2133734253', metadata);
    phoneNumber.setExt('1234');
    phoneNumber.ext.should.equal('1234');
    phoneNumber.formatNational().should.equal('(213) 373-4253 ext. 1234');
  });
});
//# sourceMappingURL=PhoneNumber.test.js.map