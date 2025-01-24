const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

const parser = new Parser();

const rssUrl = 'https://thomas-iniguez-visioli.github.io/nodejs-news-feeder/feed.xml'; // Remplacez par l'URL de votre flux RSS
const hexoPostDir = './source/_posts'; // Répertoire où seront créés les posts Hexo

parser.parseURL(rssUrl)
  .then(feed => {
    feed.items.forEach(item => {
      const postTitle = item.link.split('/').pop();

      const postFileName = `${postTitle.replace(/ /g, '').replace('\n','').toLowerCase()}.md`;
      const postFilePath = path.join(hexoPostDir, postFileName);
        console.log(item)
      if (!fs.existsSync(postFilePath)) {
        const postContentHexo = `---
title: ${postTitle.replace("#",'')}
---
${item.contentSnippet.replace(",","\n").replace(",","\n").replace(",","\n").replace(",","\n").replace(",","\n")}
`;

        fs.writeFileSync(postFilePath, postContentHexo);
        console.log(`Post créé : ${postFileName}`);
      } else {
        console.log(`Post déjà existant : ${postFileName}`);
      }
    });
  })
  .catch(error => {
    console.error(error);
  });


