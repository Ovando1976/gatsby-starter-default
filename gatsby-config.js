// gatsby-config.js

module.exports = {
    siteMetadata: {
      title: `USVIexplorer`,
      description: `Discover the best of USVI with our AI-powered social platform.`,
      author: `@yourusername`,
    },
    plugins: [
      `gatsby-plugin-postcss`,
      `gatsby-transformer-remark`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `posts`,
          path: `${__dirname}/posts`,
        },
      },
      // Add other plugins as needed
    ],
  };