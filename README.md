This is a simple neural network based ocr experiment.

Training data in ``./letter.data`` is taken from [ai.stanford@btaskar](http://ai.stanford.edu/~btaskar/ocr/)

The process.js file turns the raw training data into a js-friendly format

 - Uses 128 input neurons á 8x16 pixels
 - Uses 125 hidden layers (really not that fine grained)
 - The 7 output layers return a binary encoded letter as the activation result