const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, './source/CVE');
const termsToReplace = fs.readFileSync('terme.txt', 'utf8').split('\n').map(term => ({ search: ` ${term}`, replace: ` [[${term}]]` }));

function replaceTermsInFile(file) {
    //console.log(file)
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = data.replaceAll("[[]]","");
        
        
        termsToReplace.forEach(term => {
            console.log(term.search, term.replace)
            result = result.replaceAll(new RegExp(term.search, 'g'), term.replace);
            result = result.replaceAll(new RegExp("("+term.search+")", 'g'), term.replace);
        });
        const regex = /\[\[\w+\]\]\]/g;
        let match;
        while ((match = regex.exec(result)) !== null) {
            const term = match[0].replace(/\[\[\]\]/g, ''); 
            console.log(term)
            if (!termsToReplace.some(t => t.replace === ` [[${term}]]`)) {
                fs.appendFileSync('terme.txt', `${term}\n`, 'utf8');
                termsToReplace.push({ search: ` ${term}`, replace: ` [[${term}]]` }); 
            }
        }
        if (result === data) return; // No changes made, skip writing the file
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath);
        } else if (path.extname(file) === '.md') {
            replaceTermsInFile(filePath);
        }
    });
}

walkDir(directoryPath);


