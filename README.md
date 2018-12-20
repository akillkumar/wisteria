# Wisteria
Static website for Banjaara 2019.

_This document is for developers who want to contribute to the website. If you want to access the site or need information about the event, please head to [banjaara.in](www.banjaara.in)._

## Setup
Clone the repository using Git:
```bash
git clone https://github.com/Banjaara-Ashoka/wisteria.git
cd wisteria
```
Windows users, if you run into trouble due to line endings, then make sure you configure git to checkout the repo with the Unix `lf` line endings. Use the following command to set it up correctly:
```bash
git config --global core.autocrlf true
```
Install all dependencies:
```bash
npm install
```
## Gulp Tasks
We are using gulp to write workflows. For most use cases, you can safely assume that it just works and continue with the development. All gulp tasks are in `gulpfile.js` in the root directory.

Listed below are the ones that you will need the most:
The following task and sets up a development server (port 5566) in the `dev` directory and watches all the files for changes. We are using BrowserSync which supports live reloading and style injection. During development, the this command will _serve_ all of our needs.
```bash
gulp serve:dev
```
Build production files. Runs the stylesheet and javascript optimisation and minification tasks along with the image optimisation task before copying the fonts and the license into the `prod` directory. We can then run a BrowserSync server to see if everything works as intended or run our production server.
```bash
gulp build
```
The following command serves the files from the production directory.
```bash
gulp serve:prod
```
*P.S: BrowserSync comes with a user interface to run tests and throttle network speeds to see how the site behaves on different connection speeds. Go to the port immediately succeeding the one running the server (**5567** or **8081**) to access the UI.*

Project name taken from the list of [Crayola colour names](https://gist.github.com/DeeprajPandey/c25c223a459721067f0dc066fa9b5c37).

## Hosting
We have set up CI with Netlify to run `gulp build` every time there is a new commit on branch `master` and serve the files from the production directory. So, for all practical reasons, you can again assume that it's all taken care of.

## License
[CC BY-NC 4.0 International](https://github.com/Banjaara-Ashoka/wisteria/blob/master/LICENSE)
