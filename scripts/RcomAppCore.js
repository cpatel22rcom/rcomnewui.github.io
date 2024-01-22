var Rcom = Rcom || {};

Rcom.createNS = function (namespace) {
  var nsparts = namespace.split(".");
  var parent = Rcom;
  if (nsparts[0] === "Rcom") {
    nsparts = nsparts.slice(1);
  }
  for (var i = 0; i < nsparts.length; i++) {
    var partname = nsparts[i];
    if (typeof parent[partname] === "undefined") {
      parent[partname] = {};
    }
    parent = parent[partname];
  }
  return parent;
};

Rcom.isJqueryIncluded = function (moduleName) {
  if (typeof jQuery === "undefined") {
    console.error(
      `jQuery is required for ${moduleName}. Please include jQuery before this module.`
    );
    console.warn('Please include cdn link: https://code.jquery.com/jquery-3.7.1.min.js')
    return {};
  }
};

Rcom.isSlickSliderIncluded = function () {
  if (typeof $.fn.slick === "undefined") {
    console.error(
      "Slick Slider is required for CustomSliderModule. Please include Slick Slider before this module."
    );
    console.warn('Please include cdn links: //cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css and //cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js')
    return {};
  }
}

Rcom.isIntlTelInputIncluded = function () {
  if (typeof intlTelInput === "undefined") {
    console.error(
      'CountryCodeDropdownModule requires intlTelInput. Please include intlTelInput before this module.'
    );
    console.warn('Please include cdn link: https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js');
    return {};
  }
};

Rcom.isDaterangepickerIncluded = function () {
  if (typeof daterangepicker === "undefined") {
    console.error(
      `DateRangePickerModule requires daterangepicker. Please include daterangepicker before this module.`
    );
    console.warn('Please include cdn link: https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    return {};
  }
};

Rcom.isLeafletIncluded = function () {
  if (typeof L === "undefined") {
    console.error(
      `MapModule requires Leaflet. Please include Leaflet before this module.`
    );
    console.warn('Please include cdn links: https://unpkg.com/leaflet@1.9.4/dist/leaflet.css and https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    return {};
  }
};

Rcom.isMomentIncluded = function (moduleName) {
  if (typeof moment === "undefined") {
    console.error(
      `${moduleName} requires Moment.js. Please include Moment.js before this module.`
    );
    console.warn('Please include cdn link: https://cdn.jsdelivr.net/npm/moment@2.30.1/moment.min.js');
    return {};
  }
};

Rcom.Constants = {
  noAvailability: false
};

Rcom.QSParameters = {
  'rc-ppid': 3,
  rmcid: 'HA',
  cn: 'PS_20240110T183046_mELXZoYxxn3U%2BOSLr9GvaSZ5Hm0GG9vjZVNHo9IXFMs%3D',
}