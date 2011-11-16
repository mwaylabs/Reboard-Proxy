This is the reverse proxy framework for Reboard
===============================================

Reboard
-------

[Reboard](http://reboard.net/) is THE all-embracing solution for your Mobile Business Intelligence.

The proxy
---------

The proxy is a easy to configure software written in [Node.js](http://nodejs.org).

Needed Plugins:
---------------
  
  * connect (HTTP Middleware)
  * mime (Needed by connect)
  * qs (Needed by connect)
  * wwwdude (HTTP client library)
  * log4js (Logging)

Install Reboard Proxy
---------------------

To install the software, you just need to clone our git repository:

    git clone https://github.com/mwaylabs/Reboard-Proxy.git

Dependencies
------------

Install them with
    
    npm install connect log4js wwwdude
  
Or just install them locally with npm 1.0

    npm install .


If you don't want to use npm, check out the git submodule:

    git submodule update --init

Configuration
-------------

The configuration is located in conf/mcaplight.json. A working example would be:

    {
      "server": "http://url.to.server/mobile.biex",
      "port": 8080,
      "sslport": 8443,
      "loglevel": "INFO"
    }

Reboard-Proxy is configured to listen for HTTP on port 8080 and for HTTPS on port 8443. If you wish to use other ports, use the "port" and "sslport" options to configure them.

### Log Levels

If you want to configure the log levels to control the amount of messages, edit the loglevel option of your configuration file. Valid levels are:

* ALL
* DEBUG
* TRACE
* INFO
* WARN
* ERROR
* OFF

Run the proxy server
--------------------

If you have Node.js installed, you can run the proxy server via:

    node mcaplight.js

Additionally, we integrate a git submodule with pre-built Node.js binaries. There is a runner script located in ./bin which chooses the right binary for you. To run mCAP Light this way, you need to enter the following comman:

    ./bin/mcaprunner.sh

HTTPS Support
-------------

Reboard-Proxy supports HTTPS. To enable SSL/TLS supprt, you need to generate a PEM certificate, put it into the cert folder and name it server.pem. If the certificate is valid, HTTPS will be enabled autmatically. The port can be changed with the sslport option in the server config.

You can generate a self signed SSL certificate with the [openssl commandline utility](http://www.openssl.org/docs/HOWTO/certificates.txt):

    openssl req -new -x509 -keyout cert/server.pem -out cert/server.pem -days 365 -nodes

After answering the questions, a newly generated certificate should be located in your cert directory.


LICENSE
-------

Reboard-Proxy is licensed under the GPLv3. For more info, have a look at the [LICENSE file](https://github.com/mwaylabs/Reboard-Proxy/blob/master/LICENSE).
