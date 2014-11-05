var FastBill = require('./../lib/fastbill');
var testConf = require('./../testConf');
var expect = require("expect.js");

if (!testConf.user || !testConf.apiKey) {
    console.error('Please fill out testConf.json with your credentials to run this test!');
    return;
}

var fastBill = new FastBill(testConf);

describe('lib test', function () {
    it('should respond with an empty array for non existing customer', function (done) {
        fastBill.get('customer', {
            FILTER: {
                CUSTOMER_ID: '99999999'
            },
            LIMIT: 1
        }, function (err, res) {
            expect(err).to.be(null);
            expect(res.length).to.be(0);
            done();
        });
    });

    it('should respond with an access error if given wrong credentials', function(done) {
        var wrongFastBill = new FastBill({ user: null, apiKey: null });
        wrongFastBill.get('customer', {
            FILTER: {
                CUSTOMER_ID: '99999999'
            },
            LIMIT: 1
        }, function (err, res) {
            expect(err).not.to.be(null);
            done();
        });
    });

    it('should create a customer, get it back, update it and delete it', function (done) {
        fastBill.create('customer', {
            FIRST_NAME: 'Jeffrey',
            LAST_NAME: 'Clarke', // required
            EMAIL: 'JeffreyWClarke@einrot.com',
            CUSTOMER_TYPE: 'business', // required
            ORGANIZATION: 'Envirotecture Design', // required when CUSTOMER_TYPE == 'business'
            COUNTRY_CODE: 'US',
            ADDRESS: '2711 Sycamore Road',
            CITY: 'Coos Bay',
            ZIPCODE: '97420'
        }, function (err, res) {
            expect(err).to.be(null);
            expect(res.STATUS).to.be('success');
            expect(res.CUSTOMER_ID).to.be.ok();
            var customerId = res.CUSTOMER_ID;
            fastBill.get('customer', {
                FILTER: {
                    CUSTOMER_ID: customerId
                },
                LIMIT: 1
            }, function (err, res) {
                expect(err).to.be(null);
                expect(parseInt(res[0].CUSTOMER_ID)).to.be(parseInt(customerId));
                fastBill.getOne('customer', { FILTER: { CUSTOMER_ID: customerId } }, function (err, res) {
                    expect(err).to.be(null);
                    expect(parseInt(res.CUSTOMER_ID)).to.be(parseInt(customerId));
                    var email = 'somerandomemail@somenewrandomprovider.com';
                    fastBill.update('customer', customerId, {
                        EMAIL: email
                    }, function (err, res) {
                        expect(err).to.be(null);
                        expect(res.STATUS).to.be('success');
                        fastBill.del('customer', customerId, function (err, res) {
                            expect(res.STATUS).to.be('success');
                            done();
                        });
                    });
                });
            });
        });
    });
});



