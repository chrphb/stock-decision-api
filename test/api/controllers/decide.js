var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('decide controller', function() {

    describe('POST /decide', function() {

      it('should return ignore decision (because of currency)', function(done) {

        let stocks = [];
        stocks.push({ticker:"AAPL", cur:"USD", price: 120.3, value: 300, dailyaverageeuro: 20000});
        let data = {};
        data.stocks = stocks;
        request(server)
          .post('/decide')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            JSON.stringify(res.body).should.eql("[{\"action\":\"ignore\",\"ticker\":\"AAPL\"}]");
            res.body[0].ticker.should.eql("AAPL");
            res.body[0].action.should.eql("ignore");
            done();
          });
      });

      it('should return ignore decision (because of volume)', function(done) {

        let stocks = [];
        stocks.push({ticker:"AAPL", cur:"Euro", price: 120.3, value: 300, dailyaverageeuro: 200});
        let data = {};
        data.stocks = stocks;
        request(server)
          .post('/decide')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body[0].ticker.should.eql("AAPL");
            res.body[0].action.should.eql("ignore");
            done();
          });
      });

      it('should return buy decision', function(done) {

        let stocks = [];
        stocks.push({ticker:"AAPL", cur:"Euro", price: 120.3, value: 300, dailyaverageeuro: 12000});
        let data = {};
        data.stocks = stocks;
        request(server)
          .post('/decide')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body[0].ticker.should.eql("AAPL");
            res.body[0].action.should.eql("buy");
            done();
          });
      });

      it('should return sell decision', function(done) {

        let stocks = [];
        stocks.push({ticker:"AAPL", cur:"Euro", price: 820.3, value: 300, dailyaverageeuro: 12000});
        let data = {};
        data.stocks = stocks;
        request(server)
          .post('/decide')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body[0].ticker.should.eql("AAPL");
            res.body[0].action.should.eql("sell");
            done();
          });
      });

      it('should return wait decision', function(done) {

        let stocks = [];
        stocks.push({ticker:"AAPL", cur:"Euro", price: 180.3, value: 300, dailyaverageeuro: 12000});
        let data = {};
        data.stocks = stocks;
        request(server)
          .post('/decide')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body[0].ticker.should.eql("AAPL");
            res.body[0].action.should.eql("wait");
            done();
          });
      });

    });
  });

});
