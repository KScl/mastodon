import sha1 from 'sha1';

export function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export function getInstanceColor(domain) {
  if (domain != '')
    return sha1(domain).substr(0, 6);
  return 'ffffff';
}

export function getInstanceDomain(titleText, url) {
  if (titleText != '') {
    let parts = titleText.split('@');
    if (parts.length > 1)
      return parts[1];
  }

  let after_http = url.split('://')[1];
  if (after_http) {
    return after_http.split('/')[0];
  }

  return '';
}
