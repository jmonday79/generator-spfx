"use strict";

// Base Yeoman generator
const Generator = require('yeoman-generator');

// filesystem
const fs = require('fs');

// importing utilities
const util = require('../lib/util.js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    // Initialisation geenerator
    initializing() {

    }

    // Prompt for user input for Custom Generator
    prompting() {

    }

    // adds additonal editor support in this case CSS Comb
    configuring() {

    }


    writing() {
    }

    install() {
        this._deployFiles();
        this._addExternals();
        this._addPackageDependencies();
        this._injectToGulpFile();
        util.runInstall(this);
    }

    // Run installer normally time to say goodbye
    // If yarn is installed yarn will be used
    end() {}

    _deployFiles() {

        this.fs.copy(
            this.templatePath('config/copy-static-assets.js'),
            this.destinationPath('config/copy-static-assets.js')
        )

    }

    _addExternals() {

        // reading JSON
        let config = this.fs.readJSON(this.destinationPath('config/config.json'));

        // Add Handlebars entry
        config.externals.handlebars = "./node_modules/handlebars/dist/handlebars.amd.min.js";

        // writing json
        fs.writeFileSync(
            this.destinationPath('config/config.json'),
            JSON.stringify(config, null, 2)
        );

    }

    _addPackageDependencies() {

        if (fs.existsSync(this.destinationPath('package.json'))) {

            let config = JSON.parse(fs.readFileSync(
                this.destinationPath('package.json')
            ));

            // request current addon configuration
            let addonConfig;

            try {
                addonConfig = JSON.parse(
                    fs.readFileSync(
                        this.templatePath('addonConfig.json')
                    )
                )
            } catch (err) {

                throw err;

            }

            let requestedLibraries = ['handlebars'];

            let newPkgConfig = util.mergeAddons(addonConfig, requestedLibraries, config);

            fs.writeFileSync(
                this.destinationPath('package.json'),
                JSON.stringify(newPkgConfig, null, 2)
            );

        }
    }

    _injectToGulpFile() {

        if (fs.existsSync(this.destinationPath('gulpfile.js'))) {

            let templateFile = fs.readFileSync(
                this.templatePath('./gulpfile.js'),
                'utf-8'
            );

            let coreGulpTemplate = this.templatePath('../../../app/templates/gulpfile.js');
            let customGulpTemplate = this.templatePath('./gulpfile.js')

            let mergedGulpFile = util.composeGulpFile(coreGulpTemplate, customGulpTemplate);

            fs.writeFileSync(this.destinationPath('./gulpfile.js'), mergedGulpFile, 'utf-8');

        }

    }

}