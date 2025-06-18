const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
//console.log(process.env)
const parser = new Parser();

const rssUrl = 'https://thomas-iniguez-visioli.github.io/nodejs-news-feeder/feed.xml'; // Remplacez par l'URL de votre flux RSS
const PostDir = './source/'; // Répertoire où seront créés les posts Hexo
const parsecontent=(txt,sep,joi)=>{
  return txt.split(sep).map(line => line.trim()).join(joi);
}
const l=(title)=>{
  if( title.includes("bonjourlafuite")){
    return"_posts"
  }else{
    return""
  }
}
parser.parseURL(rssUrl)
  .then(feed => {
    feed.items.forEach(item => {
      const postTitle = item.link.split('/').pop();
      postTitle.split("-")[0].replace("#",'').split(",").map((Dir)=>{
        const yaml = require('js-yaml');
        const configFilePath = './_config.yml';
        const buildFilePath = './build.yml';
        const configContent = fs.readFileSync(configFilePath, 'utf8');
        const config = yaml.load(configContent);
        const buildContent = fs.readFileSync(buildFilePath, 'utf8');
        const build = yaml.load(buildContent);
        if (!config.category_map) {
          config.category_map = [];
        }if(! config.category_map.includes(Dir)){
        config.category_map.push(Dir);}
         if(!fs.existsSync(path.join(PostDir,l(item.link)))){
          fs.mkdirSync(path.join(PostDir,l(item.link)))
        }
        const hexoPostDir= path.join(PostDir,l(item.link),Dir)
        if(!fs.existsSync(hexoPostDir)){
          fs.mkdirSync(hexoPostDir)
        }
      const postFileName = `${postTitle.replace(/ /g, '').replace('\n','').toLowerCase()}.md`;
      const postFilePath = path.join(hexoPostDir, postFileName);
        //console.log(item)
        config.category_map.map((item)=>{
          const catpat=`./category/${item}/index.md`
          if(!fs.existsSync(path.dirname(catpat))){
            fs.mkdirSync(path.dirname(catpat),{recursive:true})
          }
          if(!fs.existsSync(catpat)){
            fs.writeFileSync(catpat,`---\ntitle: ${item}\nlayout: category\n---
              `)
          }
        })
      if (!fs.existsSync(postFilePath)) {
        const postContentHexo = `---
title: ${postTitle.replace("#","")}
date: ${new Date(item.pubDate).getFullYear()}-${new Date(item.pubDate).getMonth()+1}-${new Date(item.pubDate).getDate()}
lien: "${item.link}"

---

${parsecontent(item.contentSnippet,',',"\n")||"pas d'information actuellement"}
`;
tags=config.tags.split(",")
//console.log(parsecontent(item.contentSnippet,',',"\n"))
/*if(parsecontent(item.contentSnippet,',',"\n").length>2){
  parsecontent(item.contentSnippet,',',"\n").split("\n").map((t)=>{tags.push(t)
    console.log(tags)
    tags=[...new Set(tags)]
  })
}*/

config.tags=[...new Set(tags)].join(",")
build.tags=config.tags
const updatedConfigContent = yaml.dump(config);
fs.writeFileSync(configFilePath, updatedConfigContent);
fs.writeFileSync(buildFilePath, yaml.dump(build));
        fs.writeFileSync(postFilePath, postContentHexo);
        //console.log(`Post créé : ${postFileName}`);
      } else {
        //console.log(`Post déjà existant : ${postFileName}`);
      }
    });
  })
  

      })
      

      var sudoku = require('sudoku');
      const t =sudoku.makepuzzle().map((item)=>{
        var puzzle     = sudoku.makepuzzle();
        var solution   = sudoku.solvepuzzle(puzzle);
        var difficulty = sudoku.ratepuzzle(puzzle, 9);
       /* console.log(puzzle)
        console.log(solution)
        console.log(difficulty)*/
        return difficulty
      })
   //console.log(t)
