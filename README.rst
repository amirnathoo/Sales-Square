Ho to build Sales Square
========================

Sales Square is built using `Trigger.io <https://trigger.io>`_, here are the steps to build and test this app on a Mac in the iOS emulator.

The steps to test on Windows / Android are similar and you can find more information here on `Getting started with Trigger.io <http://current-docs.trigger.io/getting-started/index.html>`_.

Install the Trigger.io Toolkit
-------------------------------

1. Install the toolkit from https://trigger.io/forge/toolkit
2. Start the Toolkit and create an account
3. Create a new app and note the app directory

Getting the code
----------------

1. Open a terminal and navigate to your app directory.
2. Copy your identity.json file away and remove the template contents in the src directory:

   * cd src
   * mv identity.json ...
   * rm -rf *

3. Checkout this repository and copy the identity.json file back:

   * git clone https://github.com/amirnathoo/Sales-Square .
   * cd ..
   * mv identity.json src/

Running the app
---------------

1. In the Toolkit, click on the app name to build it. The first time this will take a minute or so, subsequent incremental builds will be very fast.

2. Then click 'iOS' in the Run section of the app page. You'll see the full console output there and the iPhone emulator will start up in a few seconds.

Testing the app
---------------

The app includes photo-taking functionality so to test that in the emulator, you need to have photos pre-loaded. Instructions on how to set that up are here:
http://stackoverflow.com/questions/468879/adding-images-to-iphone-simulator