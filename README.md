# jwt-presentation
JSON Web Token Presentation for OgdenJS

This was a short presentation to discuss how JWTs can be used on the web and on the server. On the client
side, it is just raw javascript, and on the server side, there is a PHP and a Python example. 

## Requirements
* [PHP](http://www.php.net/) 
* [Composer](https://getcomposer.org/)
* [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
* [Bower](http://bower.io/)
* [Python 3](https://www.python.org/) (optional)

## To install

1. Clone this repo
2. Run `bower install` to install the javascript libraries used (impress.js).
3. Run `composer install` to install the php libraries used (firebase JWT).
4. Run `pip install -r requirements.txt` to install the python libraries used (Jose JWT).

## To run

1. Serve the files locally `php -S localhost:8080`
2. (optionally) Start the python server `python3 api/verifyToken.py`
3. Browse the application (http://localhost:8080)
