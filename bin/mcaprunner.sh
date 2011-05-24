#!/bin/bash -e

cd `dirname $0`
cd ..

case `uname -a` in
  Linux*x86_64*)  echo "Linux 64 bit"   
    support/node-builds/node-linux64 mcaplight.js

    ;;

  Linux*i686*)  echo "Linux 32 bit"   
    support/node-builds/node-linux32 mcaplight.js
    ;;

  Darwin*)  echo  "OSX"
    support/node-builds/node-darwin mcaplight.js
    ;;

  CYGWIN*)  echo  "Cygwin"
    support/node-builds/node-cygwin.exe mcaplight.js
    ;;

  MING*)  echo  "MingW"
    support/node-builds/node-cygwin.exe mcaplight.js
    ;;    

  SunOS*)  echo  "Solaris"
    support/node-builds/node-sunos mcaplight.js
    ;;


  *) echo "Unknown OS"
    ;;
esac

