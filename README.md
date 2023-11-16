# Multistep Typeform Like Form Template
This is a simple implementation of Working Multi-Step form using Vue, Tailwind CSS & [Web3Forms](https://web3forms).

## How to use

First clone the code to your local system from github.

```bash
git clone https://github.com/surjithctly/vue-multistep-form.git MyProjectName
# or (same folder)
git clone https://github.com/surjithctly/vue-multistep-form.git .
```

Now, Install Node dependencies by installing the following command.

```bash
npm install
# or
yarn
```

Then you can run the development server & watch css using the following steps:

```bash
npm run dev
# or
yarn dev
```
To start a development server, go to `src/index.html` and right click on the page and choose "Open with Live Server". or use the shortcut (`Cmd + L` then `Cmd + O`). Alternatively, you can open the live server from the right top icon on the `index.html` page. You can see a preview pane icon with a search icon.

Now you will get a URL like: `http://127.0.0.1:3000/src/index.html`

Then, you will be able to make changes and you can see it live on the web server.

## Publishing / Deployment

First, run the following command to build your project to `/dist` folder.

```bash
npm run build
# or
yarn build
```

The above command will create a `/dist` folder with all the HTML files & assets from the `/src` folder.

You can use the `/dist` folder to upload to your hosting server.
