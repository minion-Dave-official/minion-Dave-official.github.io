/*!
 * Live2D Widget - autoload.js (本地部署版)
 */

(function () {
  // 默认模型：Tia (modelId 1)，皮肤 sulbim-costume-snowflake (modelTexturesId 52)
  if (!localStorage.getItem('modelId')) {
    localStorage.setItem('modelId', '1');
  }
  if (!localStorage.getItem('modelTexturesId')) {
    localStorage.setItem('modelTexturesId', '52');
  }

  // 本地数据目录直链
  const base_url = '/live2d';
  const live2d_path = base_url + '/dist/';
  const model_path = base_url + '/';

  function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
      let tag;
      if (type === 'css') {
        tag = document.createElement('link');
        tag.rel = 'stylesheet';
        tag.href = url;
      } else if (type === 'js') {
        tag = document.createElement('script');
        tag.type = 'module';
        tag.src = url;
      }
      if (tag) {
        tag.onload = () => resolve(url);
        tag.onerror = () => reject(url);
        document.head.appendChild(tag);
      }
    });
  }

  (async () => {
    if (screen.width < 768) return;

    const OriginalImage = window.Image;
    window.Image = function (...args) {
      const img = new OriginalImage(...args);
      img.crossOrigin = 'anonymous';
      return img;
    };
    window.Image.prototype = OriginalImage.prototype;

    try {
      await Promise.all([
        loadExternalResource(live2d_path + 'waifu.css', 'css'),
        loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
      ]);

      initWidget({
        waifuPath: live2d_path + 'waifu-tips.json',
        cdnPath: base_url + '/',
        cubism2Path: live2d_path + 'live2d.min.js',
        cubism5Path: live2d_path + 'live2dcubismcore.min.js',
        tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
        logLevel: 'warn',
        drag: false, // 👈 这里改成了 false，关闭了拖动
        showToggleAfterQuit: true,
      });
    } catch (err) {
      console.error('Live2D 本地加载失败：', err);
    }
  })();
})();