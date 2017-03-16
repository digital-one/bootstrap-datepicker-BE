/**
 * Buddhist Era for bootstrap-datepicker.
 * @author Zercle Technology Co., Ltd. <info@zercle.org>
 */

;(function ($) {

  if (typeof $.fn.datepicker === 'undefined') {
    throw new Error('Load bootstrap-datepicker first !!!');
  }

  var DPGlobal = $.fn.datepicker.DPGlobal
    , adjYear = 543
    , currentYear = new Date().getFullYear();

  function adjFullYear(v) {
    var beBound = currentYear - (adjYear / 2);
    if (v >= beBound) {
      v -= adjYear;
    }

    if (v < beBound - adjYear) {
      v -= adjYear;
    }

    return v;
  }

  // Inherit DPGlobal from bootstrap-datepicker
  var _parentDPGlobal_ = $.extend({}, DPGlobal);
  $.extend(DPGlobal, {
    parseDate: function (date, format, language, assumeNearby) {

      var formats = format
        , parts = date && date.match(this.nonpunctuation) || [];

      if (typeof formats === 'string') {
        formats = DPGlobal.parseFormat(format);
      }
      if (parts.length == formats.parts.length) {
        var separators = $.extend([], formats.separators)
          , modDate = [];

        for (var i = 0, cnt = formats.parts.length; i < cnt; i++) {
          if (~['yyyy', 'yy'].indexOf(formats.parts[i])) {
            parts[i] = '' + adjFullYear(parseInt(parts[i] - adjYear, 10));
          }

          if (separators.length) {
            modDate.push(separators.shift());
          }

          modDate.push(parts[i])
        }

        date = modDate.join('');

        return _parentDPGlobal_.parseDate.call(this, date, format, language, assumeNearby);
      }
    },
    formatDate: function (date, format, language) {

      var childFormatDate = _parentDPGlobal_.formatDate.call(this, date, format, language);

      var formats = format
        , parts = childFormatDate && childFormatDate.match(this.nonpunctuation) || []
        , trnfrm = {
        yy: (adjYear + date.getUTCFullYear()).toString().substring(2)
        , yyyy: (adjYear + date.getUTCFullYear()).toString()
      };

      if (typeof formats === 'string') {
        formats = DPGlobal.parseFormat(format);
      }
      if (parts.length == formats.parts.length) {
        var separators = $.extend([], formats.separators)
          , modDate = [];

        for (var i = 0, cnt = formats.parts.length; i < cnt; i++) {
          if (separators.length) {
            modDate.push(separators.shift())
          }

          modDate.push(trnfrm[formats.parts[i]] || parts[i])
        }
        childFormatDate = modDate.join('')
      }

      return childFormatDate;
    }
  });

  // Inherit DatePicker from bootstrap-datepicker
  var DatePicker = $.fn.datepicker.Constructor;
  var _parentDatePicker_ = $.extend({}, DatePicker.prototype);

  $.extend(DatePicker.prototype, {
    _fill_yearsView: function (selector, cssClass, factor, step, currentYear, startYear, endYear, callback) {

      currentYear += adjYear;
      startYear += adjYear;
      endYear += adjYear;

      _parentDatePicker_._fill_yearsView.call(this, selector, cssClass, factor, step, currentYear, startYear, endYear, callback);
    }
  });

}(jQuery));