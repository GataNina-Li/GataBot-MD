get-pixels
==========
Given a URL/path, grab all the pixels in an image and return the result as an [ndarray](https://github.com/mikolalysenko/ndarray).  Written in 100% JavaScript, works both in browserify and in node.js and has no external native dependencies.

Currently the following file formats are supported:

* `PNG`
* `JPEG`
* `GIF`

Example
=======

```javascript
var getPixels = require("get-pixels")

getPixels("lena.png", function(err, pixels, frameInfo) {
  if(err) {
    console.log("Bad image path")
    return
  }
  console.log("got pixels", pixels.shape.slice())
})
```

Install
=======

    npm install get-pixels

### `require("get-pixels")(url[, type], cb(err, pixels, frameInfo))`
Reads all the pixels from url into an ndarray.

* `url` is the path to the file.  It can be a relative path, an http url, a data url, or an [in-memory Buffer](http://nodejs.org/api/buffer.html).
* `type` is an optional mime type for the image (required when using a Buffer)
* `cb(err, pixels, framesInfo)` is a callback which gets triggered once the image is loaded.

**Returns** An ndarray of pixels in raster order having shape equal to `[width, height, channels]` and **frameInfo** param if available (for animated GIFs).

**Note** For animated GIFs, a 4D array is returned with shape `[numFrames, width, height, 4]`, where each frame is a slice of the final array.

**frameInfo** is an Array of Objects with these fields:

Name|Type|Description
----|-----|-----------
x | Integer | Image Left Position
y | Integer | Image Top Position
width | Integer | Image Width
height | Integer | Image Height
has_local_palette | Boolean | Image local palette presentation flag
palette_offset | Integer | Image palette offset
palette_size | Integer | Image palette size
data_offset | Integer | Image data offset
data_length | Integer | Image data length
transparent_index | Integer | Transparent Color Index
interlaced | Boolean | Interlace Flag
delay | Integer | Delay Time (1/100ths of a second)
disposal | Integer | Disposal method

See GIF spec for details. Summary http://www.onicos.com/staff/iz/formats/gif.html


Credits
=======
(c) 2013-2014 Mikola Lysenko. MIT License
