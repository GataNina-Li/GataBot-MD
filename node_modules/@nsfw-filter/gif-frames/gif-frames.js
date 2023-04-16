var MultiRange = require('multi-integer-range').MultiRange;
var getPixels = require('get-pixels-frame-info-update');
var savePixels = require('@nsfw-filter/save-pixels');

function nopromises () {
  throw new Error(
    'Promises not supported in your environment. ' +
    'Use the callback argument or a Promise polyfill.'
  );
}

var brokenPromise = {
  then: nopromises,
  catch: nopromises
};

function gifFrames (options, callback) {
  options = options || {};
  callback = callback || function () {};

  var promise;
  var resolve;
  var reject;
  if (typeof Promise === 'function') {
    promise = new Promise(function (_resolve, _reject) {
      resolve = function (res) {
        callback(null, res);
        _resolve(res);
      };
      reject = function (err) {
        callback(err);
        _reject(err);
      };
    });
  } else {
    promise = brokenPromise;
    resolve = function (res) {
      callback(null, res);
    };
    reject = callback;
  }

  var url = options.url;
  if (!url) {
    reject(new Error('"url" option is required.'));
    return promise;
  }
  var frames = options.frames;
  if (!frames && frames !== 0) {
    reject(new Error('"frames" option is required.'));
    return promise;
  }
  var outputType = options.outputType || 'jpg';
  var quality = options.quality;
  var cumulative = options.cumulative;

  var acceptedFrames = frames === 'all' ? 'all' : new MultiRange(frames);

  // Necessary to check if we're in Node or the browser until this is fixed:
  // https://github.com/scijs/get-pixels/issues/33
  var inputType = typeof window === 'undefined' ? 'image/gif' : '.GIF';
  getPixels(url, inputType, function (err, pixels, framesInfo) {
    if (err) {
      reject(err);
      return;
    }
    if (pixels.shape.length < 4) {
      reject(new Error('"url" input should be multi-frame GIF.'));
      return;
    }
    var frameData = [];
    var maxAccumulatedFrame = 0;
    for (var i = 0; i < pixels.shape[0]; i++) {
      if (acceptedFrames !== 'all' && !acceptedFrames.has(i)) {
        continue;
      }
      (function (frameIndex) {
        frameData.push({
          getImage: function () {
            if (cumulative && frameIndex > maxAccumulatedFrame) {
              // for each frame, replace any invisible pixel with
              // the corresponding pixel from the previous frame (beginning
              // with the second frame).
              // to avoid doing too much work at once we only compute the
              // frames up to and including the requested frame.
              var lastFrame = pixels.pick(maxAccumulatedFrame);
              for (var f = maxAccumulatedFrame + 1; f <= frameIndex; f++) {
                var frame = pixels.pick(f);
                for (var x = 0; x < frame.shape[0]; x++) {
                  for (var y = 0; y < frame.shape[1]; y++) {
                    if (frame.get(x, y, 3) === 0) {
                      // if alpha is fully transparent, use the pixel
                      // from the last frame
                      frame.set(x, y, 0, lastFrame.get(x, y, 0));
                      frame.set(x, y, 1, lastFrame.get(x, y, 1));
                      frame.set(x, y, 2, lastFrame.get(x, y, 2));
                      frame.set(x, y, 3, lastFrame.get(x, y, 3));
                    }
                  }
                }
                lastFrame = frame;
              }
              maxAccumulatedFrame = frameIndex;
            }
            return savePixels(pixels.pick(frameIndex), outputType, {
              quality: quality
            });
          },
          frameIndex: frameIndex,
          frameInfo: framesInfo && framesInfo[frameIndex]
        });
      })(i);
    }
    resolve(frameData);
  });

  return promise;
}

module.exports = gifFrames;
