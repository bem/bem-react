module.exports = {
  title: 'BEM React',
  tagline: 'A set of tools for developing user interfaces using the BEM methodology in React',
  url: 'https://bem.github.io',
  baseUrl: '/bem-react/',
  favicon: 'img/favicon.ico',
  organizationName: 'bem',
  projectName: 'bem-react',
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: 'BEM React',
      logo: {
        alt: 'bem react Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/introduction/installation', label: 'Docs', position: 'left' },
        { to: 'docs/api/core/core', label: 'API', position: 'left' },
        {
          href: 'https://github.com/bem/bem-react',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get started',
              to: 'docs/introduction/installation',
            },
            {
              label: 'API',
              to: 'docs/api/core/core',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/bem_ru',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'BEM Info',
              href: 'https://bem.info',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/bem/bem-react',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BEM`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/bem/bem-react/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
