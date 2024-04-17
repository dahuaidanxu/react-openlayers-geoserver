import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { Zoomify } from 'ol/source';
import path from 'path-browserify';

const MapComponent = () => {
  const currentAllImage = [];
  useEffect(() => {
    // GeoServer WMS URL

    const sid = "65d1a535a07b7e1000e52c04";
    const token = "eyJhbGciOiJIUzUxMiIsImlhdCI6MTcxMjA2MjgzOSwiZXhwIjoxNzE0NjU0ODM5fQ.eyJpZCI6IjY1Njk5MjQ0YWY4YmU1ODU3ODVkMWNhOSJ9.QzoLXHu8n62-R-R2OPE5Ax6sW3hVoU7lRus99CGpAetJhAo7HIbHKSbkjmVxTaviYQaribDz2-Ptfny-YO-swg";
    const imageWeight = 91136;
    const imageHeight = 68096;
    const baseurl = '/hg/';
    const tokenHeaders = new Headers();// HTTP 请求头
    tokenHeaders.append('Authorization', "Token " + token);

    const getUrl = (sid) => {
      // 判断 Zoomify 数据源是否可用，如果不可用则使用普通图片路径
      var url = '/hg/image/' + sid + '/{TileGroup}/{z}/{x}_{y}.jpeg';
      let r = new XMLHttpRequest();
      r.open('GET', '/hg/image/' + sid + '/8/0_0.jpeg', false)
      r.send(null);
      return url;
    }

    const zoomifySource = new Zoomify({
      url: sid ? getUrl(sid) : '',
      crossOrigin: 'anonymous',
      size: [imageWeight, imageHeight],
      cacheSize: 2000
    });

    zoomifySource.setTileLoadFunction(async function (imageTile, src) {
      src = path.resolve(src.replace(/TileGroup\d+/, ''));
      let _srcArr = src.split('/');
      let z = _srcArr[_srcArr.length - 2];
      _srcArr[_srcArr.length - 2] = parseInt(z) + 8;
      src = _srcArr.join('/');

      try {
        const blob = await getImg(src);
        var objectURL = URL.createObjectURL(blob);
        // imageTile.getImage().src = objectURL;
        currentAllImage.push({ tile: imageTile, src: objectURL });
      } catch (error) {
        console.log(error)
      }
    })

    // 获取图片数据
    const getImg = (url) => {
      return tFetch(url).then(checkStatus).then(parseBLOB);
    }

    const checkStatus = (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else if (response.status === 401) {

      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }

    const parseBLOB = (response) => {
      return response.blob();
    }

    // 封装 fetch 请求，添加授权头
    const tFetch = (url, method = 'GET') => {
      var prefixedUrl = url.startsWith(baseurl) ? url : baseurl + url;
      var myRequest = new Request(prefixedUrl, {
        headers: tokenHeaders,
        method,
      });
      return fetch(myRequest)
    }
    // OpenLayers Map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: zoomifySource,
        }),
      ],
      view: new View({
        center: [imageWeight / 2, -imageHeight / 2],
        zoom: 11,
        maxZoom: 16,
        minZoom: 10
      }),

      // controls: [],
    });
    zoomifySource.on('tileloadstart', function (event) {
      console.log('Tile load started', { time: new Date().getTime() }, event);
      if (currentAllImage.length) {
        currentAllImage[0].tile.getImage().src = currentAllImage[0].src;
      }
    });

    zoomifySource.on('tileloadend', function (event) {
      console.log('Tile load ended', { time: new Date().getTime() }, event);
      // zoomifySource.dispose();
      showAllImage();

    });

    const showAllImage = () => {
      if (currentAllImage.length) {
        currentAllImage.forEach((item) => {
          item.tile.getImage().src = item.src;
        })

        currentAllImage = [];
      } else {
        console.log('当前没有图块数据')
      }
    }
    return () => {
      map.dispose();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default MapComponent;
