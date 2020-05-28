
/**
 * Module dependencies.
 */

var humanize = require('..');

describe('humanize(n, options)', function(){
  it('should delimit thousandths', function(){
    humanize(1000).should.equal('1,000');
    humanize(1000000).should.equal('1,000,000');
    humanize(10500).should.equal('10,500');
  })

  it('should retain fractions', function(){
    humanize(15.99).should.equal('15.99');
    humanize(1500.99).should.equal('1,500.99');
  })

  describe('"delimiter" option', function(){
    it('should change the delimiter', function(){
      humanize(1500, { delimiter: '.' }).should.equal('1.500');
    })
  })

  describe('"separator" option', function(){
    it('should change the separator', function(){
      humanize(15.99, { separator: ',' }).should.equal('15,99');
    })
  })
})