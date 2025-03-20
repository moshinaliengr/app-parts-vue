
# Application Setup:
Quasar App (app-template), A Diesel Laptops application


## Install the dependencies

Check to make sure you are using the correct node version from the package.json engines section. (version 14.16.0 is also currently working)

```bash
npm install
```

NOTE: make sure NVM is installed as well.

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

you can also use:

```bash
quasar serve dist/spa
```

to "Create an ad-hoc server on App's distributables" according to quasar docs.


### Lint the files

```bash
npm run lint
```

### Build the app for production

```bash
quasar build
```
