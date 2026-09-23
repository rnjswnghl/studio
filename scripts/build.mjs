import {mkdirSync,copyFileSync,cpSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const file of ['index.html','app.js','assets.js','editing.js','styles.css'])copyFileSync(file,'dist/'+file);
for(const dir of ['assets','samples'])cpSync(dir,'dist/'+dir,{recursive:true});
console.log('Static build ready: dist');
