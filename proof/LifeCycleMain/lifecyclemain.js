const { findComponents, createUseEffects } = require('./lifecycleUtils');

const { str0, str1, str2, str3, str4, str5 } = require('../utils/exampleClass');

const utilObject = findComponents(str2);

console.log(createUseEffects(utilObject));
