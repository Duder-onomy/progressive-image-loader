// Todo:
// It should be able to hot load images based on the bounding rect of the container,
//     choosing the right size and then hot loading in divisions of that.
// If internet is really good, it should skip the hotloader all togethor.
// If internet is REALLY slow, load half res only.
// if internet is just kinda slow, load 1/3 res, then 2/3 res, then full res.
// If internet is OK but on desktop, do the whole thing.
// If on mobile and on wifi, then do a certain percentage of the hot-loading
// switch to better promises

(function() {
  window.addEventListener('load', function() {
    var container = document.querySelector('#container'),
      imgElement = container.querySelector('img');

      clientBoundingRect = container.getBoundingClientRect(),
      imagePathArray = [
        '300x300.jpg',
        '600x600.jpg',
        '1200x1200.jpg',
        '1500x1500.jpg',
        '1800x1800.jpg'
      ];

      container.classList.add('is-loading');

      getCurrentInternetSpeed()
        .then(function(currentInternetSpeed) {
          console.log(currentInternetSpeed, ' kilobytes per second');

          return hotLoadImages(imgElement, imagePathArray, currentInternetSpeed);
        })
        .then(function() {
          console.log('first image loaded');
          container.classList.remove('is-loading');
        });
        // .finally(function() {
        //   console.log('complete');
        // });
  });

  function hotLoadImages(imgElement, imagePathArray, currentInternetSpeed) {
    return new Promise(function(resolve, reject) {
      imgElement.onload = function loadNextImage() {
        if(imagePathArray.length) {
          imgElement.src = imagePathArray.shift();
        }
        resolve();
      };

      imgElement.src = imagePathArray.shift();
    });
  }

  function getCurrentInternetSpeed() {

    function _getAndCacheInternetSpeed() {
      return new Promise(function(resolve, reject) {
        var initialTimer,
          imgElement = document.createElement('img'),
          src = '1400x1400@46kb.png';

        initialTimer = new Date().getTime();

        imgElement.onload = function() {
          var seconds = (new Date().getTime() - initialTimer) * 0.001,
            kbPerSecond = 46 / seconds;

          resolve(kbPerSecond);
        };

        imgElement.onerror = reject;

        imgElement.src = src;
      })
      .then(function(speed) {
        window.cachedSpeed = speed;
        return speed;
      })
      .catch(function(err) {
        throw new Error(err);
      });
    }

    if(window.cachedSpeed) {
      return Promise.resolve(window.cachedSpeed);
    } else {
      return _getAndCacheInternetSpeed();
    }

  }
})();
