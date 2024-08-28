const mpn65 = [
  '#ff0029', '#377eb8', '#66a61e', '#984ea3', '#00d2d5', '#ff7f00', '#af8d00',
  '#7f80cd', '#b3e900', '#c42e60', '#a65628', '#f781bf', '#8dd3c7', '#bebada',
  '#fb8072', '#80b1d3', '#fdb462', '#fccde5', '#bc80bd', '#ffed6f', '#c4eaff',
  '#cf8c00', '#1b9e77', '#d95f02', '#e7298a', '#e6ab02', '#a6761d', '#0097ff',
  '#00d067', '#000000', '#252525', '#525252', '#737373', '#969696', '#bdbdbd',
  '#f43600', '#4ba93b', '#5779bb', '#927acc', '#97ee3f', '#bf3947', '#9f5b00',
  '#f48758', '#8caed6', '#f2b94f', '#eff26e', '#e43872', '#d9b100', '#9d7a00',
  '#698cff', '#d9d9d9', '#00d27e', '#d06800', '#009f82', '#c49200', '#cbe8ff',
  '#fecddf', '#c27eb6', '#8cd2ce', '#c4b8d9', '#f883b0', '#a49100', '#f48800',
  '#27d0df', '#a04a9b'
]

export function palette(numOfSteps, step, palette = 'mpn65') {

  if (palette === 'mpn65') {
    return getMpn65(step)
  } else if (palette === 'rainbow') {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
      case 0:
        r = 1;
        g = f;
        b = 0;
        break;
      case 1:
        r = q;
        g = 1;
        b = 0;
        break;
      case 2:
        r = 0;
        g = 1;
        b = f;
        break;
      case 3:
        r = 0;
        g = q;
        b = 1;
        break;
      case 4:
        r = f;
        g = 0;
        b = 1;
        break;
      case 5:
        r = 1;
        g = 0;
        b = q;
        break;
    }
    var c =
      '#' +
      ('00' + (~~(r * 255)).toString(16)).slice(-2) +
      ('00' + (~~(g * 255)).toString(16)).slice(-2) +
      ('00' + (~~(b * 255)).toString(16)).slice(-2);
    return c;
  } else {
    return getMpn65(step)
  }
}

function getMpn65(step) {
  return mpn65[step % mpn65.length]
}
