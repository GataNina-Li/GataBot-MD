"use strict";

var _metadataMin = _interopRequireDefault(require("../metadata.min.json"));

var _PhoneNumber = _interopRequireDefault(require("./PhoneNumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('PhoneNumber', function () {
  it('should validate constructor arguments', function () {
    expect(function () {
      return new _PhoneNumber["default"]();
    }).to["throw"]('`countryCallingCode` not passed');
    expect(function () {
      return new _PhoneNumber["default"]('7');
    }).to["throw"]('`nationalNumber` not passed');
    expect(function () {
      return new _PhoneNumber["default"]('7', '8005553535');
    }).to["throw"]('`metadata` not passed');
  });
  it('should accept country code argument', function () {
    var phoneNumber = new _PhoneNumber["default"]('RU', '8005553535', _metadataMin["default"]);
    phoneNumber.countryCallingCode.should.equal('7');
    phoneNumber.country.should.equal('RU');
    phoneNumber.number.should.equal('+78005553535');
  });
  it('should format number with options', function () {
    var phoneNumber = new _PhoneNumber["default"]('7', '8005553535', _metadataMin["default"]);
    phoneNumber.ext = '123';
    phoneNumber.format('NATIONAL', {
      formatExtension: function formatExtension(number, extension) {
        return "".concat(number, " \u0434\u043E\u0431. ").concat(extension);
      }
    }).should.equal('8 (800) 555-35-35 доб. 123');
  });
  it('should compare phone numbers', function () {
    new _PhoneNumber["default"]('RU', '8005553535', _metadataMin["default"]).isEqual(new _PhoneNumber["default"]('RU', '8005553535', _metadataMin["default"])).should.equal(true);
    new _PhoneNumber["default"]('RU', '8005553535', _metadataMin["default"]).isEqual(new _PhoneNumber["default"]('7', '8005553535', _metadataMin["default"])).should.equal(true);
    new _PhoneNumber["default"]('RU', '8005553535', _metadataMin["default"]).isEqual(new _PhoneNumber["default"]('RU', '8005553536', _metadataMin["default"])).should.equal(false);
  });
  it('should tell if a number is non-geographic', function () {
    new _PhoneNumber["default"]('7', '8005553535', _metadataMin["default"]).isNonGeographic().should.equal(false);
    new _PhoneNumber["default"]('870', '773111632', _metadataMin["default"]).isNonGeographic().should.equal(true);
  });
  it('should allow setting extension', function () {
    var phoneNumber = new _PhoneNumber["default"]('1', '2133734253', _metadataMin["default"]);
    phoneNumber.setExt('1234');
    phoneNumber.ext.should.equal('1234');
    phoneNumber.formatNational().should.equal('(213) 373-4253 ext. 1234');
  });
});
//# sourceMappingURL=PhoneNumber.test.js.map