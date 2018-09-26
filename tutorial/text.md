# Getting Started with Progressive Web Apps

## What makes a web app _progressive_?

Progressive web apps are apps that are reliable, fast, and engaging.

#### Reliable: Load instantly and never show the dinosaur, even in uncertain network conditions.

When launched from the user’s home screen, service workers enable a Progressive Web App to load instantly, regardless of the network state.

A service worker, written in JavaScript, is like a client-side proxy and puts you in control of the cache and how to respond to resource requests. By pre-caching key resources you can eliminate the dependence on the network, ensuring an instant and reliable experience for your users.

#### Fast: Respond quickly to user interactions with silky smooth animations and no janky scrolling.

We want users to interact meaningfully with what we build for the web. If it's a blog, we want people to read posts. If it's an online store, we want to turn prospective shoppers into buyers. If it's a social networking web app, we want visitors to write posts, upload photos, and interact with one other.

Performance plays a significant role in the success of any online venture, as high performing sites engage and retain users better than poorly performing ones.

To get you started on creating fast web apps, here are three things to think about.

1. Mind what resources you send,
2. Mind how you send resources, and
3. Mind how much data you send.

#### Engaging: Feel like a natural app on the device, with an immersive user experience.

Progressive Web Apps are capable of being installed and live on the user's home screen, without the need for an app store. They offer an immersive full screen experience with help from a web app manifest file and can even re-engage users with web push notifications.

The Web App Manifest allows you to control how your app appears and how it's launched. You can specify home screen icons, the page to load when the app is launched, screen orientation, and even whether or not to show the browser chrome.

## Baseline Progressive Web App Checklist

Google provides a great checklist of all the things it take for an app to be a [**Baseline**](https://developers.google.com/web/progressive-web-apps/checklist#baseline) PWA and how to take that a step further with an [**Exemplary**](https://developers.google.com/web/progressive-web-apps/checklist#exemplary) PWA by providing a more meaningful offline experience, reaching interactive even faster and taking care of many more important details.

Now let's see the how to turn a Web App into a PWA.
The app we will build below allows the user to search for podcasts using the [iTunes api](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/).

insert gif of finished product

## Step 0 - setup a regular web app

**Create an app.js, styles.css, and index.html:**

```js
touch index.html, app.js, styles.css
```

**index.html**
Populate with a blank html template, enter a title, link a styles.css, and add the following to the body tag:

```html
<body>
  <header>
    <h1>Podcasts</h1>
    <div class="search">
      <input type="text">
      <button>Search</button>
    </div>
  </header>
  <main></main>
  <script src="./app.js"></script>
</body>
```

**app.js**
To get our basic web app started:

1. Get a reference to the main document so we can add our results.
2. Get a reference to the text input and button so we can see what the user typed in as the search and register and click listener.
3. Create a function that will take a podcast from the json and will return a template string to render the podcast in the html
4. Then create a function that will go through json and the podcast data and then map them to our `createPodcastResult` function that creates the html podcasts. The html should be mounted onto `main.innerHTML`.
5. Lastly, register a click listener on the button that will invoke the `updatePodcasts()` function. Pass the function the search term the user is searching from `search.value`.

```js
const main = document.querySelector('main');
const search = document.querySelector('input');
const button = document.querySelector('button');

const createPodcastResult = podcast => {
  return `
      <div class="podcast">
        <img src="${podcast.artworkUrl100}" />
        <div>
          <h3>${podcast.collectionName}</h2>
          <div><b>Artist</b> ${podcast.artistName}</div>
          <div><b>Tracks</b> ${podcast.trackCount}</div>
        </div>
      </div>`;
};

const updatePodcasts = async searchTerm => {
  const res = await fetch(
    `https://itunes.apple.com/search?key=podcast&term=${searchTerm}`
  );
  const json = await res.json();

  main.innerHTML = json.results.map(createPodcastResult).join('\n');
};

button.addEventListener('click', e => {
  updatePodcasts(search.value);
});

search.addEventListener('keypress', e => {
  var key = e.which || e.keyCode;
  if (key === 13) {
    // 13 is enter
    updatePodcasts(search.value);
  }
});
```

**Use an npm library like http-server to serve up your files**

```
npm install http-server -g
http-server
```

Now you can visit http://localhost:8080 to view your server

### You should have a functional web app at this point - but there is nothing progressive about it. Let's look at how to make this app progressive.

There are two main steps to turning a plain web app into a Progressive Web App

1. adding a Web App Manifest
2. adding a ServiceWorker.

## Step 1 - Web App Manifest

The manifest is just a json file that collects info about your application into one config file. It describes the application, its colors and icons. We also define which URL (relative to the URL the app is loaded from) should be opened if the application is installed to a device.

We can generate a manifest using this [generator](https://app-manifest.firebaseapp.com/).

Once you have the manifest file in your project folder, you just need to add a link to it in the `head` of html file and then the application picks up our manifest.

![Web App Manifest Generator](https://gyazo.com/679c76ffb65c3ff9defcc38abdf67a6a)
Fill in the placeholders and upload an image to generate icons, then download the zip file.

Before linking the manifest, the manifest wasn't detected in the chrome dev tools Applications tab. If you visit it again, after linking the manifest, you should see it detected with all the parameters and icons we defined.

before: https://gyazo.com/fe97fdd5d721daa5ba1dfc2d71482da8

now: https://gyazo.com/e679b7134dbb94a10f387800fb53147d

```html
  <link rel="manifest" href="./manifest.json" />
```

## Step 2 - Service Worker

We still need to add a Service Worker, in addition to the App Manifest, in order for the browser to know that this app is a progressive web app and can offer to the user to install it on the home screen.

**What is a service worker?**

- Service workers are a proxy that sits inside the browser, but it's controlled by JS. So you tell the SW to run a java script and what that script does is takes the files that you need and pout it in a special cache. Not the browser cache, because that doesn't work when your offline. This is a new additional cache that you control. Completely flexible and under your control: you can control the lifetime, the file times that go into it, and the size. There are tools to help manage this cache.

- Service workers are a type of web worker, an object that executes a script separately from the main browser thread. Service workers run independent of the application they are associated with and can receive messages when not active (either because your application is in the background or not open, or the browser is closed).

  The primary uses for a service workers are:

  Act as a caching agent to handle network requests and store content for offline use.
  Handle push messaging

  The service worker becomes idle when not in use, and restarts when it's next needed. If there is information that you need to persist and reuse across restarts, then service workers can work with IndexedDB databases.

  Service workers are promise based. At a high level, a promise is an object that is used as a placeholder for the eventual results of a deferred (and possibly asynchronous) computation.

- in a web application, if you don't have a SW, you go straight to the server. If you do have a SW, you go through the service worker. When you make a request, the SW intercepts it, gets a response from the network first and puts a copy in the cache. The next time it gets this request, it cuts out the network and sends the data from cache.
  https://gyazo.com/cfe06cf0808505aad97096f6f7759ef1

**Registering the Service Worker in your app.js**
In the root of your application, create a file sw.js. You can leave it empty for now.

1. Register the service worker file in our `app.js` `load` event listener. To make sure we have support for this we wrap the registration in a `try/catch`.
2. The service worker file should be in the root of your application.

```js
window.addEventListener('load', e => {
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
      console.log('Service Worker registered');
    }
  } catch (error) {
    console.log('Service Worker registration failed', error.message);
    alert('Offline not supported');
  }
});
```

Reload your browser and switch to the _ServiceWorker_ section of the _Application_ tab in DevTools. You should see your service worker listed.

To make our lives easier while developing, check "Update on reload". Normally, a new ServiceWorker is only loaded once all tabs using it have been closed, so we would not get our new version visible by just refreshing the page while developing otherwise. https://gyazo.com/3db4751050c0977f4bd4c1874f4e217d

Google has a tool called [Workbox](https://developers.google.com/web/tools/workbox/) to help us build production ready Service Workers. Workbox is a library that bakes in a set of best practices and removes the boilerplate every developer writes when working with service workers.

To use Workbox, turn this into a npm project
`npm init -y`

Then install the workbox npm library

```js
npm i --save workbox-sw
```

**What can service workers do?**

Service workers enable applications to control network requests, cache those requests to improve performance and provide offline access to cached content so user have an app that works even when their network doesn't.

- To start using Workbox you just need to import the `workbox-sw.js` file in your service worker. When supplying the path for workbox - use the dev version for help with debugging during development.
- Pre-cache Assets During Installation (/Caching and serving static assets): If you have assets (HTML, CSS, JavaScript, images) that are shared across your application you can cache them when you first install the service worker in the client’s browser, during the install process, so we can have a fast start up time of the application and serve at least something when the user is offline. This technique is at the core of the Application Shell Architecture. If you load the website and go the cache you will see the files for the application shell there. If we go into 'offline' mode and 'refresh' - (not a hard refresh- that will clear the cache) we can see the application shell still shows up. https://gyazo.com/c8d91563dff7b183567e68fbd5f6984e https://gyazo.com/fd9177313a223c8af4712574531747e4
- cache the calls being made to the iTunes api using `networkFirst()` strategy
- For images use a `cacheFirst()` strategy and additional parameters. Keep a max of 20 entries for 20 hours at most, and save only on a response of 0 - 200. This is a great way to keep the size of our cache manageable on our users devices.

```js
importScripts('./node_modules/workbox-sw/build/workbox-sw.js');

const staticAssets = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './fallback.json',
  './images/icons/icon_96x96.png'
];

if (workbox) {
  workbox.precaching.precacheAndRoute(staticAssets);
}

workbox.routing.registerRoute(
  new RegExp('https://itunes.apple.com/(.*)'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /.*\.(png|jpg|jpeg|gif)/,
  workbox.strategies.cacheFirst({
    cacheName: 'podcasts-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 12 * 60 * 60,
        maxEntries: 20
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ],
    cacheableResponse: { statuses: [0, 200] }
  })
);
```

![https://gyazo.com/c35109a312085c2303ddf207ed86bab1](https://gyazo.com/c35109a312085c2303ddf207ed86bab1)

## So how can you get started with Progressive Web Apps?

The technologies can be intimidating. Do you have to convince your team to do a complete overhaul? The short answer is definitely no.

It can be complex to introduce new technologies, especially at larger companies with complex organizational structures and sites with legacy code and architecture.

Think about this as an ongoing journey to invest and build on the Web.

https://gyazo.com/307b2bf244c764d05c1c23d49fcf9ddd

**Start from the ground up**
Sometimes a site is about to go through a redesign, so starting from scratch makes sense.

This enables you much more easily to build in Progressive Web App design patterns — in particular, to take advantage of all the power of Service Workers.

**Build a simple version**
Starting from scratch is often times not realistic.

Another approach is to build a simple version of site, for example to improve on a specific section or user journey.

**Build a single feature**
Another strategy is to define a specific feature to test.
Pick one thing that you can have high impact.
This is likely to be the case at really large companies.

### Credits

- [developers.google.com](https://developers.google.com/web/progressive-web-apps/)
- [PWA Training Course with Sarah Clark](https://www.youtube.com/playlist?list=PLlyCyjh2pUe9RHFCJHU0kxpaivUzADPYk) This playlist is complete with the 'why' and the 'how' of PWA's
- [Progressive Web App tutorial – learn to build a PWA from scratch](https://youtu.be/gcx-3qi7t7c) This example explains the concept of the `networkFirst` method really well in just plain javascript.
