/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4'
        },
        resolutions: {
          'ember': 'lts-2-4'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8'
        },
        resolutions: {
          'ember': 'lts-2-8'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': 'components/ember#release',
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'components/ember#beta',
        }
      }
    },
    {
      name: 'ember-canary',
      npm: {
        devDependencies: {
          'ember-source': 'components/ember#canary',
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
