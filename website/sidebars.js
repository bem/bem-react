module.exports = {
  docs: {
    Introduction: ['introduction/installation'],
    Guides: ['guides/naming', 'guides/structure', 'guides/lazy', 'guides/experiments'],
  },
  api: {
    '@bem-react/core': ['api/core/core', 'api/core/compose'],
    '@bem-react/di': ['api/di/di-api'],
    '@bem-react/classname': [
      'api/classname/classname-api',
      'api/classname/cn',
      'api/classname/withNaming',
      'api/classname/Preset',
      'api/classname/ClassNameInitilizer',
      'api/classname/ClassNameFormatter',
    ],
    '@bem-react/classnames': ['api/classnames/classnames-api', 'api/classnames/classnames'],
  },
}
