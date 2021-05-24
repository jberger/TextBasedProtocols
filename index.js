import mojo from '@mojojs/mojo';

const app = mojo();

const reveal = app.home.child('node_modules', 'reveal.js').toString();
app.static.publicPaths.push(reveal);

app.get('/', ctx => ctx.sendFile(app.home.child('index.html')));

app.start();
