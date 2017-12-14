/* global describe, it, before */

// import chai from 'chai';

import printo from '../src/printo.js';
import obj from './obj.js';

// chai.expect();

// const expect = chai.expect;

// describe('Testing function', () => {

//   describe('importing module', () => {
//     it('default import', () => {
//       expect(typeof printo).to.be.equal('function');
//     });
//   });

// });


console.log(JSON.stringify(printo(obj, false, true, 9), null, 2));

console.log(JSON.stringify(printo("Text"), null, 2));

console.log(JSON.stringify(printo(null), null, 2));