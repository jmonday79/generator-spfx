const baseTest = require('../../../tools/test-engine/coreTestDefinition');

const testSuite = new baseTest.TestSuite();

testSuite.name = "KnockoutJS Plus";
testSuite.environment = "onprem19";
testSuite.framework = "knockout.plus";
testSuite.component = {
    componentType: 'webpart'
}

const baseTestCase = new baseTest.BaseTestCase();
const additonalTests = [{
        name: 'Is on-premises 2019?',
        file: baseTest.FileContent.yorc,
        expr: /\"environment\": \"onprem19\"/,
        type: baseTest.TestType.fileContent
    },{
        name: 'KnockoutJS',
        file: baseTest.FileContent.package,
        expr: /knockout/,
        type: baseTest.TestType.fileContent
    }
];

const removeTests = [{
    name: 'No KnockoutJS'
}]

baseTestCase.test = baseTestCase.test.filter(elem => {

    let validTestNames = removeTests.map(elem => {
        return elem.name;
    })

    if (validTestNames.indexOf(elem.name) === -1){
        return elem;
    }

})


baseTestCase.test.push(...additonalTests);

const allTests = new baseTest.TestGenerator(baseTestCase);

testSuite.definitions = allTests.Tests;

module.exports = testSuite;
