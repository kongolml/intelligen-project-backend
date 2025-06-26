import express from 'express';
import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';
import { importPortfolioItems, createMediaFilesFromUrls } from './helpers/import.js';

const port = process.env.PORT || 3000;

const start = async () => {
  const app = express();
console.log("start1")
  await initializeDb();

  const admin = new AdminJS(options);

  console.log('123123')
  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET,
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    },
  );

  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`AdminJS available12312312 at http://localhost:${port}${admin.options.rootPath}`);

    // importPortfolioItems().finally(() => {
    //   console.log("import stopped")
    // })

    // createMediaFilesFromUrls("http://intelligent-project.com/wp-content/uploads/identity_akvamarket_02.png", "685da26803d798b6ff386475")
  });
};

start();
